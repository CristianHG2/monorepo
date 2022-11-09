import log from 'loglevel';

export const executeRpc = async (
  module: string,
  handler: string,
  data: any,
): Promise<any> => {
  const _esm = await import(`../ui/${module}.js`);
  const _rpc = await _esm['rpcDefinition']();

  if (typeof _rpc[handler] !== 'function') {
    log.error(`RPC handler ${handler} not found in module ${module}`);
    return {};
  }

  const response = await _rpc[handler](data);
  log.debug(`RPC response:`, response);

  return response;
};
