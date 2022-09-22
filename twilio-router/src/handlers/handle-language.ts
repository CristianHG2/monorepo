import {CallFlowHandler, MessagePayload} from '../types';
import {optionRange, uri} from '../support/utils';

const handler: CallFlowHandler<MessagePayload & {Digits: string}> = async (
  caller,
  req,
  res,
) => {
  if (!optionRange(req, 2, 1)) {
    res.invalid();
    res.twiml.redirect(uri('promptLanguage'));
    return res;
  }

  await caller.setLanguage(req.Digits === '1' ? 'English' : 'Spanish');
  res.gather({handler: 'handleGreeting', recording: 'Greeting'});
  return res;
};

export default handler;
