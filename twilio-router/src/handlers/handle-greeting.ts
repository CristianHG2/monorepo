import {CallFlowHandler, MessagePayload} from '../types';
import {optionRange} from '../support/utils';

const handler: CallFlowHandler<MessagePayload & {Digits: string}> = async (
  caller,
  req,
  res,
) => {
  if (!optionRange(req, 3)) {
    res.invalid();
    res.gather({handler: 'handleGreeting', recording: 'Greeting'});
    return res;
  }

  return res;
};

export default handler;
