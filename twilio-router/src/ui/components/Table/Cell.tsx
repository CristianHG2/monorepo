import React, {ReactNode} from 'react';
import {classNames} from '../../support/utils';

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <td
    className={classNames(
      className ?? '',
      'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
    )}
  >
    {children}
  </td>
);

export default Cell;
