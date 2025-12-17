import React, { useState, useEffect, useRef } from 'react';
import { Bell, Filter, LogOut, ChevronDown, Map, Download, Eye, Menu, Trash2, 
  MoreVertical, CheckCircle, XCircle, Sliders, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import EnergyMonitorDashboard from './EnergyMonitorDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdminDashboard = () => {
  // State management
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "High Voltage Detected", time: "10 minutes ago", read: false, severity: "high" },
    { id: 2, message: "R Phase Leakage", time: "1 hour ago", read: false, severity: "medium" },
    { id: 3, message: "High Active Power", time: "2 hours ago", read: false, severity: "medium" },
    { id: 4, message: "Low Voltage", time: "3 hours ago", read: true, severity: "low" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mapView, setMapView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bioReactorModel, setBioReactorModel] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceInfoModal, setDeviceInfoModal] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(null);
  const [themeColor, setThemeColor] = useState('teal');
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Notification ref for click outside
  const notificationRef = useRef(null);

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Add animated logout
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  // Theme variants
  const themeVariants = {
    teal: {
      primary: 'bg-teal-500',
      hover: 'hover:bg-teal-600',
      text: 'text-teal-500',
      border: 'border-teal-500',
      light: 'bg-teal-50',
      lightText: 'text-teal-600',
    },
  };

  const theme = themeVariants[themeColor];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  // Weather effect at top of dashboard (simulated)
  const WeatherEffect = () => (
    <div className="absolute top-0 right-0 left-0 h-32 overflow-hidden -z-10 opacity-10">
      <div className="clouds">
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{ 
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 60 + 30}px`,
              top: `${Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 + 100],
              opacity: [0.7, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 40,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div 
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="/Assets/olivee.png"
          alt="EcoInfinity Logo"
          className="h-16 mb-4"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="w-12 h-1 bg-teal-500 rounded-full"
          animate={{
            width: ["30%", "80%", "30%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <p className="text-sm text-gray-500 mt-4">Intelligent Energy Analytics</p>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>
      
      <WeatherEffect />
      
      {/* Header with enhanced animation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-white shadow-md flex justify-between items-center p-2 md:p-4 sticky top-0 z-10 backdrop-blur-sm bg-white/90"
      >
        {/* Mobile menu button - only visible on small screens */}
        <div className="md:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md focus:outline-none"
          >
            <Menu size={24} />
          </motion.button>
        </div>

        {/* Logo and company description - centered on mobile */}
        <div className="flex items-center space-x-2 mx-auto md:mx-0">
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <motion.img
                src="/Assets/olivee.png"
                alt="EcoInfinity Logo"
                className="h-8 md:h-10"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1.5 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs text-gray-500 text-center md:text-left hidden md:block font-medium"
            >
              Intelligent Power and Energy Analytics
            </motion.div>
          </div>
        </div>

        {/* Right side elements - hidden on mobile, shown in desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.03 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <motion.input
              initial={{ width: "48px", opacity: 0.5 }}
              animate={{ width: "16rem", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              title="Search across sections"
            />
          </motion.div>
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border border-gray-200 overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold">Notifications</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </motion.button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            notification.read ? '' : 
                            notification.severity === 'high' ? 'bg-red-50' : 
                            notification.severity === 'medium' ? 'bg-orange-50' : 'bg-blue-50'
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-2">
                              <div className={`mt-1 w-2 h-2 rounded-full ${
                                notification.severity === 'high' ? 'bg-red-500' :
                                notification.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                              }`}></div>
                              <p className="text-sm">{notification.message}</p>
                            </div>
                            {!notification.read && 
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-teal-500 mt-1"
                              />
                            }
                          </div>
                          <p className="text-xs text-gray-500 mt-1 ml-4">{notification.time}</p>
                        </motion.div>
                      ))
                    ) : (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 text-center text-gray-500 text-sm"
                      >
                        No notifications
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div 
              className="font-medium text-sm text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div>Super Admin</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </motion.div>
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="cursor-pointer overflow-hidden rounded-full border-2 border-teal-500"
              >
                <motion.img
                  src="/Assets/man-user.svg"
                  alt="User Avatar"
                  className="w-10 h-10"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 hidden group-hover:block overflow-hidden"
              >
                <div className="py-1">
                  <a 
                    href="#profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Super Admin
                  </a>
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors flex items-center cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2 text-red-500" /> Logout
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile buttons for notifications and profile - visible only on small screens */}
        <div className="flex md:hidden items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Mobile menu - enhanced with animations */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-white z-50 flex flex-col p-4 md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <motion.img
                    src="/Assets/olivee.png"
                    alt="EcoInfinity Logo"
                    className="h-10"
                    animate={{ scale: 1.5, rotateZ: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500"
                  >
                    Intelligent Power and Energy Analytics
                  </motion.div>
                </div>
                <motion.button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">&times;</span>
                </motion.button>
              </div>
              
              <motion.div 
                className="relative mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3 p-4 border-t border-b border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.img
                  src="/Assets/man-user.svg"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-teal-500"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <div>
                  <div className="font-medium">Super Admin</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </motion.div>
              
              <motion.nav 
                className="flex-1 mt-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.a 
                  variants={itemVariants}
                  href="#profile" 
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Profile
                </motion.a>
                <motion.a 
                  variants={itemVariants}
                  href="#logout" 
                  onClick={handleLogout} 
                  className="block py-3 px-4 text-gray-700 hover:bg-red-50 rounded-md transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-2 text-red-500" /> Logout
                </motion.a>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main content area with animated entry */}
      <motion.div 
        className="flex-1 p-3 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Floating action button for quick access */}
        <motion.div
          className="fixed bottom-6 right-6 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <motion.button
            className="bg-teal-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp size={24} />
          </motion.button>
        </motion.div>

        {/* Status cards - animated entry */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: "Active Devices", value: "247", change: "+12", color: "bg-gradient-to-br from-teal-400 to-teal-600" },
            { title: "Energy Consumption", value: "1,423 kWh", change: "-5%", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
            { title: "Active Alerts", value: unreadCount.toString(), change: "", color: "bg-gradient-to-br from-amber-400 to-amber-600" },
            { title: "Efficiency Rate", value: "94%", change: "+2%", color: "bg-gradient-to-br from-emerald-400 to-emerald-600" }
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className={`rounded-xl shadow-md overflow-hidden ${card.color} text-white`}
            >
              <div className="px-6 py-5">
                <div className="font-medium text-sm opacity-80">{card.title}</div>
                <div className="flex items-end justify-between mt-2">
                  <div className="text-3xl font-bold">{card.value}</div>
                  {card.change && (
                    <div className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-white' : 'text-white'}`}>
                      {card.change} {card.change.includes('%') && <span>this week</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main dashboard content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <EnergyMonitorDashboard />
        </motion.div>
      </motion.div>

      {/* Enhanced footer */}
      <motion.footer 
        className="bg-white border-t border-gray-200 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <motion.div 
              className="flex items-center mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/Assets/olivee.png" alt="Olive IOT Logo" className="h-8 mr-3" />
              <span className="text-lg font-semibold text-gray-700">Olive IOT</span>
            </motion.div>
            <div className="flex space-x-6">
              {['Dashboard', 'Reports', 'Analytics', 'Support'].map((item, i) => (
                <motion.a 
                  key={i}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-500 hover:text-teal-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
          <motion.div 
            className="text-center text-sm text-gray-500 pt-6 border-t border-gray-100"
            whileHover={{ color: '#0d9488' }}
          >
            © 2025 Olive IOT. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default SuperAdminDashboard;