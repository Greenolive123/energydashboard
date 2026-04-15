
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Activity, Thermometer, Battery, AlertTriangle, 
  CheckCircle, RefreshCw, Download, Lightbulb, 
  TrendingUp 
} from 'lucide-react';

export default function EnergyMonitorDashboard({ onBack }) {


  // ==================== STATE ====================
  const [data, setData] = useState({
    summary: {
      totalActivePower: 85.7,
      totalPowerFactor: 0.92,
      averageVoltage: 230.5,
      averageCurrent: 124.3,
    },
    phases: {
      R: { voltage: 232.1, current: 125.7, powerConsumption: 29.2, powerFactor: 0.94, apparentPower: 31.1, reactivePower: 10.5, status: "Good" },
      Y: { voltage: 228.7, current: 138.2, powerConsumption: 31.6, powerFactor: 0.79, apparentPower: 40.0, reactivePower: 24.3, status: "Low" },
      B: { voltage: 230.8, current: 109.1, powerConsumption: 24.9, powerFactor: 0.88, apparentPower: 28.3, reactivePower: 13.4, status: "Fair" }
    },
    alerts: [
      { title: "Unbalanced Load Detected in Y Phase", description: "Current consumption 26% above average. Investigate potential unauthorized connection." },
      { title: "kWh-kVAh Mismatch", description: "Variance of 8.2% detected between active and apparent energy consumption." }
    ],
    tips: [
      { title: "Install Capacitors for Y Phase", description: "Power factor (0.79) is below optimal level. Installing power factor correction capacitors can improve efficiency." },
      { title: "Load Balancing Recommended", description: "Redistribute loads more evenly across all three phases to improve system efficiency." },
      { title: "Schedule Heavy Loads for Off-Peak Hours", description: "Running high-power equipment during off-peak hours can reduce energy costs by 15-20%." }
    ]
  });

  // ==================== CHART DATA ====================
  const timeLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  const kwhData = [42, 45, 40, 38, 55, 65, 75, 85, 78, 88, 70, 58];
  const kvahData = [48, 50, 45, 42, 60, 72, 82, 93, 85, 95, 78, 65];
  const kvarhData = [20, 22, 18, 15, 25, 30, 35, 42, 38, 40, 32, 28];

  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 120 } }
  };

  // ==================== CHART OPTIONS ====================
  const lineChartOptions = {
    chart: { height: 320, type: 'line', toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 1000 } },
    stroke: { width: 4, curve: 'smooth' },
    xaxis: { categories: timeLabels, labels: { style: { colors: '#64748b', fontSize: '13px' } } },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    tooltip: { y: { formatter: val => `${val} units` } },
    legend: { position: 'top', horizontalAlign: 'left' },
    grid: { borderColor: '#f1f5f9' },
    colors: ['#10b981', '#f59e0b', '#3b82f6']
  };

  const lineChartSeries = [
    { name: 'Active Energy (kWh)', data: kwhData },
    { name: 'Apparent Energy (kVAh)', data: kvahData },
    { name: 'Reactive Energy (kVARh)', data: kvarhData }
  ];

  const barChartOptions = {
    chart: { height: 320, type: 'bar', toolbar: { show: false }, animations: { enabled: true } },
    plotOptions: { bar: { distributed: true, borderRadius: 12, dataLabels: { position: 'top' } } },
    colors: ['#10b981', '#f59e0b', '#3b82f6'],
    dataLabels: { enabled: true, formatter: val => `${val} kW`, offsetY: -20, style: { fontSize: '14px', colors: ['#0f172a'] } },
    xaxis: { categories: ['R Phase', 'Y Phase', 'B Phase'], labels: { style: { colors: '#64748b', fontSize: '14px' } } },
    yaxis: { labels: { formatter: val => `${val} kW`, style: { colors: '#64748b' } } }
  };

  const barChartSeries = [{ name: 'Power Consumption (kW)', data: [data.phases.R.powerConsumption, data.phases.Y.powerConsumption, data.phases.B.powerConsumption] }];

  // ==================== HELPERS ====================
  const getBadgeColor = (status) => {
    switch (status) {
      case "Good": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Fair": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Low": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const refreshData = () => {
    setData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        totalActivePower: (parseFloat(prev.summary.totalActivePower) + (Math.random() * 3 - 1.5)).toFixed(1)
      }
    }));
  };

  // ==================== RETURN ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-12">
      
      {/* CONTENT - FULL WIDTH (no 1920px cap) */}
      <div className="max-w-full mx-auto px-8 py-8">

        {/* HEADER (exactly as you originally had it + Back button) */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl">⚡</div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Energy Monitor Dashboard</h1>
              <p className="text-emerald-600 font-medium">Real-time 3-Phase Power Monitoring • Live</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 hover:border-emerald-300 rounded-3xl text-sm font-semibold shadow-sm transition-all"
            >
              <RefreshCw size={20} className="text-emerald-600" />
              Refresh Data
            </button>
            <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-3xl text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700">
              <Download size={20} />
              Export Report
            </button>
       <button onClick={onBack} className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-3xl text-sm font-semibold">
  ← Back to List
</button>
          </div>
        </div>

        {/* SUMMARY KPI CARDS */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <Zap className="text-red-500" size={28} />, label: "Total Active Power", value: `${data.summary.totalActivePower} kW`, trend: "+3.2%" },
            { icon: <Activity className="text-blue-500" size={28} />, label: "Power Factor", value: data.summary.totalPowerFactor, trend: "+0.05" },
            { icon: <Thermometer className="text-amber-500" size={28} />, label: "Average Voltage", value: `${data.summary.averageVoltage} V`, trend: "-1.2%" },
            { icon: <Battery className="text-emerald-500" size={28} />, label: "Average Current", value: `${data.summary.averageCurrent} A`, trend: "+2.8%" }
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 hover:shadow-2xl transition-all"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-2xl">{card.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                  <TrendingUp size={18} /> {card.trend}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* PHASE MONITORING */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(data.phases).map(([phase, info]) => (
            <motion.div
              key={phase}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 hover:shadow-2xl transition-all"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-2xl font-bold mb-6 ${phase === 'R' ? 'text-red-600' : phase === 'Y' ? 'text-amber-600' : 'text-blue-600'}`}>
                {phase} Phase
              </div>
              <div className="space-y-6">
                {[
                  { label: "Voltage", value: `${info.voltage} V` },
                  { label: "Current", value: `${info.current} A` },
                  { label: "Power Consumption", value: `${info.powerConsumption} kW` },
                  { label: "Power Factor", value: info.powerFactor },
                  { label: "Apparent Power", value: `${info.apparentPower} kVA` },
                  { label: "Reactive Power", value: `${info.reactivePower} kVAR` }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-8 inline-flex items-center gap-2 px-5 py-2 rounded-3xl border text-sm font-semibold ${getBadgeColor(info.status)}`}>
                {info.status === "Good" && <CheckCircle size={18} />}
                {info.status === "Low" && <AlertTriangle size={18} />}
                {info.status}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ALERTS + TIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="bg-white rounded-3xl border border-red-200 shadow-xl p-8" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-600" size={28} />
              <h3 className="text-2xl font-semibold">Theft Detection</h3>
            </div>
            <AnimatePresence>
              {data.alerts.map((alert, i) => (
                <motion.div key={i} className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold text-red-700">{alert.title}</p>
                  <p className="text-red-600 text-sm mt-1">{alert.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="text-emerald-600" size={28} />
              <h3 className="text-2xl font-semibold">Energy Saving Tips</h3>
            </div>
            <AnimatePresence>
              {data.tips.map((tip, i) => (
                <motion.div key={i} className="mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold text-emerald-700">{tip.title}</p>
                  <p className="text-emerald-600 text-sm mt-1">{tip.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <motion.div className="bg-white rounded-3xl border shadow-xl p-8" whileHover={{ scale: 1.01 }}>
            <h3 className="text-xl font-semibold mb-6">Energy Consumption Over Time</h3>
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={340} />
          </motion.div>

          <motion.div className="bg-white rounded-3xl border shadow-xl p-8" whileHover={{ scale: 1.01 }}>
            <h3 className="text-xl font-semibold mb-6">Phase-wise Power Consumption</h3>
            <Chart options={barChartOptions} series={barChartSeries} type="bar" height={340} />
          </motion.div>
        </div>
      </div>

      {/* FLOATING REFRESH BUTTON */}
      <motion.button
        onClick={refreshData}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition-all"
        whileHover={{ rotate: 180, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw size={28} />
      </motion.button>
    </div>
  );
}