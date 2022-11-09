import React from 'react';
import NavItem from './NavItem';
// @ts-ignore
import logo from '../../assets/logo.png';

export type NavItemType = {
  href: string;
  name: string;
  icon: React.ComponentType<any>;
};

const Navbar = ({items}: {items: NavItemType[]}) => {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
          <img className="h-8 w-auto mx-auto" src={logo} alt="Your Company" />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {items.map(item => (
              <NavItem item={item} key={item.name} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
