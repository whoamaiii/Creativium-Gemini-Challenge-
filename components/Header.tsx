import { useState, useEffect } from 'react';
import { BrainCircuit, Menu, X, BookOpen } from './icons';
import useReducedMotion from '../hooks/useReducedMotion';

const NavLink: React.FC<{ href: string; children: React.ReactNode; currentPath: string }> = ({ href, children, currentPath }) => {
  const isActive = currentPath.startsWith(href.substring(1)); // #/reports starts with /reports
  return (
    <a
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted hover:bg-surface-2 hover:text-text'
      }`}
    >
      {children}
    </a>
  );
};


const Header: React.FC = () => {
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const handleHashChange = () => {
          setCurrentPath(window.location.hash || '#/');
          setIsMenuOpen(false); // Close menu on navigation
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const navItems = (
        <>
            <NavLink href="#/" currentPath={currentPath}>Track Session</NavLink>
            <NavLink href="#/reports" currentPath={currentPath}>Reports</NavLink>
            <NavLink href="#/sessions" currentPath={currentPath}>Sessions</NavLink>
            <NavLink href="#/students" currentPath={currentPath}>Students</NavLink>
            <NavLink href="#/goals" currentPath={currentPath}>Goals</NavLink>
            <NavLink href="#/insights" currentPath={currentPath}>Insights</NavLink>
            <NavLink href="#/coach" currentPath={currentPath}>Coach</NavLink>
        </>
    );

    const transitionClasses = prefersReducedMotion 
        ? 'transition-opacity duration-200' 
        : 'transition-all duration-300 transform';

  return (
    <header className="bg-surface/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#/" className="flex items-center gap-2 text-text font-bold">
            <BrainCircuit size={28} className="text-brand" />
            <span>Kreativium</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems}
          </nav>

          <div className="md:hidden">
             <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-text hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`md:hidden ${transitionClasses} ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems}
        </div>
      </div>
    </header>
  );
};

export default Header;