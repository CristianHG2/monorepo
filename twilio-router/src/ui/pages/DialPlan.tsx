import React, {FC} from 'react';
import {AdjustmentsVerticalIcon} from '@heroicons/react/24/outline';
import Title from '../components/Typography/Title';
import Button from '../components/Button';
import {Cog6ToothIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import PlanStepBox from './DialPlan/PlanStepBox';
import PlanArrowRight from './DialPlan/PlanArrowRight';
import IvrOption from './DialPlan/IvrOption';

export const rpcDefinition = async () => {
  return {
    list: async () => {
      return [{name: 'Jeff'}];
    },
  };
};

const DialPlan: FC<object> = () => {
  // const {rpc, rpcState} = useRpc<typeof rpcDefinition>(import.meta.url);
  // const steps = rpcState('list');

  return (
    <div>
      <Title
        title="Dial Plan"
        subtitle="Manage options, recording selections, and routing"
      />

      <div className="flex w-full">
        <PlanStepBox label="Company Selection" locked={true}>
          <Button leftIcon={Cog6ToothIcon} className="mx-auto">
            Number Roster
          </Button>
        </PlanStepBox>
        <PlanArrowRight />
        <PlanStepBox label="Language Selection" locked={true}>
          <div className="flex flex-col gap-4">
            <IvrOption number={'1'} legend={'English'} />
            <IvrOption number={'2'} legend={'Spanish'} />
          </div>
        </PlanStepBox>
        <PlanArrowRight />
        <PlanStepBox label="IVR Menu 1">
          <div className="flex flex-col gap-4">
            <IvrOption number={'1'} legend={'Sales'} />
            <IvrOption number={'2'} legend={'Payroll'} />
            <IvrOption number={'3'} legend={'Enrollments'} />
            <IvrOption number={'4'} legend={'Reception'} />
          </div>
        </PlanStepBox>
        <div className="w-16 flex items-center mx-4">
          <PlusCircleIcon className="cursor-pointer text-emerald-600 hover:text-emerald-700" />
        </div>
      </div>
    </div>
  );
};

export const icon = AdjustmentsVerticalIcon;
export const name = 'Dial Plan';
export default DialPlan;
