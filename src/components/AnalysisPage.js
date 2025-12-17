// AnalysisPage.js - Comprehensive Energy Analysis Component for Super Admin (Enhanced with Export and Filter)
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, TrendingUp, Activity, Zap, Battery, Shield } from 'lucide-react';

const AnalysisPage = () => {
  const [analysisType, setAnalysisType] = useState('trend');
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-12-17' }); // Custom date range
  const [filterOptions, setFilterOptions] = useState({ efficiencyMin: '', device: 'all' }); // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Mock aggregated data for 2025 (based on current date: Dec 17, 2025)
  const monthlyDataRaw = [
    { month: 'Jan', consumption: 30, production: 35, efficiency: 85 },
    { month: 'Feb', consumption: 40, production: 42, efficiency: 88 },
    { month: 'Mar', consumption: 35, production: 38, efficiency: 82 },
    { month: 'Apr', consumption: 50, production: 55, efficiency: 90 },
    { month: 'May', consumption: 49, production: 52, efficiency: 92 },
    { month: 'Jun', consumption: 60, production: 65, efficiency: 95 },
    { month: 'Jul', consumption: 70, production: 75, efficiency: 93 },
    { month: 'Aug', consumption: 91, production: 95, efficiency: 89 },
    { month: 'Sep', consumption: 125, production: 130, efficiency: 87 },
    { month: 'Oct', consumption: 110, production: 115, efficiency: 91 },
    { month: 'Nov', consumption: 95, production: 98, efficiency: 94 },
    { month: 'Dec', consumption: 85, production: 90, efficiency: 96 } // Up to Dec 17
  ];

  // Device-specific efficiency breakdown
  const efficiencyBreakdownRaw = [
    { device: 'Solar Panels', efficient: 65, moderate: 25, inefficient: 10 },
    { device: 'Wind Turbines', efficient: 70, moderate: 20, inefficient: 10 },
    { device: 'Batteries', efficient: 80, moderate: 15, inefficient: 5 },
    { device: 'Inverters', efficient: 55, moderate: 30, inefficient: 15 }
  ];

  // Overall system health trends (percentages sum to 100)
  const healthTrendsRaw = [
    { month: 'Jan', healthy: 95, warning: 3, critical: 2 },
    { month: 'Feb', healthy: 96, warning: 2, critical: 2 },
    { month: 'Mar', healthy: 94, warning: 4, critical: 2 },
    { month: 'Apr', healthy: 97, warning: 2, critical: 1 },
    { month: 'May', healthy: 98, warning: 1, critical: 1 },
    { month: 'Jun', healthy: 99, warning: 1, critical: 0 },
    { month: 'Jul', healthy: 97, warning: 2, critical: 1 },
    { month: 'Aug', healthy: 96, warning: 3, critical: 1 },
    { month: 'Sep', healthy: 93, warning: 5, critical: 2 },
    { month: 'Oct', healthy: 95, warning: 3, critical: 2 },
    { month: 'Nov', healthy: 97, warning: 2, critical: 1 },
    { month: 'Dec', healthy: 98, warning: 1, critical: 1 }
  ];

  // Filter monthly data by date range and efficiency
  const monthlyData = monthlyDataRaw.filter((item) => {
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month);
    const itemDate = new Date(`2025-${String(monthIndex + 1).padStart(2, '0')}-01`);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const efficiencyMin = parseInt(filterOptions.efficiencyMin) || 0;
    return itemDate >= startDate && itemDate <= endDate && item.efficiency >= efficiencyMin;
  });

  // Filter efficiency breakdown by device
  const efficiencyBreakdown = filterOptions.device === 'all' 
    ? efficiencyBreakdownRaw 
    : efficiencyBreakdownRaw.filter((item) => item.device === filterOptions.device);

  // Filter health trends similarly to monthly data
  const healthTrends = healthTrendsRaw.filter((item) => {
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month);
    const itemDate = new Date(`2025-${String(monthIndex + 1).padStart(2, '0')}-01`);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return itemDate >= startDate && itemDate <= endDate;
  });

  // Overall metrics based on filtered data
  const totalProduction = monthlyData.reduce((sum, d) => sum + d.production, 0);
  const avgEfficiency = monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.efficiency, 0) / monthlyData.length) : 0;
  const peakMonth = monthlyData.length > 0 ? monthlyData.reduce((max, d) => d.production > max.production ? d : max, monthlyData[0]) : { month: 'N/A', production: 0 };

  // Export function - CSV download
  const handleExport = () => {
    let csvContent = '';
    if (analysisType === 'trend') {
      csvContent = 'Month,Consumption (kWh),Production (kWh),Efficiency (%)\n' + 
        monthlyData.map(row => `${row.month},${row.consumption},${row.production},${row.efficiency}`).join('\n');
    } else if (analysisType === 'efficiency') {
      csvContent = 'Device,Efficient (%),Moderate (%),Inefficient (%)\n' + 
        efficiencyBreakdown.map(row => `${row.device},${row.efficient},${row.moderate},${row.inefficient}`).join('\n');
    } else {
      csvContent = 'Month,Healthy (%),Warning (%),Critical (%)\n' + 
        healthTrends.map(row => `${row.month},${row.healthy},${row.warning},${row.critical}`).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${analysisType}_analysis_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter modal handler
  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);
  const applyFilters = () => {
    toggleFilterModal();
  };

  const resetFilters = () => {
    setDateRange({ start: '2025-01-01', end: '2025-12-17' });
    setFilterOptions({ efficiencyMin: '', device: 'all' });
  };

  // COLORS
  const COLORS = ['#00FFB0', '#FFB000', '#FF6B6B'];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3"
      >
        <TrendingUp size={32} className="text-teal-500" />
        Super Admin: Energy Analysis Dashboard
      </motion.h1>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAnalysisType('trend')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                analysisType === 'trend'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <TrendingUp size={16} />
              Energy Trends
            </button>
            <button
              onClick={() => setAnalysisType('efficiency')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                analysisType === 'efficiency'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Activity size={16} />
              Efficiency
            </button>
            <button
              onClick={() => setAnalysisType('health')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                analysisType === 'health'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Shield size={16} />
              Health Status
            </button>
          </div>
          <div className="flex items-center gap-2 justify-self-end">
            <button
              onClick={toggleFilterModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2 shadow-md"
            >
              <Filter size={16} />
              Filter
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 flex items-center gap-2 shadow-md"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleFilterModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Apply Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Efficiency (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filterOptions.efficiencyMin}
                  onChange={(e) => setFilterOptions({ ...filterOptions, efficiencyMin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Filter</label>
                <select
                  value={filterOptions.device}
                  onChange={(e) => setFilterOptions({ ...filterOptions, device: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Devices</option>
                  <option value="Solar Panels">Solar Panels</option>
                  <option value="Wind Turbines">Wind Turbines</option>
                  <option value="Batteries">Batteries</option>
                  <option value="Inverters">Inverters</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Zap size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Production</p>
              <p className="text-2xl font-bold text-gray-900">{totalProduction} kWh</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Efficiency</p>
              <p className="text-2xl font-bold text-green-600">{avgEfficiency}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Battery size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Peak Month</p>
              <p className="text-2xl font-bold text-blue-600">{peakMonth.month} ({peakMonth.production} kWh)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        {analysisType === 'trend' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Energy Trends - {dateRange.start} to {dateRange.end}</h3>
            {monthlyData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data matches the current filters.</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consumption" stroke="#00D4FF" name="Consumption" />
                  <Line type="monotone" dataKey="production" stroke="#00FFB0" name="Production" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : analysisType === 'efficiency' ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Efficiency Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={efficiencyBreakdown.reduce((acc, item) => {
                        acc.push({ name: 'Efficient', value: acc.find(e => e.name === 'Efficient')?.value + item.efficient || item.efficient });
                        acc.push({ name: 'Moderate', value: acc.find(e => e.name === 'Moderate')?.value + item.moderate || item.moderate });
                        acc.push({ name: 'Inefficient', value: acc.find(e => e.name === 'Inefficient')?.value + item.inefficient || item.inefficient });
                        return [...new Set(acc.map(d => d.name))].map(name => ({ name, value: acc.filter(d => d.name === name).reduce((sum, d) => sum + d.value, 0) }));
                      }, [])}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Device Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inefficient</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {efficiencyBreakdown.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No devices match the filter.</td>
                      </tr>
                    ) : (
                      efficiencyBreakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.device}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{item.efficient}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{item.moderate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.inefficient}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Health Status Trends - {dateRange.start} to {dateRange.end}</h3>
            {healthTrends.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data matches the current filters.</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={healthTrends} stackOffset="sign">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="healthy" stackId="a" fill="#00FFB0" />
                  <Bar dataKey="warning" stackId="a" fill="#FFB000" />
                  <Bar dataKey="critical" stackId="a" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </motion.div>

      {/* Insights Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Production peaked in {peakMonth.month} due to optimal weather conditions.</li>
          <li>• Overall efficiency improved by 5% YoY, driven by battery optimizations.</li>
          <li>• Critical alerts reduced by 20% in Q4 through proactive maintenance.</li>
          <li>• Recommendation: Schedule inverter upgrades to boost efficiency above 90%.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;