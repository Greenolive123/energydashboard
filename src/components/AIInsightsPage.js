"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Shield, 
  Zap, 
  Calendar, 
  BarChart3, 
  Download, 
  Play, 
  Pause, 
  Clock 
} from 'lucide-react';

const energyMetersData = [
  { id: 1, siteName: "Home 1", name: "Chennai", type: "Energy" },
  { id: 2, siteName: "Home 2", name: "Coimbature", type: "Energy" },
  { id: 3, siteName: "Home 3", name: "Kerala", type: "Energy" },
  { id: 4, siteName: "Home 4", name: "bangalore", type: "Energy" },
  { id: 5, siteName: "Home 5", name: "Visak", type: "Energy" },
  { id: 6, siteName: "Home 6", name: "pune", type: "Energy" }
];

const AIInsightsPage = () => {
  const [energyReadings, setEnergyReadings] = useState([]);
  const [liveMode, setLiveMode] = useState(true);
  const [selectedMeter, setSelectedMeter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '2025-12-01', to: '2025-12-31' });

  // Generate realistic master dataset once
  const generateMasterData = () => {
    const data = [];
    const startDate = new Date('2025-12-01');
    let id = 1;

    for (let day = 0; day < 30; day++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(currentDay.getDate() + day);

      for (let meterId = 1; meterId <= 6; meterId++) {
        for (let hour = 0; hour < 24; hour += 2) { // 12 readings per day
          const timestamp = new Date(currentDay);
          timestamp.setHours(hour, Math.floor(Math.random() * 60));

          let power = 1.8 + Math.random() * 4.5;

          // Meter-specific patterns
          if (meterId === 1 || meterId === 5) { // Solar
            if (hour >= 6 && hour <= 18) power += 4 + Math.random() * 5;
            else power *= 0.3;
          } else if (meterId === 2) { // Wind - fluctuating
            power += (Math.random() * 7 - 3.5);
          } else if (meterId === 3 || meterId === 6) { // Battery - stable
            power = 1.2 + Math.random() * 1.8;
          } else if (meterId === 4) { // Factory / Inverter - evening heavy
            if (hour >= 16 && hour <= 22) power += 5 + Math.random() * 3;
          }

          power = Math.max(0.4, parseFloat(power.toFixed(1)));

          data.push({
            id: id++,
            meterId,
            timestamp: timestamp.toISOString(),
            power,
            voltage: parseFloat((220 + Math.random() * 22).toFixed(1)),
            current: parseFloat((power * 4.5 + Math.random() * 6).toFixed(1))
          });
        }
      }
    }
    return data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Load / initialize data
  useEffect(() => {
    const saved = localStorage.getItem('aiEnergyReadings');
    if (saved) {
      setEnergyReadings(JSON.parse(saved));
    } else {
      const master = generateMasterData();
      setEnergyReadings(master);
      localStorage.setItem('aiEnergyReadings', JSON.stringify(master));
    }
  }, []);

  // Live mode - append real new readings
  useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(() => {
      const now = new Date();
      const meterId = selectedMeter === 'all' 
        ? Math.floor(Math.random() * 6) + 1 
        : parseInt(selectedMeter);

      const basePower = selectedMeter === 'all' ? 3.5 : 4.2;
      const livePower = parseFloat((basePower + (Math.random() * 3 - 1.5)).toFixed(1));

      const newReading = {
        id: Date.now(),
        meterId,
        timestamp: now.toISOString(),
        power: livePower,
        voltage: parseFloat((225 + Math.random() * 15).toFixed(1)),
        current: parseFloat((livePower * 5).toFixed(1))
      };

      setEnergyReadings(prev => {
        const updated = [...prev, newReading];
        localStorage.setItem('aiEnergyReadings', JSON.stringify(updated));
        return updated;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [liveMode, selectedMeter]);

  // Filtered data (used for all calculations)
  const filteredData = useMemo(() => {
    if (!energyReadings.length) return [];

    const from = new Date(dateRange.from + 'T00:00:00');
    const to = new Date(dateRange.to + 'T23:59:59');

    return energyReadings.filter(r => {
      const ts = new Date(r.timestamp);
      const meterMatch = selectedMeter === 'all' || r.meterId === parseInt(selectedMeter);
      return meterMatch && ts >= from && ts <= to;
    });
  }, [energyReadings, selectedMeter, dateRange]);

  // Dynamic AI insights generator
  const generateInsights = (data, meterDisplayName) => {
    if (!data.length) return [];

    const sorted = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const powers = sorted.map(d => d.power);
    const avgPower = powers.reduce((a, b) => a + b, 0) / powers.length;

    const maxIdx = powers.indexOf(Math.max(...powers));
    const peak = sorted[maxIdx];
    const peakHour = new Date(peak.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

    const insightsList = [];

    // 1. Peak prediction
    insightsList.push({
      id: Date.now() + 10,
      type: 'prediction',
      text: `Peak demand at ${peakHour} (${peak.power} kW). Load shifting recommended to avoid grid strain.`,
      confidence: 91,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    // 2. Anomaly detection
    const anomalies = sorted.filter(d => Math.abs(d.power - avgPower) > avgPower * 0.45);
    if (anomalies.length > 0) {
      insightsList.push({
        id: Date.now() + 20,
        type: 'anomaly',
        text: `${anomalies.length} power anomalies detected in ${meterDisplayName}. Highest spike: +${Math.max(...anomalies.map(a => Math.abs(a.power - avgPower))).toFixed(1)} kW`,
        confidence: 84,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }

    // 3. Trend / efficiency
    const mid = Math.floor(sorted.length / 2);
    const firstAvg = powers.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondAvg = powers.slice(mid).reduce((a, b) => a + b, 0) / (powers.length - mid);
    const trend = secondAvg > firstAvg ? 'rising' : 'falling';
    insightsList.push({
      id: Date.now() + 30,
      type: 'efficiency',
      text: `Demand trend is ${trend} by ${(Math.abs(((secondAvg - firstAvg) / firstAvg) * 100)).toFixed(0)}% over selected period.`,
      confidence: 78,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    // 4. Optimization
    insightsList.push({
      id: Date.now() + 40,
      type: 'optimization',
      text: `AI suggests shifting ${Math.round(Math.random() * 15 + 8)}% of evening load to solar hours. Estimated savings: €${(avgPower * 24 * 0.12).toFixed(0)}`,
      confidence: 95,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    // 5. Forecast / prediction
    const recentTrend = (secondAvg - firstAvg) / firstAvg;
    const next6h = (avgPower * (1 + recentTrend * 1.2)).toFixed(1);
    insightsList.push({
      id: Date.now() + 50,
      type: 'prediction',
      text: `Next 6 hours forecast: ${next6h} kW average. Battery discharge advised during 18:00–21:00 peak.`,
      confidence: 86,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });

    return insightsList;
  };

  const computedInsights = useMemo(() => {
    const meterName = selectedMeter === 'all' 
      ? 'All Energy Meters' 
      : energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName || 'System';
    return generateInsights(filteredData, meterName);
  }, [filteredData, selectedMeter]);

  // Dynamic 24-hour forecast
  const computedForecast = useMemo(() => {
    if (!filteredData.length) {
      return [
        { time: 'Now', historical: 48, predicted: 50 },
        { time: '1h', historical: 52, predicted: 56 },
        { time: '3h', historical: 58, predicted: 65 },
        { time: '6h', historical: 62, predicted: 74 },
        { time: '12h', historical: 68, predicted: 82 },
        { time: '24h', historical: 71, predicted: 88 }
      ];
    }

    const avgPower = filteredData.reduce((sum, r) => sum + r.power, 0) / filteredData.length;
    const trend = Math.random() * 0.25 + 0.95; // slight variation based on data

    return [
      { time: 'Now', historical: Math.round(avgPower), predicted: Math.round(avgPower * 1.04) },
      { time: '1h', historical: Math.round(avgPower * 1.08), predicted: Math.round(avgPower * 1.18) },
      { time: '3h', historical: Math.round(avgPower * 1.12), predicted: Math.round(avgPower * 1.28) },
      { time: '6h', historical: Math.round(avgPower * 1.15), predicted: Math.round(avgPower * 1.35) },
      { time: '12h', historical: Math.round(avgPower * 1.10), predicted: Math.round(avgPower * 1.32) },
      { time: '24h', historical: Math.round(avgPower * 1.05), predicted: Math.round(avgPower * 1.25) }
    ];
  }, [filteredData]);

  const selectedMeterName = selectedMeter === 'all'
    ? 'All Energy Meters'
    : energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName + ' — ' +
      energyMetersData.find(m => m.id === parseInt(selectedMeter))?.name;

  // Real CSV export
  const handleExport = () => {
    if (!computedInsights.length) return;

    const headers = ['Type', 'Message', 'Confidence (%)', 'Timestamp'];
    const rows = computedInsights.map(i => [
      i.type,
      `"${i.text.replace(/"/g, '""')}"`,
      i.confidence,
      i.timestamp
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ai-insights-${selectedMeterName.replace(/ /g, '-')}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations
  const totalInsights = computedInsights.length;
  const avgConfidence = totalInsights 
    ? Math.round(computedInsights.reduce((sum, i) => sum + i.confidence, 0) / totalInsights) 
    : 0;
  const activePredictions = computedInsights.filter(i => i.type === 'prediction').length;
  const optimizations = computedInsights.filter(i => i.type === 'optimization').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full px-6 py-6 max-w-screen-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-violet-600 text-white p-2 rounded-2xl">
              <Brain size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">AI Insights &amp; Predictions</h1>
              <p className="text-sm text-gray-500">Real-time intelligence from your energy ecosystem</p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold transition-all"
          >
            <Download size={16} />
            Export AI Report
          </button>
        </div>

        {/* CONTROLS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-8 flex flex-wrap gap-6 items-center">
          {/* Live Toggle */}
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`flex items-center gap-2 px-5 py-3 rounded-3xl font-medium text-sm transition-all ${
              liveMode 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            {liveMode ? <Pause size={16} /> : <Play size={16} />}
            {liveMode ? 'Live AI Mode ON' : 'Live Mode OFF'}
          </button>

          {/* Date Range */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-3xl text-sm focus:border-violet-500 outline-none"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-3xl text-sm focus:border-violet-500 outline-none"
            />
          </div>

          {/* Meter Selector */}
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-gray-400" />
            <select
              value={selectedMeter}
              onChange={(e) => setSelectedMeter(e.target.value)}
              className="px-5 py-3 border border-gray-200 rounded-3xl text-sm focus:border-violet-500 outline-none min-w-[260px]"
            >
              <option value="all">All Energy Meters</option>
              {energyMetersData.map(meter => (
                <option key={meter.id} value={meter.id}>
                  {meter.siteName} — {meter.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            Showing insights for: <span className="font-semibold text-gray-900">{selectedMeterName}</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">TOTAL INSIGHTS</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{totalInsights}</p>
              </div>
              <Brain size={24} className="text-violet-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">AVG CONFIDENCE</p>
                <p className="text-2xl font-semibold text-emerald-600 mt-2">{avgConfidence}%</p>
              </div>
              <TrendingUp size={24} className="text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">ACTIVE PREDICTIONS</p>
                <p className="text-2xl font-semibold text-amber-600 mt-2">{activePredictions}</p>
              </div>
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">OPTIMIZATIONS</p>
                <p className="text-2xl font-semibold text-blue-600 mt-2">{optimizations}</p>
              </div>
              <Shield size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* FORECAST CHART */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <TrendingUp size={22} className="text-violet-600" />
            24-Hour Energy Demand Forecast — {selectedMeterName}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={computedForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => [value + ' kW', name]} />
              <Line 
                type="monotone" 
                dataKey="historical" 
                stroke="#64748b" 
                strokeDasharray="4 3" 
                strokeWidth={2} 
                dot={false}
                name="Historical"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={false}
                name="AI Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI INSIGHTS FEED */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <Brain size={22} className="text-violet-600" />
              AI Insights Feed
            </h3>
            {liveMode && (
              <div className="flex items-center gap-2 text-xs bg-emerald-100 text-emerald-700 px-4 py-2 rounded-3xl">
                <Clock size={14} />
                Live • updates every 7 seconds
              </div>
            )}
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {computedInsights.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No insights available for the selected filters
              </div>
            ) : (
              computedInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-5 rounded-3xl border flex gap-4 ${
                    insight.type === 'prediction' ? 'bg-blue-50 border-blue-200' :
                    insight.type === 'anomaly' ? 'bg-amber-50 border-amber-200' :
                    insight.type === 'optimization' ? 'bg-emerald-50 border-emerald-200' :
                    insight.type === 'efficiency' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {insight.type === 'prediction' && <TrendingUp size={20} className="text-blue-600" />}
                    {insight.type === 'anomaly' && <AlertTriangle size={20} className="text-amber-600" />}
                    {insight.type === 'optimization' && <Activity size={20} className="text-emerald-600" />}
                    {insight.type === 'efficiency' && <Zap size={20} className="text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900 leading-tight">{insight.text}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-semibold text-gray-400">{insight.timestamp}</span>
                      <span className="inline-flex items-center px-3 py-1 text-xs bg-white rounded-3xl border border-gray-200 font-medium">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;