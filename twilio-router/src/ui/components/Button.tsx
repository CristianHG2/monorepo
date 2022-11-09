import React, {ComponentType, ReactNode} from 'react';
import {classNames} from '../support/utils';
import {Cog6ToothIcon} from '@heroicons/react/24/solid';

const Button = ({
  children,
  className,
  type = 'button',
  variant = 'secondary',
  ...props
}: {
  children: ReactNode;
  leftIcon?: ComponentType<{className: string}>;
  className?: string;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
}) => {
  return (
    <button
      type={type}
      className={classNames(
        'flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary'
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-350 focus:ring-gray-500',
        className ?? '',
      )}
    >
      {props.leftIcon && (
        <div className="flex items-center gap-2">
          <props.leftIcon className="h-4" />
          <span>{children}</span>
        </div>
      )}

      {!props.leftIcon && children}
    </button>
  );
};

export default Button;
