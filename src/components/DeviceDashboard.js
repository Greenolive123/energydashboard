import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Thermometer, Zap, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, RefreshCw, Settings, Download, Filter, Search, ChevronRight, Wifi, WifiOff, Battery, HardDrive, MemoryStick, Fan, Power, Shield } from 'lucide-react';

const DeviceDashboard = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentAlerts, setCurrentAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const devices = [
    {
      id: 1,
      name: 'Solar Panel Array 1',
      type: 'Solar',
      location: 'Rooftop Section A',
      status: 'Healthy',
      uptime: 99.8,
      lastMaintenance: '2025-11-15',
      nextMaintenance: '2026-02-15',
      power: 45.2,
      efficiency: 92,
      temperature: 42,
      voltage: 380,
      current: 118.9,
      health: {
        overall: 95,
        connectivity: 100,
        performance: 92,
        temperature: 88,
        vibration: 98,
        hardware: 96
      },
      alerts: [
        { severity: 'info', message: 'Cleaning recommended for optimal performance', time: '2025-12-17 10:30', resolved: false }
      ],
      metrics: {
        cpu: 45,
        memory: 62,
        storage: 38,
        network: 95
      },
      historicalData: [
        { time: '00:00', health: 94, temp: 38, power: 0 },
        { time: '04:00', health: 95, temp: 36, power: 0 },
        { time: '08:00', health: 96, temp: 40, power: 35 },
        { time: '12:00', health: 92, temp: 45, power: 48 },
        { time: '16:00', health: 93, temp: 42, power: 38 },
        { time: '20:00', health: 95, temp: 39, power: 12 },
        { time: '24:00', health: 95, temp: 37, power: 0 }
      ]
    },
    {
      id: 2,
      name: 'Wind Turbine A',
      type: 'Wind',
      location: 'North Field',
      status: 'Healthy',
      uptime: 97.5,
      lastMaintenance: '2025-10-20',
      nextMaintenance: '2026-01-20',
      power: 28.7,
      efficiency: 85,
      temperature: 38,
      voltage: 400,
      current: 71.75,
      health: {
        overall: 88,
        connectivity: 98,
        performance: 85,
        temperature: 92,
        vibration: 78,
        hardware: 90
      },
      alerts: [
        { severity: 'warning', message: 'Vibration levels slightly elevated', time: '2025-12-17 09:15', resolved: true }
      ],
      metrics: {
        cpu: 52,
        memory: 58,
        storage: 45,
        network: 88
      },
      historicalData: [
        { time: '00:00', health: 87, temp: 35, power: 25 },
        { time: '04:00', health: 88, temp: 34, power: 22 },
        { time: '08:00', health: 89, temp: 36, power: 28 },
        { time: '12:00', health: 86, temp: 40, power: 32 },
        { time: '16:00', health: 87, temp: 39, power: 30 },
        { time: '20:00', health: 88, temp: 37, power: 26 },
        { time: '24:00', health: 88, temp: 36, power: 24 }
      ]
    },
    {
      id: 3,
      name: 'Battery Bank B',
      type: 'Battery',
      location: 'Storage Room 2',
      status: 'Charging',
      uptime: 99.2,
      lastMaintenance: '2025-12-01',
      nextMaintenance: '2026-03-01',
      power: 60.1,
      efficiency: 95,
      temperature: 28,
      voltage: 600,
      current: 100.17,
      health: {
        overall: 97,
        connectivity: 100,
        performance: 95,
        temperature: 98,
        vibration: 100,
        hardware: 94
      },
      alerts: [
        { severity: 'info', message: 'Routine charge cycle initiated', time: '2025-12-17 08:45', resolved: false }
      ],
      metrics: {
        cpu: 38,
        memory: 42,
        storage: 78,
        network: 100
      },
      historicalData: [
        { time: '00:00', health: 96, temp: 26, power: 55 },
        { time: '04:00', health: 97, temp: 25, power: 58 },
        { time: '08:00', health: 98, temp: 27, power: 62 },
        { time: '12:00', health: 97, temp: 29, power: 65 },
        { time: '16:00', health: 96, temp: 28, power: 60 },
        { time: '20:00', health: 97, temp: 27, power: 58 },
        { time: '24:00', health: 97, temp: 26, power: 56 }
      ]
    },
    {
      id: 4,
      name: 'Grid Inverter C',
      type: 'Inverter',
      location: 'Control Room',
      status: 'Critical',
      uptime: 45.2,
      lastMaintenance: '2025-08-10',
      nextMaintenance: '2025-11-10',
      power: 0,
      efficiency: 0,
      temperature: 85,
      voltage: 220,
      current: 0,
      health: {
        overall: 32,
        connectivity: 0,
        performance: 0,
        temperature: 45,
        vibration: 88,
        hardware: 35
      },
      alerts: [
        { severity: 'critical', message: 'Device offline - immediate attention required', time: '2025-12-17 14:15', resolved: false },
        { severity: 'critical', message: 'Overheating detected', time: '2025-12-17 14:10', resolved: false },
        { severity: 'warning', message: 'Maintenance overdue', time: '2025-12-01 09:00', resolved: true }
      ],
      metrics: {
        cpu: 0,
        memory: 0,
        storage: 92,
        network: 0
      },
      historicalData: [
        { time: '00:00', health: 65, temp: 55, power: 42 },
        { time: '04:00', health: 58, temp: 58, power: 38 },
        { time: '08:00', health: 48, temp: 65, power: 25 },
        { time: '12:00', health: 35, temp: 78, power: 10 },
        { time: '16:00', health: 32, temp: 85, power: 0 },
        { time: '20:00', health: 32, temp: 82, power: 0 },
        { time: '24:00', health: 32, temp: 85, power: 0 }
      ]
    },
    {
      id: 5,
      name: 'Solar Panel Array 2',
      type: 'Solar',
      location: 'Rooftop Section B',
      status: 'Warning',
      uptime: 94.3,
      lastMaintenance: '2025-09-05',
      nextMaintenance: '2025-12-05',
      power: 38.5,
      efficiency: 78,
      temperature: 48,
      voltage: 375,
      current: 102.67,
      health: {
        overall: 76,
        connectivity: 95,
        performance: 78,
        temperature: 65,
        vibration: 92,
        hardware: 82
      },
      alerts: [
        { severity: 'warning', message: 'Efficiency below optimal range', time: '2025-12-17 13:00', resolved: false },
        { severity: 'info', message: 'Temperature elevated', time: '2025-12-17 12:45', resolved: false }
      ],
      metrics: {
        cpu: 58,
        memory: 71,
        storage: 52,
        network: 82
      },
      historicalData: [
        { time: '00:00', health: 78, temp: 40, power: 0 },
        { time: '04:00', health: 79, temp: 38, power: 0 },
        { time: '08:00', health: 75, temp: 44, power: 32 },
        { time: '12:00', health: 72, temp: 52, power: 42 },
        { time: '16:00', health: 74, temp: 48, power: 36 },
        { time: '20:00', health: 77, temp: 42, power: 15 },
        { time: '24:00', health: 76, temp: 41, power: 0 }
      ]
    },
    {
      id: 6,
      name: 'Wind Turbine B',
      type: 'Wind',
      location: 'South Field',
      status: 'Healthy',
      uptime: 98.9,
      lastMaintenance: '2025-11-30',
      nextMaintenance: '2026-02-28',
      power: 31.2,
      efficiency: 88,
      temperature: 35,
      voltage: 405,
      current: 76.96,
      health: {
        overall: 91,
        connectivity: 100,
        performance: 88,
        temperature: 95,
        vibration: 85,
        hardware: 92
      },
      alerts: [],
      metrics: {
        cpu: 48,
        memory: 55,
        storage: 41,
        network: 95
      },
      historicalData: [
        { time: '00:00', health: 90, temp: 33, power: 28 },
        { time: '04:00', health: 91, temp: 32, power: 26 },
        { time: '08:00', health: 92, temp: 34, power: 30 },
        { time: '12:00', health: 90, temp: 37, power: 34 },
        { time: '16:00', health: 91, temp: 36, power: 32 },
        { time: '20:00', health: 91, temp: 35, power: 29 },
        { time: '24:00', health: 91, temp: 34, power: 27 }
      ]
    }
  ];

  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || device.status === filterStatus;
    const matchesType = filterType === 'All' || device.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  useEffect(() => {
    if (selectedDevice) {
      setCurrentAlerts([...selectedDevice.alerts]);
    } else {
      setCurrentAlerts([]);
    }
  }, [selectedDevice]);

  const severityMap = {
    critical: 'High',
    warning: 'Medium',
    info: 'Low'
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'warning': return 'border-l-4 border-amber-500 bg-amber-50';
      case 'info': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const handleResolveAlert = (id) => {
    setCurrentAlerts(prev => prev.map(alert => 
      alert.time === id ? { ...alert, resolved: true } : alert
    ));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Alerts Report for ${selectedDevice.name} - ${new Date().toLocaleDateString()}`, 10, 10);
    let y = 20;
    doc.text(`Total Alerts: ${currentAlerts.length}`, 10, y);
    y += 10;
    currentAlerts.forEach((alert) => {
      const sev = severityMap[alert.severity] || alert.severity;
      const status = alert.resolved ? 'Resolved' : 'Active';
      doc.text(`${sev} (${status}): ${alert.message} - ${alert.time}`, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`${selectedDevice.name}_alerts_report.pdf`);
  };

  // Alert analytics
  const unresolvedAlerts = currentAlerts.filter(a => !a.resolved);
  const highCount = currentAlerts.filter(a => a.severity === 'critical').length;
  const mediumCount = currentAlerts.filter(a => a.severity === 'warning').length;
  const lowCount = currentAlerts.filter(a => a.severity === 'info').length;
  const resolvedCount = currentAlerts.filter(a => a.resolved).length;

  const chartData = [
    { name: 'High', count: highCount },
    { name: 'Medium', count: mediumCount },
    { name: 'Low', count: lowCount }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-green-50 text-green-700 border-green-200';
      case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'Charging': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Healthy': return <CheckCircle size={16} className="text-green-600" />;
      case 'Warning': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'Critical': return <XCircle size={16} className="text-red-600" />;
      case 'Charging': return <Battery size={16} className="text-blue-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (health) => {
    if (health >= 90) return 'bg-green-600';
    if (health >= 70) return 'bg-amber-600';
    return 'bg-red-600';
  };

  // Device summary stats
  const deviceStats = {
    total: devices.length,
    healthy: devices.filter(d => d.status === 'Healthy').length,
    warning: devices.filter(d => d.status === 'Warning').length,
    critical: devices.filter(d => d.status === 'Critical').length,
    avgHealth: Math.round(devices.reduce((acc, d) => acc + d.health.overall, 0) / devices.length),
    avgUptime: Math.round(devices.reduce((acc, d) => acc + d.uptime, 0) / devices.length * 10) / 10
  };

  // Radar chart data for system metrics
  const radarData = selectedDevice ? [
    { subject: 'CPU', A: selectedDevice.metrics.cpu, fullMark: 100 },
    { subject: 'Memory', A: selectedDevice.metrics.memory, fullMark: 100 },
    { subject: 'Storage', A: selectedDevice.metrics.storage, fullMark: 100 },
    { subject: 'Network', A: selectedDevice.metrics.network, fullMark: 100 }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Device Health Dashboard</h1>
            <p className="text-sm text-gray-500">Monitor and manage all connected devices</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HardDrive size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Devices</p>
            <p className="text-2xl font-bold text-gray-900">{deviceStats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Healthy</p>
            <p className="text-2xl font-bold text-green-600">{deviceStats.healthy}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Warning</p>
            <p className="text-2xl font-bold text-amber-600">{deviceStats.warning}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-600">{deviceStats.critical}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Avg Health</p>
            <p className="text-2xl font-bold text-purple-600">{deviceStats.avgHealth}%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Clock size={20} className="text-cyan-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Avg Uptime</p>
            <p className="text-2xl font-bold text-cyan-600">{deviceStats.avgUptime}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
              <option value="Charging">Charging</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Types</option>
              <option value="Solar">Solar</option>
              <option value="Wind">Wind</option>
              <option value="Battery">Battery</option>
              <option value="Inverter">Inverter</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center justify-center gap-2">
              <Filter size={16} />
              More Filters
            </button>
          </div>
        </div>

        {/* Device Grid / List */}
        {!selectedDevice ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {device.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <Shield size={12} />
                      {device.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(device.status)}`}>
                    {getStatusIcon(device.status)}
                    {device.status}
                  </span>
                </div>
                {/* Health Score Circle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                      <circle
                        cx="40" cy="40" r="36"
                        stroke={device.health.overall >= 90 ? '#10B981' : device.health.overall >= 70 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${(device.health.overall / 100) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className={`text-xl font-bold ${getHealthColor(device.health.overall)}`}>
                        {device.health.overall}
                      </p>
                      <p className="text-xs text-gray-500">Health</p>
                    </div>
                  </div>
                  <div className="flex-1 ml-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-semibold text-gray-900">{device.uptime}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Efficiency</span>
                      <span className="font-semibold text-gray-900">{device.efficiency}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-semibold text-gray-900">{device.temperature}°C</span>
                    </div>
                  </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Power</p>
                    <p className="text-sm font-bold text-gray-900">{device.power} kW</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Voltage</p>
                    <p className="text-sm font-bold text-gray-900">{device.voltage}V</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Current</p>
                    <p className="text-sm font-bold text-gray-900">{device.current.toFixed(1)}A</p>
                  </div>
                </div>
                {/* Alerts Preview */}
                {device.alerts.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-600" />
                        {device.alerts.length} Alert{device.alerts.length > 1 ? 's' : ''}
                      </p>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                )}
                {device.alerts.length === 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} />
                        No alerts
                      </p>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Detailed Device View
          <div>
            <button
              onClick={() => setSelectedDevice(null)}
              className="mb-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              ← Back to All Devices
            </button>
            {/* Device Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDevice.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      {selectedDevice.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Uptime: {selectedDevice.uptime}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold border flex items-center gap-2 ${getStatusColor(selectedDevice.status)}`}>
                    {getStatusIcon(selectedDevice.status)}
                    {selectedDevice.status}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                    <Settings size={16} />
                    Configure
                  </button>
                </div>
              </div>
              {/* Overall Health Score */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <circle
                        cx="80" cy="80" r="70"
                        stroke={selectedDevice.health.overall >= 90 ? '#10B981' : selectedDevice.health.overall >= 70 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(selectedDevice.health.overall / 100) * 440} 440`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className={`text-4xl font-bold ${getHealthColor(selectedDevice.health.overall)}`}>
                        {selectedDevice.health.overall}
                      </p>
                      <p className="text-sm text-gray-500">Overall Health</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedDevice.health).filter(([key]) => key !== 'overall').map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold ${getHealthColor(value)}`}>{value}%</p>
                        <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div
                            className={`h-full rounded-full transition-all ${getHealthBgColor(value)}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Zap size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Power Output</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedDevice.power} kW</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Efficiency</span>
                  <span className="text-sm font-bold text-gray-900">{selectedDevice.efficiency}%</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Thermometer size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Temperature</p>
                    <p className={`text-2xl font-bold ${selectedDevice.temperature > 50 ? 'text-red-600' : 'text-gray-900'}`}>
                      {selectedDevice.temperature}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Voltage</span>
                  <span className="text-sm font-bold text-gray-900">{selectedDevice.voltage}V</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Battery size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedDevice.current.toFixed(1)}A</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className={`text-sm font-bold ${getStatusColor(selectedDevice.status).split(' ')[1]}`}>
                    {selectedDevice.status}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <Clock size={24} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Maintenance</p>
                    <p className="text-lg font-bold text-gray-900">Next: {selectedDevice.nextMaintenance}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Last: {selectedDevice.lastMaintenance}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Historical Data Line Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">24h Historical Data</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedDevice.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="health" stroke="#10B981" name="Health" />
                    <Line type="monotone" dataKey="temp" stroke="#F59E0B" name="Temp (°C)" />
                    <Line type="monotone" dataKey="power" stroke="#3B82F6" name="Power (kW)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* System Metrics Radar Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Extended Alerts Section with Analytics and Export */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-600" />
                  Alerts & Notifications ({unresolvedAlerts.length} Active)
                </h3>
                {currentAlerts.length > 0 && (
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export PDF
                  </button>
                )}
              </div>

              {/* Alerts Analytics */}
              {currentAlerts.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 mb-1">High</p>
                    <p className="text-lg font-bold text-red-800">{highCount}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-600 mb-1">Medium</p>
                    <p className="text-lg font-bold text-yellow-800">{mediumCount}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Low</p>
                    <p className="text-lg font-bold text-green-800">{lowCount}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 mb-1">Resolved</p>
                    <p className="text-lg font-bold text-blue-800">{resolvedCount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold text-gray-900">{currentAlerts.length}</p>
                  </div>
                </div>
              )}

              {/* Alerts Analytics Chart */}
              {currentAlerts.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Alerts by Severity</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Alerts List */}
              <div className="overflow-y-auto max-h-[50vh]">
                <AnimatePresence>
                  {currentAlerts.map((alert) => (
                    <motion.div
                      key={alert.time}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className={`p-4 border-b border-gray-200 ${alert.resolved ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 mt-0.5 ${alert.resolved ? 'text-green-500' : 'text-red-500'}`}>
                          {alert.resolved ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">
                              {severityMap[alert.severity] || alert.severity} Alert
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                              {severityMap[alert.severity] || alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                        </div>
                        {!alert.resolved && (
                          <button
                            onClick={() => handleResolveAlert(alert.time)}
                            className="text-blue-600 hover:text-blue-800 text-sm ml-2"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {currentAlerts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
                  <p className="text-gray-500">Everything is running smoothly.</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDevices.length === 0 && !selectedDevice && (
          <div className="text-center py-12">
            <HardDrive size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
                setFilterType('All');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceDashboard;