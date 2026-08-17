/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { KapadaDB, AppNotification } from '../db';
import { Profile, Role } from '../types';
import { Bell, Globe, RefreshCw, UserCheck, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: Profile | null;
  onUserChanged: (user: Profile | null) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onUserChanged,
}: NavbarProps) {
  const { language, setLanguage, t } = useI18n();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winscl = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (winscl / docHeight) * 100 : 0;
      setScrollPercent(pct);
      setIsScrolled(winscl > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const profiles = KapadaDB.getProfiles();

  // Load and subscribe to notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const loadNotifs = () => {
      setNotifications(KapadaDB.getNotifications(currentUser.id));
    };

    loadNotifs();

    // Listen to custom notification events
    const handleNotifEvent = () => loadNotifs();
    window.addEventListener('kapada_notification', handleNotifEvent);
    
    return () => {
      window.removeEventListener('kapada_notification', handleNotifEvent);
    };
  }, [currentUser]);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const selectPersona = (p: Profile) => {
    KapadaDB.setCurrentUser(p);
    onUserChanged(p);
    setShowUserDropdown(false);
    // Auto-redirect to appropriate dashboard
    if (p.role === Role.ADMIN) {
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkNotifRead = (id: string) => {
    KapadaDB.markNotificationRead(id);
    if (currentUser) {
      setNotifications(KapadaDB.getNotifications(currentUser.id));
    }
  };

  const handleMarkAllRead = () => {
    if (currentUser) {
      KapadaDB.markAllNotificationsRead(currentUser.id);
      setNotifications(KapadaDB.getNotifications(currentUser.id));
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/70 backdrop-blur-xl border-b border-stone-200/60 shadow-lg shadow-stone-900/[0.03] py-0.5'
        : 'bg-white border-b border-stone-100 py-1.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2 text-left"
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-sm"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                SETU
              </motion.div>
              <div>
                <span className="font-sans font-extrabold text-xl tracking-tight text-stone-900 block leading-tight">
                  {t('brand')}
                </span>
                <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block">
                  {language === 'en' ? 'Cloth Waste Marketplace' : 'कपड़ा रीसाइक्लिंग बाजार'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'active bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              {t('home')}
            </button>

            {currentUser && currentUser.role !== Role.ADMIN && (
              <>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'dashboard'
                      ? 'active bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {t('dashboard')}
                </button>

                <button
                  onClick={() => setCurrentTab('listings')}
                  className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'listings'
                      ? 'active bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {t('listings')}
                </button>
              </>
            )}

            {currentUser && currentUser.role === Role.ADMIN && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`nav-link-animated px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'admin'
                    ? 'active bg-orange-50 text-orange-700 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {t('admin')}
                </span>
              </button>
            )}
          </div>

          {/* Utilities & Persona Panel */}
          <div className="flex items-center gap-3">
            {/* Bilingual Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('toggleLang')}</span>
            </button>

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    setShowUserDropdown(false);
                  }}
                  className="p-2 rounded-lg text-stone-600 hover:bg-stone-50 relative border border-transparent hover:border-stone-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="badge-pulse absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -5, scale: 0.97, filter: 'blur(2px)' }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-stone-100 rounded-2xl shadow-xl z-50 py-2"
                    >
                      <div className="flex justify-between items-center px-4 py-1.5 border-b border-stone-100 mb-1">
                        <span className="text-xs font-bold text-stone-800">
                          Notifications ({unreadCount})
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-emerald-600 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-stone-400 text-xs">
                            No alerts right now.
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                handleMarkNotifRead(n.id);
                                setShowNotifDropdown(false);
                              }}
                              className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                                n.is_read ? 'hover:bg-stone-50 text-stone-600' : 'bg-emerald-50/50 hover:bg-emerald-50 text-stone-950 font-medium'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-xs font-bold leading-snug">{n.title}</span>
                                {!n.is_read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-[10px] mt-0.5 line-clamp-2 leading-relaxed text-stone-500">
                                {n.message}
                              </p>
                              <span className="text-[8px] text-stone-400 block mt-1">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tester Switcher Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {currentUser ? currentUser.full_name : 'No User'}
                </span>
                <span className="text-[9px] bg-emerald-600 text-white px-1 py-0.5 rounded leading-none shrink-0 font-bold uppercase">
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -5, scale: 0.97, filter: 'blur(2px)' }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 text-stone-800"
                  >
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                        Demo Persona Switcher
                      </span>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Change account instantly to test dual-sided trade flows and reviews.
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      {profiles.map(p => (
                        <button
                          key={p.id}
                          onClick={() => selectPersona(p)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                            currentUser?.id === p.id
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{p.full_name}</p>
                            <p className="text-[9px] text-stone-400">{p.business_name}</p>
                          </div>
                          <span className="text-[8px] border border-stone-200 text-stone-500 bg-stone-50 px-1 py-0.5 rounded uppercase font-mono font-bold">
                            {p.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-stone-600 hover:bg-stone-50 border border-transparent hover:border-stone-100 shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-stone-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner overflow-hidden"
          >
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05, duration: 0.25 }}
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold block ${
                currentTab === 'home' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
              }`}
            >
              {t('home')}
            </motion.button>
            {currentUser && currentUser.role !== Role.ADMIN && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                  onClick={() => {
                    setCurrentTab('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold block ${
                    currentTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
                  }`}
                >
                  {t('dashboard')}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  onClick={() => {
                    setCurrentTab('listings');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold block ${
                    currentTab === 'listings' ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'
                  }`}
                >
                  {t('listings')}
                </motion.button>
              </>
            )}
            {currentUser && currentUser.role === Role.ADMIN && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.25 }}
                onClick={() => {
                  setCurrentTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold block ${
                  currentTab === 'admin' ? 'bg-orange-50 text-orange-700' : 'text-stone-700'
                }`}
              >
                {t('admin')}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-progress-glow absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-500 transition-all duration-100 ease-out z-50 rounded-r-full" 
        style={{ width: `${scrollPercent}%` }} 
      />
    </nav>
  );
}
