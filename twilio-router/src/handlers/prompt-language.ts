import {CallFlowHandler} from '../types';

const handler: CallFlowHandler = async (caller, req, res) => {
  res.gather({
    handler: 'handleLanguage',
    recording: 'LanguageSelect',
  });

  return res;
};

export default handler;
