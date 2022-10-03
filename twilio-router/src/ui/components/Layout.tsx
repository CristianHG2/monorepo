import React, {FC, ReactNode} from 'react';
import Navbar, {NavItemType} from './Navbar';
import SearchBar from './SearchBar';

const Layout: FC<{children: ReactNode; navItems: NavItemType[]}> = ({
  children,
  navItems,
}) => {
  return (
    <>
      <div>
        <Navbar items={navItems} />
        <div className="flex flex-col md:pl-64">
          <SearchBar />

          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
