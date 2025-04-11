import React, { useState, useEffect, useRef } from 'react';
import { Bell, Filter, LogOut, ChevronDown, Map, Download, Eye,Menu , Trash2, MoreVertical, CheckCircle, XCircle, Sliders, Search, TrendingUp
  
 } from 'lucide-react';
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
    { id: 1, message: "High Volatage Detected", time: "10 minutes ago", read: false },
    { id: 2, message: "R Phase Leakage", time: "1 hour ago", read: false },
    { id: 3, message: "High Active Power", time: "2 hours ago", read: false },
    { id: 4, message: "Low Voltage", time: "3 hours ago", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mapView, setMapView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bioReactorModel, setBioReactorModel] = useState(null);
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard', 'reports'

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceInfoModal, setDeviceInfoModal] = useState(false);


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
    window.location.href = "/"; // Redirect to login page
  };





  return (
    <div className="  min-h-screen bg-gray-50 flex flex-col">
      {/* Header with animation */}
      <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm flex justify-between items-center p-2 md:p-4 sticky top-0 z-10"
    >
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Logo and company description - centered on mobile */}
      <div className="flex items-center space-x-2 mx-auto md:mx-0">
        <div className="flex flex-col items-center md:items-start">
          <motion.img
            src="/Assets/olivee.png"
            alt="EcoInfinity Logo"
            className="h-8 md:h-10"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1.5 }}
            transition={{ duration: 0.8, type: "spring" }}
          />
          <div className="text-xs text-gray-500 text-center md:text-left hidden md:block">
            Intelligent Power and energy analytics
          </div>
        </div>
      </div>

      {/* Right side elements - hidden on mobile, shown in desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <motion.input
            initial={{ width: "48px", opacity: 0.5 }}
            animate={{ width: "16rem", opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            title="based on sections"
          />
        </div>
        <div className="relative">
          <motion.button
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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    className="text-xs text-teal-600 hover:text-teal-800"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.read ? '' : 'bg-blue-50'}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{notification.message}</p>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500 text-sm">No notifications</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center space-x-3">
          <div className="font-medium text-sm text-right">
            <div>Super Admin</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
          <div className="relative group">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              src="/Assets/man-user.svg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-teal-500 cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 hidden group-hover:block">
              <div className="py-1">
                <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Super Admin</a>
                <a
                  href="#logout"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                >
                  <LogOut size={16} className="mr-2 text-red-500" /> Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile buttons for notifications and profile - visible only on small screens */}
      <div className="flex md:hidden items-center">
        <motion.button
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

      {/* Mobile menu - slides in from left when menu button is clicked */}
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
                  animate={{ scale: 1.5 }}
                />
                <div className="text-xs text-gray-500">
                  Intelligent Power and energy analytics
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-t border-b border-gray-100">
              <motion.img
                src="/Assets/man-user.svg"
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-2 border-teal-500"
              />
              <div>
                <div className="font-medium">Super Admin</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
            
            <nav className="flex-1 mt-4">
              <a href="#profile" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md">
                Profile
              </a>
              <a href="#logout" onClick={handleLogout} className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                <LogOut size={16} className="mr-2 text-red-500" /> Logout
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    <div className="min-h-screen p-3 md:p-6">
        <EnergyMonitorDashboard />
    </div>
      <footer className="bg-white border-t border-gray-200 mt-8 py-8">
        <div className="container mx-auto px-6">
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2025 Olive IOT. All rights reserved.
          </div>
        </div>
      </footer>
    </div >
  );
};

export default SuperAdminDashboard;