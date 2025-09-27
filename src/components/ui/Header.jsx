import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { anonymousId, role, logout } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard' },
    { label: 'Support', path: '/ai-assistant-chat', icon: 'MessageCircle' },
    { label: 'Appointments', path: '/appointment-booking', icon: 'Calendar' },
    { label: 'Resources', path: '/resource-library', icon: 'BookOpen' },
    { label: 'Assessment', path: '/assessment-center', icon: 'ClipboardList' }
  ];

  const secondaryItems = [
    { label: 'Account', path: '/multi-tier-authentication', icon: 'User' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Crisis Alert Banner */}
      <div className="crisis-alert fixed top-0 left-0 right-0 z-crisis px-4 py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Icon name="AlertTriangle" size={16} />
          <span>Crisis Support Available 24/7</span>
          <Button 
            variant="ghost" 
            size="xs" 
            className="text-destructive-foreground hover:bg-white/20 ml-2"
            iconName="Phone"
            iconSize={14}
          >
            Emergency
          </Button>
        </div>
      </div>
      {/* Main Header */}
      <header className="sticky top-8 z-navigation bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={20} color="white" />
                </div>
                <div className="font-heading font-semibold text-xl text-foreground">
                  MindBridge
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-ring ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              {/* More Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreHorizontal"
                  iconSize={16}
                  className="text-text-secondary hover:text-text-primary"
                >
                  More
                </Button>
              </div>
            </nav>

            {/* Anonymous Identity Indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>{anonymousId ? `Anonymous ID: ${anonymousId}` : 'Not verified'}</span>
                <Icon name="Shield" size={12} />
              </div>
              {role && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>{role}</span>
                </div>
              )}
              {role && (
                <Button variant="ghost" size="xs" onClick={logout}>
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                iconName={isMobileMenuOpen ? "X" : "Menu"}
                iconSize={20}
                className="text-text-secondary"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-border pt-2 mt-2">
                {secondaryItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Anonymous Identity */}
              <div className="flex items-center justify-center space-x-2 px-3 py-2 mt-3 bg-muted rounded-md text-xs font-medium text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>{anonymousId ? `Anonymous ID: ${anonymousId}` : 'Not verified'}</span>
                <Icon name="Shield" size={12} />
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Quick Action Toolbar - Mobile Floating */}
      <div className="fixed bottom-6 right-6 z-dropdown md:hidden">
        <div className="flex flex-col space-y-3">
          <Button
            variant="default"
            size="icon"
            className="w-12 h-12 rounded-full shadow-gentle-hover breathing-animation"
            iconName="MessageCircle"
            iconSize={20}
          />
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-gentle"
            iconName="Heart"
            iconSize={16}
          />
          <Button
            variant="accent"
            size="icon"
            className="w-10 h-10 rounded-full shadow-gentle"
            iconName="Calendar"
            iconSize={16}
          />
        </div>
      </div>
      
    </>
  );
};

export default Header;