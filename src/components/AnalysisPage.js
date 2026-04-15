"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Download, 
  BarChart3, 
  ArrowUp, 
  ArrowDown, 
  Lightbulb
  
} from 'lucide-react';

const RATE_PER_UNIT = 0.15; // ₹ per kWh

const energyMetersData = [
  { id: 1, siteName: "Home 1", name: "Chennai", type: "Energy" },
  { id: 2, siteName: "Home 2", name: "Coimbature", type: "Energy" },
  { id: 3, siteName: "Home 3", name: "Kerala", type: "Energy" },
  { id: 4, siteName: "Home 4", name: "bangalore", type: "Energy" },
  { id: 5, siteName: "Home 5", name: "Visak", type: "Energy" },
  { id: 6, siteName: "Home 6", name: "pune", type: "Energy" }
];

const AnalysisPage = () => {
  const [selectedMeter, setSelectedMeter] = useState('all');
  const [meterDataMap, setMeterDataMap] = useState({});

  // Load / initialize data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('energyMeterDataMap');
    if (saved) {
      setMeterDataMap(JSON.parse(saved));
    } else {
      const initialMap = {
        1: { // Solar – strong daytime peaks
          currentUsageToday: 28.4,
          yesterdayUsage: 24.1,
          thisMonthUsage: 620,
          lastMonthUsage: 580,
          monthlyUsage: [
            { month: 'Jan', usage: 320 }, { month: 'Feb', usage: 290 }, { month: 'Mar', usage: 450 },
            { month: 'Apr', usage: 580 }, { month: 'May', usage: 610 }, { month: 'Jun', usage: 680 },
            { month: 'Jul', usage: 650 }, { month: 'Aug', usage: 590 }, { month: 'Sep', usage: 520 },
            { month: 'Oct', usage: 410 }, { month: 'Nov', usage: 380 }, { month: 'Dec', usage: 410 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 22.1 }, { day: 'Mon', usage: 28.4 }, { day: 'Tue', usage: 25.3 },
            { day: 'Wed', usage: 31.2 }, { day: 'Thu', usage: 26.8 }, { day: 'Fri', usage: 19.5 },
            { day: 'Sat', usage: 24.7 }
          ],
          hourlyUsage: [
            { hour: '00', usage: 0.2 }, { hour: '01', usage: 0.1 }, { hour: '02', usage: 0.1 },
            { hour: '03', usage: 0.1 }, { hour: '04', usage: 0.2 }, { hour: '05', usage: 0.4 },
            { hour: '06', usage: 1.2 }, { hour: '07', usage: 2.8 }, { hour: '08', usage: 3.9 },
            { hour: '09', usage: 4.5 }, { hour: '10', usage: 5.1 }, { hour: '11', usage: 5.6 },
            { hour: '12', usage: 5.8 }, { hour: '13', usage: 5.4 }, { hour: '14', usage: 4.9 },
            { hour: '15', usage: 4.2 }, { hour: '16', usage: 3.5 }, { hour: '17', usage: 2.1 },
            { hour: '18', usage: 1.3 }, { hour: '19', usage: 0.8 }, { hour: '20', usage: 0.4 },
            { hour: '21', usage: 0.3 }, { hour: '22', usage: 0.2 }, { hour: '23', usage: 0.2 }
          ]
        },
        2: { // Wind – fluctuating
          currentUsageToday: 35.7,
          yesterdayUsage: 29.4,
          thisMonthUsage: 850,
          lastMonthUsage: 920,
          monthlyUsage: [
            { month: 'Jan', usage: 410 }, { month: 'Feb', usage: 380 }, { month: 'Mar', usage: 420 },
            { month: 'Apr', usage: 390 }, { month: 'May', usage: 460 }, { month: 'Jun', usage: 510 },
            { month: 'Jul', usage: 480 }, { month: 'Aug', usage: 430 }, { month: 'Sep', usage: 400 },
            { month: 'Oct', usage: 370 }, { month: 'Nov', usage: 450 }, { month: 'Dec', usage: 410 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 31.2 }, { day: 'Mon', usage: 35.7 }, { day: 'Tue', usage: 28.9 },
            { day: 'Wed', usage: 42.1 }, { day: 'Thu', usage: 33.4 }, { day: 'Fri', usage: 27.8 },
            { day: 'Sat', usage: 36.5 }
          ],
          hourlyUsage: [
            { hour: '00', usage: 1.8 }, { hour: '01', usage: 2.3 }, { hour: '02', usage: 1.4 },
            { hour: '03', usage: 2.1 }, { hour: '04', usage: 1.9 }, { hour: '05', usage: 1.6 },
            { hour: '06', usage: 2.4 }, { hour: '07', usage: 1.8 }, { hour: '08', usage: 2.7 },
            { hour: '09', usage: 3.1 }, { hour: '10', usage: 2.5 }, { hour: '11', usage: 1.9 },
            { hour: '12', usage: 2.8 }, { hour: '13', usage: 3.4 }, { hour: '14', usage: 2.2 },
            { hour: '15', usage: 2.9 }, { hour: '16', usage: 3.6 }, { hour: '17', usage: 2.7 },
            { hour: '18', usage: 1.8 }, { hour: '19', usage: 2.4 }, { hour: '20', usage: 3.1 },
            { hour: '21', usage: 2.5 }, { hour: '22', usage: 1.9 }, { hour: '23', usage: 1.6 }
          ]
        },
        3: { // Battery – stable
          currentUsageToday: 18.9,
          yesterdayUsage: 19.2,
          thisMonthUsage: 420,
          lastMonthUsage: 410,
          monthlyUsage: [
            { month: 'Jan', usage: 340 }, { month: 'Feb', usage: 330 }, { month: 'Mar', usage: 350 },
            { month: 'Apr', usage: 360 }, { month: 'May', usage: 380 }, { month: 'Jun', usage: 390 },
            { month: 'Jul', usage: 410 }, { month: 'Aug', usage: 400 }, { month: 'Sep', usage: 380 },
            { month: 'Oct', usage: 370 }, { month: 'Nov', usage: 360 }, { month: 'Dec', usage: 420 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 18.5 }, { day: 'Mon', usage: 18.9 }, { day: 'Tue', usage: 19.1 },
            { day: 'Wed', usage: 18.7 }, { day: 'Thu', usage: 19.3 }, { day: 'Fri', usage: 18.4 },
            { day: 'Sat', usage: 19.0 }
          ],
          hourlyUsage: Array.from({ length: 24 }, (_, i) => ({
            hour: String(i).padStart(2, '0'),
            usage: 0.75 + Math.random() * 0.3
          }))
        },
        4: { // Inverter – steady grid
          currentUsageToday: 42.3,
          yesterdayUsage: 38.6,
          thisMonthUsage: 980,
          lastMonthUsage: 950,
          monthlyUsage: [
            { month: 'Jan', usage: 780 }, { month: 'Feb', usage: 760 }, { month: 'Mar', usage: 820 },
            { month: 'Apr', usage: 850 }, { month: 'May', usage: 910 }, { month: 'Jun', usage: 930 },
            { month: 'Jul', usage: 960 }, { month: 'Aug', usage: 940 }, { month: 'Sep', usage: 890 },
            { month: 'Oct', usage: 830 }, { month: 'Nov', usage: 810 }, { month: 'Dec', usage: 980 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 39.2 }, { day: 'Mon', usage: 42.3 }, { day: 'Tue', usage: 40.8 },
            { day: 'Wed', usage: 44.1 }, { day: 'Thu', usage: 41.5 }, { day: 'Fri', usage: 37.9 },
            { day: 'Sat', usage: 43.0 }
          ],
          hourlyUsage: Array.from({ length: 24 }, (_, i) => ({
            hour: String(i).padStart(2, '0'),
            usage: 1.4 + Math.sin(i / 4) * 0.6
          }))
        },
        5: { // Hybrid Solar+Wind
          currentUsageToday: 31.2,
          yesterdayUsage: 27.8,
          thisMonthUsage: 710,
          lastMonthUsage: 680,
          monthlyUsage: [
            { month: 'Jan', usage: 410 }, { month: 'Feb', usage: 380 }, { month: 'Mar', usage: 460 },
            { month: 'Apr', usage: 580 }, { month: 'May', usage: 640 }, { month: 'Jun', usage: 690 },
            { month: 'Jul', usage: 670 }, { month: 'Aug', usage: 620 }, { month: 'Sep', usage: 560 },
            { month: 'Oct', usage: 480 }, { month: 'Nov', usage: 430 }, { month: 'Dec', usage: 410 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 26.4 }, { day: 'Mon', usage: 31.2 }, { day: 'Tue', usage: 29.7 },
            { day: 'Wed', usage: 34.5 }, { day: 'Thu', usage: 30.1 }, { day: 'Fri', usage: 25.3 },
            { day: 'Sat', usage: 28.9 }
          ],
          hourlyUsage: [
            { hour: '00', usage: 0.9 }, { hour: '01', usage: 0.7 }, { hour: '02', usage: 0.8 },
            { hour: '03', usage: 0.6 }, { hour: '04', usage: 0.8 }, { hour: '05', usage: 1.1 },
            { hour: '06', usage: 2.1 }, { hour: '07', usage: 3.4 }, { hour: '08', usage: 4.2 },
            { hour: '09', usage: 4.8 }, { hour: '10', usage: 5.3 }, { hour: '11', usage: 4.9 },
            { hour: '12', usage: 4.6 }, { hour: '13', usage: 4.1 }, { hour: '14', usage: 3.7 },
            { hour: '15', usage: 3.2 }, { hour: '16', usage: 2.8 }, { hour: '17', usage: 2.3 },
            { hour: '18', usage: 1.9 }, { hour: '19', usage: 1.6 }, { hour: '20', usage: 1.4 },
            { hour: '21', usage: 1.2 }, { hour: '22', usage: 1.0 }, { hour: '23', usage: 0.9 }
          ]
        },
        6: { // Battery Bank
          currentUsageToday: 16.4,
          yesterdayUsage: 17.1,
          thisMonthUsage: 380,
          lastMonthUsage: 390,
          monthlyUsage: [
            { month: 'Jan', usage: 310 }, { month: 'Feb', usage: 300 }, { month: 'Mar', usage: 320 },
            { month: 'Apr', usage: 330 }, { month: 'May', usage: 350 }, { month: 'Jun', usage: 360 },
            { month: 'Jul', usage: 370 }, { month: 'Aug', usage: 380 }, { month: 'Sep', usage: 350 },
            { month: 'Oct', usage: 340 }, { month: 'Nov', usage: 330 }, { month: 'Dec', usage: 380 }
          ],
          dailyUsage: [
            { day: 'Sun', usage: 16.8 }, { day: 'Mon', usage: 16.4 }, { day: 'Tue', usage: 17.0 },
            { day: 'Wed', usage: 16.2 }, { day: 'Thu', usage: 16.9 }, { day: 'Fri', usage: 15.8 },
            { day: 'Sat', usage: 17.3 }
          ],
          hourlyUsage: Array.from({ length: 24 }, (_, i) => ({
            hour: String(i).padStart(2, '0'),
            usage: 0.65 + Math.random() * 0.25
          }))
        }
      };
      localStorage.setItem('energyMeterDataMap', JSON.stringify(initialMap));
      setMeterDataMap(initialMap);
    }
  }, []);

  // Aggregate all meters
  const getAggregatedData = (map) => {
    const meters = Object.values(map);
    if (meters.length === 0) return null;

    const sumToday = meters.reduce((acc, m) => acc + m.currentUsageToday, 0);
    const sumYesterday = meters.reduce((acc, m) => acc + m.yesterdayUsage, 0);
    const sumThisMonth = meters.reduce((acc, m) => acc + m.thisMonthUsage, 0);
    const sumLastMonth = meters.reduce((acc, m) => acc + m.lastMonthUsage, 0);

    const monthlyAgg = meters[0].monthlyUsage.map((entry, i) => ({
      month: entry.month,
      usage: meters.reduce((sum, m) => sum + m.monthlyUsage[i].usage, 0)
    }));

    const dailyAgg = meters[0].dailyUsage.map((entry, i) => ({
      day: entry.day,
      usage: meters.reduce((sum, m) => sum + m.dailyUsage[i].usage, 0)
    }));

    const hourlyAgg = meters[0].hourlyUsage.map((entry, i) => ({
      hour: entry.hour,
      usage: meters.reduce((sum, m) => sum + m.hourlyUsage[i].usage, 0)
    }));

    return {
      currentUsageToday: parseFloat(sumToday.toFixed(1)),
      yesterdayUsage: parseFloat(sumYesterday.toFixed(1)),
      thisMonthUsage: Math.round(sumThisMonth),
      lastMonthUsage: Math.round(sumLastMonth),
      monthlyUsage: monthlyAgg,
      dailyUsage: dailyAgg,
      hourlyUsage: hourlyAgg
    };
  };

  const currentData = useMemo(() => {
    if (Object.keys(meterDataMap).length === 0) return null;
    if (selectedMeter === 'all') {
      return getAggregatedData(meterDataMap);
    }
    return meterDataMap[selectedMeter] || null;
  }, [selectedMeter, meterDataMap]);

  const selectedMeterName = selectedMeter === 'all'
    ? 'All Energy Meters'
    : energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName + ' – ' +
      energyMetersData.find(m => m.id === parseInt(selectedMeter))?.name;

  // Derived values
  const todayCost = currentData ? Math.round(currentData.currentUsageToday * RATE_PER_UNIT * 100) / 100 : 0;
  const monthPercentChange = currentData
    ? ((currentData.thisMonthUsage - currentData.lastMonthUsage) / currentData.lastMonthUsage * 100).toFixed(0)
    : 0;
  const estimatedMonthlyBill = currentData ? Math.round(currentData.thisMonthUsage * RATE_PER_UNIT) : 0;

  // Dynamic insights
  const smartInsights = currentData ? [
    `Peak today at ${currentData.hourlyUsage.reduce((max, curr) => curr.usage > max.usage ? curr : max).hour}:00 (${currentData.hourlyUsage.reduce((max, curr) => curr.usage > max.usage ? curr : max).usage} kWh)`,
    `Weekly average ${ (currentData.dailyUsage.reduce((sum, d) => sum + d.usage, 0) / 7).toFixed(1) } kWh/day`,
    `Est. monthly bill ₹${estimatedMonthlyBill} – ${estimatedMonthlyBill > 80 ? 'above average' : 'on track'}`,
    `Shift 2 peak hours to save ~₹${Math.round(estimatedMonthlyBill * 0.08)} this month`
  ] : [];

  const monthlyCostData = currentData
    ? currentData.monthlyUsage.map(item => ({
        month: item.month,
        cost: Math.round(item.usage * RATE_PER_UNIT * 100) / 100
      }))
    : [];

  const handleExport = () => {
    if (!currentData) return;
    const csvContent = 
      'Month,Usage (kWh),Cost (₹)\n' +
      currentData.monthlyUsage.map((row, i) => 
        `${row.month},${row.usage},${monthlyCostData[i].cost}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `energy_insights_${selectedMeterName.replace(/ /g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading energy data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full px-6 py-6 max-w-screen-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-2xl">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Energy Insights</h1>
              <p className="text-sm text-gray-500">Live analytics • Real-time meter data</p>
            </div>
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold transition-all"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* METER SELECTOR */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 font-medium text-gray-700 text-sm">
            <BarChart3 size={18} />
            ENERGY METER
          </div>
          <select 
            value={selectedMeter}
            onChange={(e) => setSelectedMeter(e.target.value)}
            className="flex-1 max-w-md px-5 py-3 border border-gray-200 rounded-3xl text-sm focus:border-emerald-500 outline-none transition-colors"
          >
            <option value="all">All Energy Meters</option>
            {energyMetersData.map(meter => (
              <option key={meter.id} value={meter.id}>
                {meter.siteName} — {meter.name} ({meter.type})
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-500">
            Showing: <span className="font-semibold text-gray-900">{selectedMeterName}</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Today's Usage */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Today&apos;s Usage</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {currentData.currentUsageToday} <span className="text-sm text-gray-400 font-normal">kWh</span>
                </p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-2xl">
                <Zap size={24} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm">
              {currentData.currentUsageToday > currentData.yesterdayUsage ? (
                <ArrowUp size={16} className="text-red-500" />
              ) : (
                <ArrowDown size={16} className="text-emerald-500" />
              )}
              <span className={`font-medium ${currentData.currentUsageToday > currentData.yesterdayUsage ? 'text-red-500' : 'text-emerald-500'}`}>
                {Math.abs(((currentData.currentUsageToday - currentData.yesterdayUsage) / currentData.yesterdayUsage * 100).toFixed(0))}% vs yesterday
              </span>
            </div>
          </div>

          {/* Today's Cost */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Today&apos;s Cost</p>
                <p className="text-2xl font-semibold text-amber-600 mt-2">₹{todayCost}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-2xl">
                <DollarSign size={24} className="text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-6">at ₹{RATE_PER_UNIT}/kWh</p>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">This Month</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {currentData.thisMonthUsage} <span className="text-sm text-gray-400 font-normal">kWh</span>
                </p>
              </div>
              <div className="p-2 bg-teal-100 rounded-2xl">
                <TrendingUp size={24} className="text-teal-500" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className={`font-medium ${parseFloat(monthPercentChange) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {parseFloat(monthPercentChange) > 0 ? '↑' : '↓'} {Math.abs(monthPercentChange)}% vs last month
              </span>
            </div>
          </div>

          {/* Est. Monthly Bill */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Est. Monthly Bill</p>
                <p className="text-2xl font-semibold text-amber-600 mt-2">₹{estimatedMonthlyBill}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-2xl">
                <DollarSign size={24} className="text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-emerald-500 mt-6 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Current trend
            </p>
          </div>
        </div>

        {/* ENERGY USAGE ANALYSIS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Zap size={20} className="text-emerald-600" />
            Energy Usage Analysis
          </h2>

          {/* Monthly */}
          <div className="mb-10">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Energy Usage (kWh)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={currentData.monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(value) => [`${value} kWh`, 'Usage']} />
                <Line type="monotone" dataKey="usage" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily + Hourly */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Last 7 Days (kWh)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={currentData.dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} kWh`, 'Usage']} />
                  <Bar dataKey="usage" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Today&apos;s Hourly Usage (kWh)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={currentData.hourlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} kWh`, 'Usage']} />
                  <Line type="monotone" dataKey="usage" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COST ANALYSIS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <DollarSign size={20} className="text-amber-600" />
            Cost Analysis
          </h2>

          <div className="mb-10">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Bill Trend (₹)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Cost']} />
                <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-700 font-medium">Today&apos;s Cost</p>
                  <p className="text-2xl font-semibold text-amber-600 mt-2">₹{todayCost}</p>
                </div>
                <DollarSign size={24} className="text-amber-400" />
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-emerald-700 font-medium">Est. Monthly Bill</p>
                  <p className="text-2xl font-semibold text-emerald-600 mt-2">₹{estimatedMonthlyBill}</p>
                </div>
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* SMART INSIGHTS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Lightbulb size={20} className="text-amber-600" />
            Smart Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smartInsights.map((insight, i) => (
              <div key={i} className="flex gap-4 bg-gray-50 rounded-3xl p-5">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl">💡</div>
                <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisPage;