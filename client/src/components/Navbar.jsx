import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogOut, Menu, X, Home, Layers } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const { t } = useTranslation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // nav links with explicit Tailwind-safe classes for varied accents
  const navLinks = isAuthenticated
    ? [
        {
          to: '/dashboard',
          label: t('nav.dashboard'),
          hoverClass: 'hover:text-agri-700 px-3 py-1 rounded-md no-underline',
          activeClass: 'bg-agri-600 text-white',
        },
        {
          to: '/recommend',
          label: t('nav.recommend'),
          hoverClass: 'hover:text-sun-700 px-3 py-1 rounded-md no-underline',
          activeClass: 'bg-sun-600 text-white',
        },
        {
          to: '/forecast',
          label: t('nav.forecast'),
          hoverClass: 'hover:text-blue-700 px-3 py-1 rounded-md no-underline',
          activeClass: 'bg-blue-600 text-white',
        },
        {
          to: '/price-prediction',
          label: t('nav.pricePrediction'),
          hoverClass: 'hover:text-soil-700 px-3 py-1 rounded-md no-underline',
          activeClass: 'bg-soil-600 text-white',
        },
        {
          to: '/diagnose',
          label: t('nav.diagnose'),
          hoverClass: 'hover:text-agri-800 px-3 py-1 rounded-md no-underline',
          activeClass: 'bg-agri-700 text-white',
        },
      ]
    : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-agri-500" />
            <span className="text-2xl font-bold text-agri-700 font-heading">{t('brand')}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="group flex items-center space-x-2 text-gray-700 hover:text-agri-700 px-3 py-1 rounded-md no-underline transition-colors">
              <Home className="h-5 w-5 text-agri-500 group-hover:text-agri-700 transition-colors" />
              <span className="font-medium group-hover:text-agri-700">{t('nav.home', 'Home')}</span>
            </Link>
            <Link to="/#features" className="group flex items-center space-x-2 text-gray-700 hover:text-agri-700 px-3 py-1 rounded-md no-underline transition-colors">
              <Layers className="h-5 w-5 text-agri-500 group-hover:text-agri-700 transition-colors" />
              <span className="font-medium group-hover:text-agri-700">{t('nav.features', 'Features')}</span>
            </Link>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-gray-700 transition-colors font-medium ${link.hoverClass} ${
                    isActive ? link.activeClass : ''
                  } font-heading no-underline`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {/* Single consolidated language selector for desktop */}
            <div className="ml-4">
              <LanguageSwitcher className="" />
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-agri-700 hover:text-agri-900 transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  {t('nav.signup')}
                </Link>
                {/* Duplicate language switcher for visual balance on large screens */}
                {/* language switcher removed from here to avoid duplication on desktop */}
              </div>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group block text-gray-700 hover:text-agri-700 px-3 py-2 rounded-md no-underline transition-colors font-medium"
            >
              <span className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-agri-500 group-hover:text-agri-700 transition-colors" />
                <span className="group-hover:text-agri-700">{t('nav.home', 'Home')}</span>
              </span>
            </Link>
            <Link
              to="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="group block text-gray-700 hover:text-agri-700 px-3 py-2 rounded-md no-underline transition-colors font-medium"
            >
              <span className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-agri-500 group-hover:text-agri-700 transition-colors" />
                <span className="group-hover:text-agri-700">{t('nav.features', 'Features')}</span>
              </span>
            </Link>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-gray-700 transition-colors font-medium ${link.hoverClass} ${
                    isActive ? link.activeClass : ''
                  } no-underline`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors font-medium w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-green-600 transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-center"
                >
                  {t('nav.signup')}
                </Link>
                <div className="pt-2">
                  <LanguageSwitcher className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
