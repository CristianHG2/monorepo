import {CallFlowHandler, MessagePayload} from '../types';

const handler: CallFlowHandler<MessagePayload & {Digits: string}> = async (
  caller,
  req,
  res,
) => {
  res.say('We made it! Goodbye');
  return res;
};

export default handler;
