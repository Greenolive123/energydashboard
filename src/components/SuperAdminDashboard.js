import React, { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import {
  Bell,
  Filter,
  LogOut,
  ChevronDown,
  Map,
  Download,
  Eye,
  Menu,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Sliders,
  Search,
  TrendingUp,
  Home,
  AlertTriangle,
  BarChart3,
  FileText,
  Brain,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy-loaded components for code-splitting
const DeviceDashboard = React.lazy(() => import('./DeviceDashboard'));
const AlertsPage = React.lazy(() => import('./AlertsPage'));
const AnalysisPage = React.lazy(() => import('./AnalysisPage'));
const ReportsPage = React.lazy(() => import('./ReportsPage'));
const AIInsightsPage = React.lazy(() => import('./AIInsightsPage'));
const EnergyMonitorDashboard = React.lazy(() => import('./EnergyMonitorDashboard'));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-500"
    />
  </div>
);

// Navigation item component for reusability
const NavItem = ({ item, isOpen, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ backgroundColor: 'rgb(243, 244, 246)', scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
      isActive
        ? 'bg-teal-100 text-teal-700 border-l-4 border-teal-500 shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    title={!isOpen ? item.label : ''}
  >
    <item.icon size={20} className="flex-shrink-0" />
    {isOpen && <span className="font-medium text-sm truncate">{item.label}</span>}
  </motion.button>
);

// Notification item component
const NotificationItem = ({ notification, onRead }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2 }}
    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
      notification.read ? '' : 'bg-blue-50'
    }`}
    onClick={() => onRead(notification.id)}
  >
    <div className="flex justify-between items-start gap-2">
      <p className="text-sm text-gray-800 flex-1">{notification.message}</p>
      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
    </div>
    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
  </motion.div>
);

// Header component
const Header = ({
  unreadCount,
  showNotifications,
  onNotificationToggle,
  notifications,
  onNotificationRead,
  onMarkAllAsRead,
  onLogout,
  searchTerm,
  onSearchChange,
  onMenuToggle,
  screenWidth,
}) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        if (showNotifications) onNotificationToggle();
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications, onNotificationToggle]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex justify-between items-center px-2 sm:px-4 h-16 md:h-20 border-b border-gray-100"
    >
      {/* Left section: Menu + Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-gray-700" />
        </motion.button>

        {/* Logo and branding */}
        <div className="flex items-center gap-2 min-w-0">
          <motion.img
            src="/Assets/elogoo.png"
            alt="Olive IoT Logo"
            className="h-8 md:h-10 flex-shrink-0"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          />
          <div className="hidden sm:flex flex-col min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-900">Olive Power Monitor</p>
            <p className="text-xs text-gray-500 truncate">Power & Energy Analytics</p>
          </div>
        </div>
      </div>

      {/* Center: Search (desktop only) */}
      {screenWidth >= 768 && (
        <div className="hidden md:flex flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <motion.input
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-gray-50 hover:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search"
            />
          </div>
        </div>
      )}

      {/* Right section: Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onNotificationToggle();
            }}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={`${unreadCount} notifications`}
          >
            <Bell size={20} className="text-gray-700" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    onClick={onMarkAllAsRead}
                  >
                    Mark all read
                  </motion.button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={onNotificationRead}
                      />
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500 text-sm">No notifications</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User info - visible on desktop, minimal on mobile */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Super Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <motion.img
              whileHover={{ rotate: 5 }}
              src="/Assets/man-user.svg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-teal-500 cursor-pointer"
            />

            {/* User dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200 hidden group-hover:block">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </button>
              <motion.button
                whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 border-t border-gray-100"
              >
                <LogOut size={16} className="text-red-500" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Mobile user avatar only */}
        <motion.img
          whileHover={{ rotate: 5 }}
          src="/Assets/man-user.svg"
          alt="User Avatar"
          className="w-8 h-8 md:hidden rounded-full border-2 border-teal-500"
        />
      </div>
    </motion.header>
  );
};

// Sidebar component
const Sidebar = ({
  isOpen,
  activePage,
  navItems,
  onNavClick,
  screenWidth,
  onOverlayClick,
}) => {
  return (
    <>
      {/* Mobile/tablet overlay */}
      {isOpen && screenWidth < 1024 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? '280px' : '80px',
          x: screenWidth < 1024 ? (isOpen ? 0 : '-280px') : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white shadow-lg z-40 overflow-y-auto border-r border-gray-100 lg:translate-x-0"
      >
        <nav className="p-3 md:p-4 space-y-2 flex flex-col h-full">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavItem
                item={item}
                isOpen={isOpen}
                isActive={activePage === item.page}
                onClick={() => onNavClick(item.page)}
              />
            </motion.div>
          ))}

          {/* Spacer to push logout to bottom */}
          <div className="flex-1" />

          {/* Mobile logout button */}
          <motion.button
            whileHover={{ backgroundColor: 'rgb(243, 244, 246)', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 md:hidden lg:hidden"
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0 text-red-500" />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </motion.button>
        </nav>
      </motion.aside>
    </>
  );
};

// Main component
const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'High Voltage Detected', time: '10 minutes ago', read: false },
    { id: 2, message: 'R Phase Leakage', time: '1 hour ago', read: false },
    { id: 3, message: 'High Active Power', time: '2 hours ago', read: false },
    { id: 4, message: 'Low Voltage', time: '3 hours ago', read: true },
  ]);

  // Memoized unread count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Navigation items
  const navItems = useMemo(
    () => [
      { id: 'home', label: 'Home', icon: Home, page: 'home' },
      { id: 'device-dashboard', label: 'Device Dashboard', icon: TrendingUp, page: 'device-dashboard' },
      { id: 'alerts', label: 'Alerts', icon: AlertTriangle, page: 'alerts' },
      { id: 'analysis', label: 'Analysis', icon: BarChart3, page: 'analysis' },
      { id: 'reports', label: 'Reports', icon: FileText, page: 'reports' },
      { id: 'ai-insights', label: 'AI Insights', icon: Brain, page: 'ai-insights' },
    ],
    []
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Notification handlers with useCallback
  const handleNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  }, []);

  // Navigation handler
  const handleNavClick = useCallback(
    (page) => {
      setActivePage(page);
      setShowNotifications(false);
      if (screenWidth < 1024) {
        setIsSidebarOpen(false);
      }
    },
    [screenWidth]
  );

  // Calculate dynamic margins
  const sidebarWidth = isSidebarOpen ? 280 : 80;
  const marginLeft = screenWidth >= 1024 ? sidebarWidth : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
        notifications={notifications}
        onNotificationRead={handleNotificationRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        screenWidth={screenWidth}
      />

      {/* Layout container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          activePage={activePage}
          navItems={navItems}
          onNavClick={handleNavClick}
          screenWidth={screenWidth}
          onOverlayClick={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          className="flex-1 pt-16 md:pt-20 overflow-auto"
          style={{
            marginLeft: marginLeft,
            transition: 'margin-left 0.3s ease-in-out',
          }}
        >
       <div className="w-full p-4 sm:p-6 md:p-8">

            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                {activePage === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EnergyMonitorDashboard />
                  </motion.div>
                )}
                {activePage === 'device-dashboard' && (
                  <motion.div
                    key="device-dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DeviceDashboard />
                  </motion.div>
                )}
                {activePage === 'alerts' && (
                  <motion.div
                    key="alerts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertsPage />
                  </motion.div>
                )}
                {activePage === 'analysis' && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnalysisPage />
                  </motion.div>
                )}
                {activePage === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReportsPage />
                  </motion.div>
                )}
                {activePage === 'ai-insights' && (
                  <motion.div
                    key="ai-insights"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AIInsightsPage />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 text-center text-sm text-gray-500">
          <p>© 2025 Olive IoT. All rights reserved. | Intelligent Power and Energy Analytics</p>
        </div>
      </footer>
    </div>
  );
};

export default SuperAdminDashboard;
