import React, {ReactNode} from 'react';
import {
  LockClosedIcon,
  MicrophoneIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';

const PlanStepBox = ({
  label,
  children,
  locked = false,
}: {
  label: string;
  children: ReactNode;
  locked?: boolean;
}) => {
  return (
    <div className="flex flex-col border shadow rounded-lg w-auto text-center bg-white w-56">
      <div className="font-semibold bg-slate-100 text-gray-700 p-2 rounded-lg flex place-items-center gap-2 justify-center">
        {locked ? (
          <LockClosedIcon className="h-3" />
        ) : (
          <PencilIcon className="h-3" />
        )}
        {label}
      </div>
      <div className="flex-1 flex items-center p-6">{children}</div>
      <div className="place-self-end text-center p-2 text-xs w-full">
        <div className="flex place-items-center gap-2 justify-center pb-2 underline decoration-gray-300 cursor-pointer">
          <MicrophoneIcon className="h-4 text-gray-500" />
          <div className="text-gray-500 hover:text-gray-700">SET RECORDING</div>
        </div>
      </div>
    </div>
  );
};

export default PlanStepBox;
