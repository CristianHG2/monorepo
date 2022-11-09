import React from 'react';
import {createRoot} from 'react-dom/client';
import Layout from './components/Layout';
import {Route} from 'wouter';
import {LinkIcon} from '@heroicons/react/24/outline';

const pages = import.meta.glob('./pages/*.tsx', {
  eager: true,
});

const routes = Object.keys(pages)
  .map(path => {
    const module = pages[path] as {
      default: React.ComponentType;
      name?: string;
      icon?: React.ComponentType;
      order?: number;
    };

    const name = path.replace('./pages/', '').replace('.tsx', '');
    const routeKey = name === 'Home' ? '/' : `/${name.toLowerCase()}`;

    const ucfirst = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return {
      module: module.default as (...args: any) => JSX.Element,

      name: module.name || ucfirst(name),
      href: routeKey,
      icon: module.icon || LinkIcon,
      order: module.order || 0,
    };
  })
  .sort((a, b) => b.order - a.order);

const App = () => {
  return (
    <Layout navItems={routes}>
      {routes.map(route => (
        <Route path={route.href} key={route.href}>
          {params => <route.module {...params} />}
        </Route>
      ))}
    </Layout>
  );
};

const root = document.getElementById('root') as HTMLElement;
createRoot(root).render(<App />);
