import {CallFlowHandler} from '../types';
import {uri} from '../support/utils';

const handler: CallFlowHandler = async (caller, req, res) => {
  res
    .gather({
      action: uri('handleLanguage'),
      input: ['dtmf'],
      numDigits: 1,
    })
    .say(caller.getRecording('LanguageSelect'));

  return res;
};

export default handler;
