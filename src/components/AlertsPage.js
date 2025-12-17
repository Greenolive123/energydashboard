// AlertsPage.js - Full Super Admin Alerts Management Component
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Download, Filter, Search, ChevronDown, Clock, Zap, Battery, TrendingUp, TrendingDown } from 'lucide-react';

const AlertsPage = () => {
  // Mock aggregated alerts from all hardware devices (super admin view)
  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [sortBy, setSortBy] = useState('timestamp'); // timestamp, severity, device
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [isLoading, setIsLoading] = useState(true);

  // Mock devices data aggregated into alerts (in real app, fetch from API)
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const devices = [
        {
          id: 1,
          name: 'Solar Panel Array 1',
          alerts: [
            { id: 's1-1', type: 'Maintenance Reminder', message: 'Cleaning recommended for optimal performance', severity: 'info', timestamp: '2025-12-17 10:30', resolved: false, device: 'Solar Panel Array 1' }
          ]
        },
        {
          id: 2,
          name: 'Wind Turbine A',
          alerts: [
            { id: 'w2-1', type: 'Vibration Alert', message: 'Vibration levels slightly elevated', severity: 'warning', timestamp: '2025-12-17 09:15', resolved: true, device: 'Wind Turbine A' }
          ]
        },
        {
          id: 3,
          name: 'Battery Bank B',
          alerts: [
            { id: 'b3-1', type: 'Charge Cycle', message: 'Routine charge cycle initiated', severity: 'info', timestamp: '2025-12-17 08:45', resolved: false, device: 'Battery Bank B' }
          ]
        },
        {
          id: 4,
          name: 'Grid Inverter C',
          alerts: [
            { id: 'i4-1', type: 'Offline Alert', message: 'Device offline - immediate attention required', severity: 'critical', timestamp: '2025-12-17 14:15', resolved: false, device: 'Grid Inverter C' },
            { id: 'i4-2', type: 'Overheat Alert', message: 'Overheating detected', severity: 'critical', timestamp: '2025-12-17 14:10', resolved: false, device: 'Grid Inverter C' },
            { id: 'i4-3', type: 'Maintenance Overdue', message: 'Maintenance overdue', severity: 'warning', timestamp: '2025-12-01 09:00', resolved: true, device: 'Grid Inverter C' }
          ]
        },
        {
          id: 5,
          name: 'Solar Panel Array 2',
          alerts: [
            { id: 's5-1', type: 'Efficiency Warning', message: 'Efficiency below optimal range', severity: 'warning', timestamp: '2025-12-17 13:00', resolved: false, device: 'Solar Panel Array 2' },
            { id: 's5-2', type: 'Temperature Alert', message: 'Temperature elevated', severity: 'info', timestamp: '2025-12-17 12:45', resolved: false, device: 'Solar Panel Array 2' }
          ]
        },
        {
          id: 6,
          name: 'Wind Turbine B',
          alerts: []
        }
      ];

      // Aggregate all alerts
      const aggregatedAlerts = devices
        .flatMap(device => 
          device.alerts.map(alert => ({
            ...alert,
            severity: severityMap[alert.severity] || alert.severity // Map to High/Medium/Low
          }))
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Initial sort by timestamp desc

      setAllAlerts(aggregatedAlerts);
      setFilteredAlerts(aggregatedAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Severity mapping
  const severityMap = {
    critical: 'High',
    warning: 'Medium',
    info: 'Low'
  };

  // Filter and search alerts
  useEffect(() => {
    let filtered = [...allAlerts];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.device.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by severity
    if (filterSeverity !== 'All') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'timestamp':
          aVal = new Date(a.timestamp);
          bVal = new Date(b.timestamp);
          break;
        case 'severity':
          const severityOrder = { High: 3, Medium: 2, Low: 1 };
          aVal = severityOrder[a.severity] || 0;
          bVal = severityOrder[b.severity] || 0;
          break;
        case 'device':
          aVal = a.device;
          bVal = b.device;
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredAlerts(filtered);
  }, [searchTerm, filterSeverity, sortBy, sortOrder, allAlerts]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High': return <XCircle size={20} className="text-red-600" />;
      case 'Medium': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'Low': return <CheckCircle size={20} className="text-green-600" />;
      default: return <AlertTriangle size={20} className="text-gray-600" />;
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleResolveAlert = (id) => {
    setAllAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    doc.text(`Alerts Report - ${date}`, 10, 10);
    doc.text(`Total Alerts: ${filteredAlerts.length} | Unresolved: ${filteredAlerts.filter(a => !a.resolved).length}`, 10, 20);
    let y = 30;
    filteredAlerts.forEach((alert, index) => {
      const status = alert.resolved ? 'Resolved' : 'Active';
      doc.text(`${index + 1}. ${alert.type} (${alert.severity} - ${status}) - ${alert.device}`, 10, y);
      doc.text(`   ${alert.message}`, 10, y + 5);
      doc.text(`   Time: ${alert.timestamp}`, 10, y + 10);
      y += 15;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`super_admin_alerts_report_${date}.pdf`);
  };

  // Analytics
  const unresolvedCount = filteredAlerts.filter(a => !a.resolved).length;
  const highCount = filteredAlerts.filter(a => a.severity === 'High').length;
  const mediumCount = filteredAlerts.filter(a => a.severity === 'Medium').length;
  const lowCount = filteredAlerts.filter(a => a.severity === 'Low').length;
  const resolvedCount = filteredAlerts.filter(a => a.resolved).length;

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-3xl font-bold mb-8 text-gray-900"
      >
         Alerts & Notifications
      </motion.h1>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <p className="text-xs text-gray-500">High Priority</p>
          <p className="text-2xl font-bold text-red-600">{highCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} className="text-yellow-600" />
          </div>
          <p className="text-xs text-gray-500">Medium Priority</p>
          <p className="text-2xl font-bold text-yellow-600">{mediumCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <p className="text-xs text-gray-500">Low Priority</p>
          <p className="text-2xl font-bold text-green-600">{lowCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-blue-600" />
          </div>
          <p className="text-xs text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-blue-600">{resolvedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-gray-600" />
          </div>
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-2xl font-bold text-gray-900">{unresolvedCount}</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['timestamp', 'severity', 'device'].map(field => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-3 py-1 text-xs rounded-full border font-medium flex items-center gap-1 ${
                sortBy === field
                  ? sortOrder === 'desc'
                    ? 'bg-gray-200 text-gray-700 border-gray-400'
                    : 'bg-gray-200 text-gray-700 border-gray-400 rotate-180'
                  : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortBy === field && <ChevronDown size={12} className={sortOrder === 'asc' ? 'rotate-180' : ''} />}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <AnimatePresence>
            {filteredAlerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  alert.resolved ? 'bg-gray-50 opacity-70' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 mt-0.5 ${alert.resolved ? 'text-green-500' : 'text-red-500'}`}>
                    {alert.resolved ? <CheckCircle size={20} /> : getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{alert.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)} ml-2 flex-shrink-0`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Zap size={12} />
                        {alert.device}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm ml-2 flex-shrink-0"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow border border-gray-200"
        >
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">Try adjusting your search, filters, or sorting options.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AlertsPage;