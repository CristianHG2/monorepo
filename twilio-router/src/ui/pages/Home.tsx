import React from 'react';
import {HomeIcon} from '@heroicons/react/24/outline';
import Title from '../components/Typography/Title';
import CallToAction from '../components/CallToAction';
import ActionBox from '../components/CallToAction/ActionBox';
import {
  AdjustmentsVerticalIcon,
  FaceSmileIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <>
      <Title title={'What are we getting into today?'} />
      <CallToAction>
        <ActionBox
          title={'Dial Plan'}
          icon={AdjustmentsVerticalIcon}
          href="dialplan"
        >
          <p>Options, IVR customization, and call routing.</p>
        </ActionBox>
        <ActionBox title={'Recordings'} icon={MicrophoneIcon} href="recordings">
          <p>Manage adaptive, multi-language recording files for all brands.</p>
        </ActionBox>
        <ActionBox title={'IVR Brands'} icon={FaceSmileIcon} href="dialplan">
          <p>
            Brand identities, and their dynamic routing and language options.
          </p>
        </ActionBox>
      </CallToAction>
    </>
  );
};

export const order = 1;
export const name = 'Home';
export const icon = HomeIcon;
export default Home;
