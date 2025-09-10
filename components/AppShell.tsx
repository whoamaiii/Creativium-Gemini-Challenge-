import React from 'react';
import Header from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
