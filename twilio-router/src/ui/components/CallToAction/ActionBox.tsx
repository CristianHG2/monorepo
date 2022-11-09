import React from 'react';
import {classNames} from '../../support/utils';
import {ComponentType, ReactNode} from 'react';
import {Link} from 'wouter';

type ActionBoxProps = {
  title: string;
  icon: ComponentType<{className: string}>;
  children: ReactNode;
  href: string;
};

const ActionBox = ({title, icon, children, href}: ActionBoxProps) => {
  const ActionIcon = icon;

  return (
    <div
      className={classNames(
        'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
      )}
    >
      <Link href={href}>
        <div>
          <span
            className={classNames(
              'text-blue-900',
              'bg-blue-50',
              'rounded-lg inline-flex p-3 ring-4 ring-white',
            )}
          >
            <ActionIcon className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </h3>
          <div className="mt-2 text-sm text-gray-500">{children}</div>
        </div>
        <span
          className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
          </svg>
        </span>
      </Link>
    </div>
  );
};

export default ActionBox;
