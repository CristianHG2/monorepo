import express from 'express';
import {handler} from './index';
import {Context} from '@twilio-labs/serverless-runtime-types/types';

export const baseUrl = 'https://twilio-router-test.ngrok.io';

const app = express();
const port = 3020;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/', (req, res) => {
  console.log(req.body);

  handler({} as Context, req.body, (err, twiml: any) => {
    console.log(twiml);
    res.send(twiml.toString());
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
