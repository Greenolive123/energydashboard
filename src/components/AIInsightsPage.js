// AIInsightsPage.js - Enhanced Modern AI Insights Component for Super Admin
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, TrendingUp, Activity, Shield, Clock, Play, Pause } from 'lucide-react';

const AIInsightsPage = () => {
  const [insights, setInsights] = useState([
    { 
      id: 1, 
      type: 'prediction', 
      text: 'Predicted 15% demand spike at 6 PM today - Recommend initiating battery discharge to save $45 in peak tariffs', 
      confidence: 92, 
      timestamp: '2025-12-17 14:30', 
      actions: ['Initiate Discharge', 'Schedule Alert'] 
    },
    { 
      id: 2, 
      type: 'anomaly', 
      text: 'Anomaly detected in Y Phase: 8% efficiency drop likely due to incoming weather front - Auto-adjust loads for stability', 
      confidence: 87, 
      timestamp: '2025-12-17 13:45', 
      actions: ['Auto-Adjust Loads', 'Notify Team'] 
    },
    { 
      id: 3, 
      type: 'optimization', 
      text: 'Optimize HVAC in Factory 2: Predictive cooling algorithm suggests 12% energy reduction by pre-cooling zones', 
      confidence: 95, 
      timestamp: '2025-12-17 12:20', 
      actions: ['Apply Optimization', 'Simulate Impact'] 
    },
    { 
      id: 4, 
      type: 'maintenance', 
      text: 'Predictive maintenance alert: Inverter C shows 22% wear - Schedule inspection within 48 hours to prevent downtime', 
      confidence: 89, 
      timestamp: '2025-12-17 11:15', 
      actions: ['Schedule Inspection', 'Order Parts'] 
    },
    { 
      id: 5, 
      type: 'efficiency', 
      text: 'Solar Array 1 efficiency trending +3% above baseline - Continue current cleaning schedule for sustained gains', 
      confidence: 91, 
      timestamp: '2025-12-17 10:00', 
      actions: ['Monitor Trend', 'Expand to Array 2'] 
    }
  ]);
  const [liveMode, setLiveMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate AI generating new insights
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setIsLoading(true);
      setTimeout(() => {
        const newInsight = {
          id: Date.now(),
          type: ['prediction', 'anomaly', 'optimization', 'maintenance', 'efficiency'][Math.floor(Math.random() * 5)],
          text: generateRandomInsight(),
          confidence: Math.floor(Math.random() * 15) + 85,
          timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          }),
          actions: ['Action 1', 'Action 2']
        };
        setInsights(prev => [newInsight, ...prev.slice(0, 9)]); // Keep top 10
        setIsLoading(false);
      }, 1500);
    }, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, [liveMode]);

  const generateRandomInsight = () => {
    const templates = [
      'Predicted {percent}% demand spike in {time} - Recommend {action} to save ${savings}',
      'Anomaly in {component}: {percent}% {metric} drop - {recommendation}',
      'Optimize {system}: {percent}% energy reduction via {method}',
      'Predictive maintenance for {device}: {percent}% wear detected - {action}',
      '{asset} efficiency trending {trend} - {recommendation}'
    ];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace('{percent}', (Math.random() * 20 + 5).toFixed(1))
      .replace('{time}', ['6 PM', 'noon', 'evening peak'][Math.floor(Math.random() * 3)])
      .replace('{action}', ['battery discharge', 'load shifting'][Math.floor(Math.random() * 2)])
      .replace('{savings}', (Math.random() * 100 + 20).toFixed(0))
      .replace('{component}', ['Y Phase', 'R Phase', 'Grid Inverter'][Math.floor(Math.random() * 3)])
      .replace('{metric}', ['efficiency', 'voltage stability'][Math.floor(Math.random() * 2)])
      .replace('{recommendation}', ['Auto-adjust loads', 'Reroute power'][Math.floor(Math.random() * 2)])
      .replace('{system}', ['HVAC in Factory 2', 'Lighting in Warehouse'][Math.floor(Math.random() * 2)])
      .replace('{method}', ['predictive cooling', 'smart scheduling'][Math.floor(Math.random() * 2)])
      .replace('{device}', ['Inverter C', 'Wind Turbine A'][Math.floor(Math.random() * 2)])
      .replace('{asset}', ['Solar Array 1', 'Battery Bank B'][Math.floor(Math.random() * 2)])
      .replace('{trend}', ['+3%', '-2%', '+5%'][Math.floor(Math.random() * 3)])
      .replace('{recommendation}', ['Continue schedule', 'Investigate further'][Math.floor(Math.random() * 2)]);
  };

  // Forecast data
  const forecastData = [
    { time: 'Now', historical: 50, predicted: 52 },
    { time: '1h', historical: 55, predicted: 58 },
    { time: '3h', historical: 60, predicted: 70 },
    { time: '6h', historical: 65, predicted: 80 },
    { time: '12h', historical: 70, predicted: 85 },
    { time: '24h', historical: 75, predicted: 90 }
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'prediction': return 'from-blue-500 to-indigo-600';
      case 'anomaly': return 'from-orange-500 to-red-600';
      case 'optimization': return 'from-green-500 to-teal-600';
      case 'maintenance': return 'from-yellow-500 to-amber-600';
      case 'efficiency': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'prediction': return <TrendingUp size={20} />;
      case 'anomaly': return <AlertTriangle size={20} />;
      case 'optimization': return <Activity size={20} />;
      case 'maintenance': return <Shield size={20} />;
      case 'efficiency': return <Zap size={20} />;
      default: return <Brain size={20} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-bold mb-2 text-gray-900 flex items-center gap-3"
      >
        <Brain size={40} className="text-blue-600" />
        AI-Powered Insights & Predictions
      </motion.h1>
      <p className="text-lg text-gray-600 mb-8">Real-time intelligence from your energy ecosystem – December 17, 2025</p>

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Live AI Mode</h3>
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              liveMode ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {liveMode ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {liveMode 
            ? `Generating insights every 15s – Next update in ${Math.floor(15 - (Date.now() % 15000) / 1000)}s` 
            : 'Paused – Resume for real-time updates'
          }
        </p>
        {isLoading && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="flex items-center gap-2 mt-2 text-blue-600"
          >
            <Clock size={16} className="animate-spin" />
            <span className="text-sm">Analyzing data...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Forecast Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            24h Energy Demand Forecast
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="#9ca3af" strokeDasharray="5 5" name="Historical" dot={false} />
              <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} name="Predicted" dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-4">Based on current load patterns and weather data – Confidence: 94%</p>
        </motion.div>

        {/* Quick Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Wins</h3>
          <div className="space-y-3">
            {insights.slice(-3).reverse().map(insight => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type).replace('from-', 'bg-').replace('to-', ' via ')} text-white flex-shrink-0`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{insight.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {insight.timestamp}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {insight.confidence}% Confidence
                        </span>
                        <div className="flex gap-1">
                          {insight.actions.slice(0, 2).map((action, idx) => (
                            <button key={idx} className="text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-50 transition-colors">
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Full Insights Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Insights Feed</h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {insights.map(insight => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type)} text-white flex-shrink-0`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{insight.type.toUpperCase()} INSIGHT</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.confidence > 90 ? 'bg-green-100 text-green-800' : 
                        insight.confidence > 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {insight.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{insight.text}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {insight.timestamp}
                      </span>
                      <div className="flex gap-1">
                        {insight.actions.map((action, idx) => (
                          <button key={idx} className="bg-white text-gray-700 px-3 py-1 rounded-md border hover:bg-gray-100 transition-colors text-xs">
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          {liveMode && `Live – ${insights.length} insights generated today`}
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="mt-8 text-center text-sm text-gray-500"
      >
        Powered by xAI – Insights updated in real-time based on system telemetry
      </motion.div>
    </div>
  );
};

export default AIInsightsPage;