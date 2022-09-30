import {CallFlowHandler, MessagePayload} from '../types';
import {optionRange, testTargetNumber} from '../support/utils';

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

  const opt = parseInt(req.Digits);

  res.twiml.dial(testTargetNumber);

  return res;
};

export default handler;
