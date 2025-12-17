import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Sun, Wind, Battery, TrendingUp, TrendingDown, Leaf, DollarSign, AlertCircle, Activity, Power, Clock, Award, Download, Filter, Calendar } from 'lucide-react';

const ProfessionalEnergyDashboard = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [currentPower, setCurrentPower] = useState(2847);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const powerInterval = setInterval(() => {
      setCurrentPower(prev => Math.max(2400, Math.min(3200, prev + (Math.random() - 0.5) * 80)));
    }, 2000);
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(powerInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const summary = {
    totalGenerated: 3847,
    totalConsumed: 3600,
    netEnergy: 247,
    monthlySavings: 3800,
    powerFactor: 0.92,
    frequency: 50.02,
    carbonAvoided: 24.7,
    treesEquivalent: 412,
    carbonCredits: 1247
  };

  const energyMix = [
    { name: 'Solar', value: 45, color: '#F59E0B', kWh: 1731 },
    { name: 'Wind', value: 28, color: '#3B82F6', kWh: 1077 },
    { name: 'Grid', value: 18, color: '#8B5CF6', kWh: 692 },
    { name: 'Battery', value: 9, color: '#10B981', kWh: 346 }
  ];

  const facilities = [
    { name: 'Factory 1 - Production', consumption: 1245, efficiency: 'High', status: 'Online', cost: '$2,847', percentage: 35 },
    { name: 'Factory 2 - Assembly', consumption: 987, efficiency: 'High', status: 'Online', cost: '$2,256', percentage: 27 },
    { name: 'Office HQ', consumption: 456, efficiency: 'Medium', status: 'Online', cost: '$1,043', percentage: 13 },
    { name: 'Warehouse', consumption: 678, efficiency: 'Medium', status: 'Online', cost: '$1,550', percentage: 19 },
    { name: 'EV Charging Station', consumption: 234, efficiency: 'Low', status: 'Idle', cost: '$535', percentage: 6 }
  ];

  const hourlyData = [
    { hour: '00:00', consumption: 2100, generation: 0, cost: 180 },
    { hour: '04:00', consumption: 1800, generation: 0, cost: 160 },
    { hour: '08:00', consumption: 2900, generation: 1200, cost: 140 },
    { hour: '12:00', consumption: 3400, generation: 3800, cost: 90 },
    { hour: '16:00', consumption: 3100, generation: 2400, cost: 120 },
    { hour: '20:00', consumption: 2600, generation: 400, cost: 200 },
    { hour: '24:00', consumption: 2300, generation: 0, cost: 190 }
  ];

  const forecastData = [
    { time: 'Now', actual: 2847, predicted: null },
    { time: '+2h', actual: 3100, predicted: null },
    { time: '+4h', actual: 3350, predicted: null },
    { time: '+6h', actual: null, predicted: 3200 },
    { time: '+8h', actual: null, predicted: 2900 },
    { time: '+10h', actual: null, predicted: 2650 },
    { time: '+12h', actual: null, predicted: 2400 }
  ];

  const alerts = [
    { id: 1, title: 'Solar Efficiency Alert', message: 'Panel efficiency dropped 8%. Check for dust or shading.', severity: 'warning', time: '15 min ago' },
    { id: 2, title: 'Peak Optimization Success', message: 'Battery discharge during peak hours saved $247 today.', severity: 'success', time: '1 hour ago' },
    { id: 3, title: 'High Demand Forecast', message: 'Predicted peak at 2-4 PM tomorrow. Pre-charge batteries.', severity: 'info', time: '2 hours ago' }
  ];

  const getEfficiencyColor = (efficiency) => {
    if (efficiency === 'High') return 'bg-green-50 text-green-700 border-green-200';
    if (efficiency === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getSeverityStyle = (severity) => {
    if (severity === 'warning') return 'border-l-4 border-amber-400 bg-amber-50';
    if (severity === 'success') return 'border-l-4 border-green-400 bg-green-50';
    return 'border-l-4 border-blue-400 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {/* Professional Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Energy Management Dashboard</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Clock size={14} />
              Last updated: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              {timeRange === 'today' ? 'Today' : timeRange}
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Sun size={20} className="text-amber-600" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs font-semibold text-green-700">
                <TrendingUp size={12} />
                +12%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Generated</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.totalGenerated.toLocaleString()} kWh</p>
            <p className="text-xs text-gray-500">vs yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap size={20} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded text-xs font-semibold text-red-700">
                <TrendingDown size={12} />
                -5%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Consumed</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.totalConsumed.toLocaleString()} kWh</p>
            <p className="text-xs text-gray-500">vs yesterday</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Battery size={20} className="text-green-600" />
              </div>
              <div className="px-2 py-1 bg-green-50 rounded text-xs font-semibold text-green-700">
                Surplus
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Net Energy</p>
            <p className="text-2xl font-bold text-green-600 mb-1">+{summary.netEnergy} kWh</p>
            <p className="text-xs text-gray-500">Available storage</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign size={20} className="text-purple-600" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs font-semibold text-purple-700">
                <TrendingUp size={12} />
                +18%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Monthly Savings</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">${summary.monthlySavings.toLocaleString()}</p>
            <p className="text-xs text-gray-500">vs grid-only cost</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              +25%
            </div>
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1">Carbon Credits</p>
            <p className="text-2xl font-bold text-green-600 mb-1">{summary.carbonCredits.toLocaleString()}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Leaf size={12} />
              {summary.carbonAvoided} tons CO₂ avoided
            </p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <div className="bg-green-600 h-full rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Power Monitor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="text-blue-600" size={20} />
              Live Power Monitor
            </h3>
            <div className="flex flex-col items-center py-6">
              <div className="relative mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle 
                    cx="96" cy="96" r="88" 
                    stroke="#3B82F6" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${(currentPower / 4000) * 553} 553`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-gray-900">{Math.round(currentPower)}</p>
                  <p className="text-sm font-medium text-gray-500">kW</p>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Sun size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Solar Output</span>
                  </div>
                  <span className="font-bold text-gray-900">1,245 kW</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Battery size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Battery Status</span>
                  </div>
                  <span className="font-bold text-gray-900">78% • 245 kWh</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Power size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Grid Import</span>
                  </div>
                  <span className="font-bold text-gray-900">520 kW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Source Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Energy Source Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={energyMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {energyMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {energyMix.map((source, idx) => (
                <div key={idx} className="p-3 rounded-lg border" style={{backgroundColor: source.color + '10', borderColor: source.color + '40'}}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: source.color}}></div>
                    <span className="text-xs font-medium text-gray-700">{source.name}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{source.value}%</p>
                  <p className="text-xs text-gray-500">{source.kWh} kWh</p>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="text-green-600" size={20} />
              Environmental Impact
            </h3>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-green-50 rounded-full border-2 border-green-200 mb-4">
                <div>
                  <p className="text-4xl font-bold text-green-600">{summary.carbonAvoided}</p>
                  <p className="text-xs font-medium text-gray-500">tons CO₂</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-6">Carbon emissions avoided this month</p>
              <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-full bg-green-600 rounded-full" style={{width: '76%'}}></div>
              </div>
              <p className="text-xs font-medium text-gray-500 mb-6">76% towards annual sustainability goal</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">89%</p>
                  <p className="text-xs font-medium text-gray-600">Renewable Energy</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{summary.treesEquivalent}</p>
                  <p className="text-xs font-medium text-gray-600">Trees Planted</p>
                </div>
              </div>
              <button className="w-full p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                <p className="text-sm font-semibold text-green-700 flex items-center justify-center gap-2">
                  <Award size={16} />
                  {summary.carbonCredits.toLocaleString()} Credits Earned
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Facility Consumption Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Facility Energy Consumption</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Facility</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Consumption</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Usage %</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Efficiency</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="font-medium text-gray-900">{facility.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900">{facility.consumption} kWh</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-blue-600 rounded-full" style={{width: `${facility.percentage}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{facility.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEfficiencyColor(facility.efficiency)}`}>
                        {facility.efficiency}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        facility.status === 'Online' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {facility.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">{facility.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Energy Flow */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Energy Flow - 24 Hour View</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="consumptionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="generationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="generation" stroke="#10B981" fill="url(#generationGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="consumption" stroke="#EF4444" fill="url(#consumptionGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Forecast */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              AI Demand Forecast
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
                <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700">
                Forecast Confidence: <span className="font-bold text-blue-600">92%</span> • Peak expected at 2-4 PM tomorrow
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="text-amber-600" size={20} />
            System Alerts & Insights
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg ${getSeverityStyle(alert.severity)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{alert.title}</h4>
                  <span className="text-xs font-medium text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalEnergyDashboard;