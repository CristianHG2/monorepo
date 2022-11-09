import React from 'react';
import {classNames} from '../../support/utils';

const Title = ({title, subtitle}: {title: string; subtitle?: string}) => {
  return (
    <>
      <h1
        className={classNames(
          subtitle ? 'mb-2' : 'mb-7',
          'text-2xl font-semibold text-gray-900 mt-3',
        )}
      >
        {title}
      </h1>

      {subtitle && (
        <h2 className="text italic text-gray-500 mb-7">{subtitle}</h2>
      )}
    </>
  );
};

export default Title;
