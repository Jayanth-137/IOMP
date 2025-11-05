import {Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  LogOut,
  Menu,
  X,
  Home,
  Layers,
  Grid,
  TrendingUp,
  DollarSign,
  Stethoscope,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');
  const { t } = useTranslation();

  useEffect(() => {
  if (location.hash) {
    const element = document.querySelector(location.hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}, [location]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Base links (Home + Features) followed by auth-only links
  const authLinks = [
    {
      to: '/dashboard',
      label: t('nav.dashboard'),
      // icon: Grid,
      hoverClass: 'hover:text-agri-700 px-3 py-1 rounded-md no-underline',
      activeClass: 'bg-agri-100 text-black',
    },
    {
      to: '/recommend',
      label: t('nav.recommend'),
      icon: Sprout,
      iconClass:'text-agri-700',
      hoverClass: 'hover:text-agri-700 px-3 py-1 rounded-md no-underline',
      activeClass: 'bg-agri-100 text-black',
    },
    {
      to: '/forecast',
      label: t('nav.forecast'),
      icon: TrendingUp,
      iconClass:'text-blue-700',
      hoverClass: 'hover:text-blue-700 px-3 py-1 rounded-md no-underline',
      activeClass: 'bg-blue-100 text-black',
    },
    {
      to: '/price-prediction',
      label: t('nav.pricePrediction'),
      icon: DollarSign,
      iconClass:'text-soil-700',
      hoverClass: 'hover:text-soil-700 px-3 py-1 rounded-md no-underline',
      activeClass: 'bg-soil-100 text-black',
    },
    {
      to: '/diagnose',
      label: t('nav.diagnose'),
      icon: Stethoscope,
      iconClass:'text-red-800',
      hoverClass: 'hover:text-red-800 px-3 py-1 rounded-md no-underline',
      activeClass: 'bg-red-100 text-black',
    },
  ];

  // When not authenticated show only Home + Features. When authenticated show only app links.
  const links = !isAuthenticated
    ? [
        {
          to: '/',
          label: t('nav.home', 'Home'),
          icon: Home,
          isNavLink: false,
          baseClass:
            'group flex items-center space-x-2 text-gray-700 hover:text-agri-700 px-3 py-1 rounded-md no-underline transition-colors',
        },
        {
          to: '/#features',
          label: t('nav.features', 'Features'),
          icon: Layers,
          isNavLink: false,
          baseClass:
            'group flex items-center space-x-2 text-gray-700 hover:text-agri-700 px-3 py-1 rounded-md no-underline transition-colors',
        },
      ]
    : authLinks.map((l) => ({ ...l, isNavLink: true }));

  // Helper to render either NavLink (for app pages that use activeClass) or Link (for plain links)
  const renderLink = (link, { isMobile = false } = {}) => {
    const Icon = link.icon;
    const sharedClass = isMobile
      ? `block text-gray-700 transition-colors font-medium ${link.hoverClass ?? ''} no-underline`
      : `${link.baseClass ?? 'text-gray-700 transition-colors font-medium'} ${link.hoverClass ?? ''} ${
          link.isNavLink && !isMobile ? 'font-heading' : ''
        }`;
    const iconStyleClass = `h-5 w-5 ${link.iconClass} transition-colors`;
    if (link.isNavLink) {
      // use NavLink to apply active classes for authenticated internal routes
        return (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className={({ isActive }) => `${sharedClass} ${isActive ? (link.activeClass ?? '') : ''}`}
          >
            <span className="flex items-center space-x-2">
              {Icon && <Icon className= {iconStyleClass} />}
              <span className={`${isMobile ? '' : 'font-medium'}`}>{link.label}</span>
            </span>
          </NavLink>
        );
    }

    // plain Link (home / anchor)
    return (
      <Link
        key={link.to}
        to={link.to}
        onClick={() => isMobile && setMobileMenuOpen(false)}
        className={sharedClass}
      >
        <span className="flex items-center space-x-2">
          {Icon && <Icon className="h-5 w-5 text-agri-500 group-hover:text-agri-700 transition-colors" />}
          <span className={`${isMobile ? '' : 'font-medium'}`}>{link.label}</span>
        </span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-agri-500" />
            <span className="text-2xl font-bold text-agri-700 font-heading">{t('brand')}</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {/* render first two static links (Home, Features) */}
            {links.slice(0, 2).map((l) => renderLink(l))}
            {/* render auth links (if any) */}
            {links.slice(2).map((l) => renderLink(l))}


            <div className="ml-4">
              <LanguageSwitcher className="" />
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 border-red-700 hover:text-red-600 transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-agri-700 hover:text-agri-900 transition-colors font-medium">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="btn-primary">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Render all links (Home, Features, auth links) */}
            {links.map((l) => renderLink(l, { isMobile: true }))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  // handleLogout already closes the menu, but keep safe
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-red-700 hover:text-red-600 transition-colors font-medium w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600 transition-colors font-medium">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-center">
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
