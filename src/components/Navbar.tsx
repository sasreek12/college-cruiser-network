
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if the user is logged in (for now, just check if on welcome page)
  const isLoggedOut = location.pathname === '/' || 
                      location.pathname === '/login' || 
                      location.pathname === '/signup';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Host a Ride', href: '/host-ride' },
    { name: 'Book a Ride', href: '/book-ride' },
    { name: 'Ride History', href: '/ride-history' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isLoggedOut ? '/' : '/dashboard'} className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-golocal-primary">Go Local</span>
            </Link>
          </div>
          
          {!isLoggedOut && (
            <>
              {/* Desktop navigation */}
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.href
                        ? 'text-golocal-primary font-semibold'
                        : 'text-gray-600 hover:text-golocal-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* User dropdown - simplified version */}
              <div className="hidden md:ml-4 md:flex md:items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => {}} 
                  className="text-gray-600 hover:text-golocal-primary"
                >
                  Logout
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-golocal-primary focus:outline-none"
                >
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}
          
          {isLoggedOut && !isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-golocal-primary hover:text-golocal-secondary">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-golocal-primary hover:bg-golocal-secondary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu, toggle based on menu state */}
      {isMenuOpen && !isLoggedOut && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? 'bg-golocal-softpurple text-golocal-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-golocal-primary'
                }`}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <Button 
              variant="ghost" 
              onClick={() => {}} 
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-golocal-primary"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
