import {CallFlowHandler, MessagePayload} from '../types';
import {uri} from '../support/utils';
import {state} from '../support/state';

const handler: CallFlowHandler<MessagePayload & {Digits: string}> = async (
  caller,
  req,
  res,
) => {
  if (['1', '2'].includes(req.Digits)) {
    await caller.setLanguage(req.Digits === '1' ? 'English' : 'Spanish');
  } else {
    res.say('Invalid option');
    res.redirect(uri('promptLanguage'));
    return res;
  }

  res
    .gather({
      action: uri('handleGreeting'),
      input: ['dtmf'],
      numDigits: 1,
    })
    .say(
      {
        language: caller.data.language === 'English' ? 'en-US' : 'es-US',
      },
      caller.getRecording('Greeting'),
    );
  return res;
};

export default handler;
