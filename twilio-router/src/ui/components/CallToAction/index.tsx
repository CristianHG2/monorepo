import React, {ReactNode} from 'react';

const CallToAction = ({children}: {children: ReactNode}) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
      {children}
    </div>
  );
};

export default CallToAction;
