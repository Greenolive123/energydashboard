"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Search, 
  Calendar, 
  CheckCircle,
  Plus, 
  Trash2, 
  BarChart3 
} from 'lucide-react';

const energyMetersData = [
  { id: 1, siteName: "Home 1", name: "Chennai", type: "Energy" },
  { id: 2, siteName: "Home 2", name: "Coimbature", type: "Energy" },
  { id: 3, siteName: "Home 3", name: "Kerala", type: "Energy" },
  { id: 4, siteName: "Home 4", name: "bangalore", type: "Energy" },
  { id: 5, siteName: "Home 5", name: "Visak", type: "Energy" },
  { id: 6, siteName: "Home 6", name: "pune", type: "Energy" }
];


const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedMeter, setSelectedMeter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-31' });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [currentReport, setCurrentReport] = useState(null); // preview after generation
  const [energyReadings, setEnergyReadings] = useState([]);

  // Generate realistic master dataset (once)
  const generateMockEnergyData = () => {
    const readings = [];
    let idCounter = 1;
    const startDate = new Date('2025-01-01');

    for (let dayOffset = 0; dayOffset < 330; dayOffset += 2) { // ~165 days
      for (let meterId = 1; meterId <= 6; meterId++) {
        for (let slot = 0; slot < 4; slot++) { // 4 readings per day
          const timestamp = new Date(startDate);
          timestamp.setDate(timestamp.getDate() + dayOffset);
          timestamp.setHours(6 + slot * 5 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));

          const voltage = 225 + Math.random() * 18;
          const current = 3 + Math.random() * 28;
          const power = parseFloat((voltage * current / 1000).toFixed(2));
          const energy = parseFloat((power * 0.25).toFixed(2)); // 15-min interval

          readings.push({
            id: idCounter++,
            meterId,
            timestamp: timestamp.toISOString(),
            voltage: parseFloat(voltage.toFixed(1)),
            current: parseFloat(current.toFixed(1)),
            power,
            energy
          });
        }
      }
    }
    return readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Load everything from localStorage on mount
  useEffect(() => {
    // Energy readings (master dataset)
    let savedReadings = localStorage.getItem('energyReadings');
    if (savedReadings) {
      setEnergyReadings(JSON.parse(savedReadings));
    } else {
      const generated = generateMockEnergyData();
      setEnergyReadings(generated);
      localStorage.setItem('energyReadings', JSON.stringify(generated));
    }

    // Saved reports
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      const parsed = JSON.parse(savedReports);
      setReports(parsed);
      setFilteredReports(parsed);
    }
  }, []);

  // Filter saved reports list
  useEffect(() => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'All') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    if (selectedMeter !== 'all') {
      const meterName = energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName;
      filtered = filtered.filter(r => r.meter === meterName);
    }

    // Date filter on report generation date
    filtered = filtered.filter(r => {
      const reportDate = new Date(r.generatedDate);
      return reportDate >= new Date(dateRange.from) && reportDate <= new Date(dateRange.to);
    });

    setFilteredReports(filtered);
  }, [reports, searchTerm, filterType, selectedMeter, dateRange]);

  // Download CSV helper
  const downloadCSV = (reportData, title) => {
    if (!reportData || reportData.length === 0) return;

    const headers = ['Timestamp', 'Meter Name', 'Voltage (V)', 'Current (A)', 'Power (kW)', 'Energy (kWh)'];
    const csvRows = [
      headers.join(','),
      ...reportData.map(row =>
        [
          row.timestamp,
          `"${row.meterName}"`,
          row.voltage,
          row.current,
          row.power,
          row.energy
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate real report
  const handleGenerateReport = () => {
    if (!energyReadings.length) return;

    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    // Filter master dataset
    const filteredReadings = energyReadings.filter(reading => {
      const ts = new Date(reading.timestamp);
      const meterMatch = selectedMeter === 'all' || reading.meterId === parseInt(selectedMeter);
      return meterMatch && ts >= fromDate && ts <= toDate;
    });

    // Map to clean report rows
    const reportRows = filteredReadings.map(reading => {
      const meterInfo = energyMetersData.find(m => m.id === reading.meterId);
      return {
        timestamp: reading.timestamp,
        meterName: meterInfo ? `${meterInfo.siteName} — ${meterInfo.name}` : 'Unknown',
        voltage: reading.voltage,
        current: reading.current,
        power: reading.power,
        energy: reading.energy
      };
    });

    // Create report object
    const meterDisplay = selectedMeter === 'all'
      ? 'All Meters'
      : energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName || 'Unknown';

    const newReportObj = {
      id: Date.now(),
      title: newReportTitle || `Energy Report - ${meterDisplay}`,
      generatedDate: new Date().toISOString().split('T')[0],
      type: 'CSV',
      meter: meterDisplay,
      fromDate: dateRange.from,
      toDate: dateRange.to,
      reportData: reportRows
    };

    // Save to state + localStorage
    const updatedReports = [...reports, newReportObj];
    setReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Show preview
    setCurrentReport(newReportObj);

    // Reset modal
    setNewReportTitle('');
    setShowGenerateModal(false);
  };

  // Delete report
  const deleteReport = (id) => {
    if (window.confirm('Delete this report permanently?')) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem('reports', JSON.stringify(updated));
      if (currentReport && currentReport.id === id) setCurrentReport(null);
    }
  };

  // KPI counts
  const totalReports = reports.length;
  const csvCount = reports.filter(r => r.type === 'CSV').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full px-6 py-6 max-w-screen-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-2xl">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reports</h1>
              <p className="text-sm text-gray-500">Filtered energy data exports</p>
            </div>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold transition-all"
          >
            <Plus size={18} />
            Generate Report
          </button>
        </div>

        {/* KPI CARDS - compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest font-medium text-gray-500">TOTAL REPORTS</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{totalReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <Download className="text-emerald-600" size={20} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest font-medium text-gray-500">CSV EXPORTS</p>
                <p className="text-3xl font-semibold text-emerald-600 mt-1">{csvCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-teal-600" size={20} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest font-medium text-gray-500">GENERATED</p>
                <p className="text-3xl font-semibold text-teal-600 mt-1">{totalReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-8 flex flex-wrap items-center gap-6">
          {/* Date Range */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none"
            />
          </div>

          {/* Meter */}
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-gray-400" />
            <select
              value={selectedMeter}
              onChange={(e) => setSelectedMeter(e.target.value)}
              className="px-5 py-3 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none min-w-[260px]"
            >
              <option value="all">All Energy Meters</option>
              {energyMetersData.map(meter => (
                <option key={meter.id} value={meter.id}>
                  {meter.siteName} — {meter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 py-3 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-5 py-3 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none min-w-[160px]"
          >
            <option value="All">All Types</option>
            <option value="CSV">CSV</option>
          </select>
        </div>

        {/* CURRENT GENERATED REPORT PREVIEW */}
        {currentReport && (
          <div className="mb-10 bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
                <p className="text-sm text-gray-500">
                  {currentReport.fromDate} — {currentReport.toDate} • {currentReport.meter}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadCSV(currentReport.reportData, currentReport.title)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl text-sm font-semibold"
                >
                  <Download size={16} /> Download CSV
                </button>
                <button
                  onClick={() => setCurrentReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-medium text-gray-500">TIMESTAMP</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">METER</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">VOLTAGE (V)</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">CURRENT (A)</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">POWER (kW)</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">ENERGY (kWh)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentReport.reportData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{new Date(row.timestamp).toLocaleString('en-GB')}</td>
                      <td className="px-6 py-4 text-gray-900">{row.meterName}</td>
                      <td className="px-6 py-4 text-right font-medium">{row.voltage}</td>
                      <td className="px-6 py-4 text-right font-medium">{row.current}</td>
                      <td className="px-6 py-4 text-right font-medium">{row.power}</td>
                      <td className="px-6 py-4 text-right font-medium">{row.energy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SAVED REPORTS LIST */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          {filteredReports.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
              <p className="text-gray-500 mt-1">Generate a new report above</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <div
                key={report.id}
                className="px-6 py-5 border-b last:border-none flex items-center gap-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <FileText size={24} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">{report.title}</h4>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-3xl">
                      {report.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {report.generatedDate} • {report.meter} • {report.fromDate} — {report.toDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadCSV(report.reportData, report.title)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 rounded-3xl"
                  >
                    <Download size={16} /> CSV
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-3 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GENERATE MODAL */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="px-6 pt-6">
              <h2 className="text-xl font-semibold">Generate New Report</h2>
            </div>

            <div className="px-6 pt-2 pb-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Energy Consumption"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none"
                />
              </div>

              {/* Selected filters summary */}
              <div className="bg-gray-50 rounded-3xl p-5 text-sm">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-500">Meter</span>
                  <span className="font-medium">
                    {selectedMeter === 'all' ? 'All Energy Meters' : energyMetersData.find(m => m.id === parseInt(selectedMeter))?.siteName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date Range</span>
                  <span className="font-medium">{dateRange.from} — {dateRange.to}</span>
                </div>
              </div>

              {/* File type */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Export Format</label>
                <select
                  className="w-full px-5 py-4 border border-gray-200 rounded-3xl text-sm focus:border-blue-500 outline-none"
                  defaultValue="CSV"
                >
                  <option value="CSV">CSV (Raw Data)</option>
                </select>
              </div>
            </div>

            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 py-6 text-sm font-semibold border-r hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="flex-1 py-6 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Generate &amp; Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;