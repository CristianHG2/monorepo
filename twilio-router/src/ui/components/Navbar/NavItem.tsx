import React, {FC} from 'react';
import {classNames} from '../../support/utils';
import {NavItemType} from './index';
import {Link, useRoute} from 'wouter';

const NavItem = ({item}: {item: NavItemType}) => {
  const [current, params] = useRoute(item.href);

  return (
    <Link
      key={item.name}
      href={item.href}
      className={classNames(
        current
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
      )}
    >
      <item.icon
        className={classNames(
          current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
          'mr-3 flex-shrink-0 h-6 w-6',
        )}
      />
      {item.name}
    </Link>
  );
};

export default NavItem;
