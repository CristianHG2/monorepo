import {useEffect, useMemo, useState} from 'react';

type Callable = <T extends Record<string, any>>(params?: T) => any;

type RpcDefinition = {
  [key: string]: Callable;
};

type RpcFactory = () => Promise<RpcDefinition>;

const rpcUri = 'http://localhost:3020/_rpc';

const useRpc = <
  RPC extends RpcFactory,
  Members extends RpcDefinition = Awaited<ReturnType<RPC>>,
  RPCKey extends keyof Members = keyof Members,
>(
  caller: string,
) => {
  type RpcPromise<K extends RPCKey> = (
    ...args: Parameters<Members[K]>
  ) => Promise<ReturnType<Members[K]>>;

  const modulePath = [...(caller.match(/\/src\/ui\/([^.?]*)/) || [])][1];

  const proxy = new Proxy({} as Members, {
    get:
      (target, prop) =>
      async (...args: any) => {
        const response = await fetch(`${rpcUri}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            module: modulePath,
            handler: prop,
            data: args,
          }),
        });

        return (await response.json()).data;
      },
  }) as {
    [K in RPCKey]: RpcPromise<K>;
  };

  type RPCState<T extends RPCKey> = {
    loading: boolean;
    data?: Awaited<ReturnType<Members[T]>>;
  };

  return {
    rpc: proxy,
    rpcState: useMemo(
      () =>
        <T extends RPCKey>(call: T) => {
          const [state, setState] = useState<RPCState<T>>({
            loading: false,
          });

          const refresh = async () => {
            setState({loading: true});

            const callable = proxy[call] as () => ReturnType<Members[T]>;
            const data = await callable();

            setState({loading: false, data});
          };

          useEffect(() => {
            void refresh();
          }, [call]);

          return {
            refresh,
            data: state.data,
            loading: state.loading,
          };
        },
      [],
    ),
  };
};

export default useRpc;
