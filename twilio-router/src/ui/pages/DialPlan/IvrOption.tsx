import React from 'react';

const IvrOption = ({number, legend}: {number: string; legend: string}) => {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full shadow text-gray-600 bg-gray-200">
        {number}
      </div>
      <span>{legend}</span>
    </div>
  );
};

export default IvrOption;
