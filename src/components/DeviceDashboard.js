"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  Zap,
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  Wifi,
  Battery,
  Gauge,
  ArrowLeft,
  Download,
  Plus,
  Edit,
  Trash2,
  IndianRupee,
  Sun,
  Leaf,
  Sprout,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// ─── Constants ───────────────────────────────────────────────────────────────
const ELECTRICITY_RATE = 0.28;   // ₹ per kWh
const CO2_PER_KWH      = 0.82;   // kg CO₂ per kWh (India average grid emission factor)
const KG_CO2_PER_TREE  = 21;     // kg CO₂ absorbed by one tree per year

// ─── Pure helpers ─────────────────────────────────────────────────────────────
const solarAtHour = (hour) => {
  if (hour < 6 || hour > 20) return 0;
  return parseFloat(
    (Math.max(0, 5 * Math.exp(-0.08 * Math.pow(hour - 13, 2))) * (0.7 + Math.random() * 0.3)).toFixed(2)
  );
};

const makeDayHistory = () =>
  Array.from({ length: 24 }, (_, i) => {
    const hour  = (8 + i) % 24;
    const solar = solarAtHour(hour);
    const grid  = parseFloat((2.5 + Math.sin(i / 4) * 1.1 + Math.random() * 0.4).toFixed(2));
    const bat   = parseFloat((solar > 2 ? -(solar - 1.5) : Math.random() > 0.5 ? 0.8 : 0).toFixed(2));
    const total = parseFloat((solar + bat + grid).toFixed(2));
    return {
      timestamp:    `${String(hour).padStart(2, '0')}:00`,
      solarPower:   solar,
      batteryPower: bat,
      gridPower:    grid,
      power:        total,
      voltage:      228 + Math.random() * 8,
      energyKwh:    14 + i * 0.8,
    };
  });

const seedSolarEnergy = (solarPower) =>
  parseFloat((solarPower * (6 + Math.random() * 4)).toFixed(2));

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockHouses = [
  {
    id: "H001", 
name: "Chennai Smart Home",
location: "Chennai, Tamil Nadu, IN",
     hw_id: "HW-ENERGY-001234",
    user_id: "user-123", status: "online", last_seen: "Just now",
    current: {
      voltage: 231.4, current: 14.8,
      gridPower: 3.42, apparentPower: 3.51, powerFactor: 0.97,
      frequency: 50.02, energyTodayKwh: 24.8, peakDemandKw: 5.9,
      solarPower: 2.8, batteryPower: -0.6,
      solarEnergyTodayKwh: seedSolarEnergy(2.8),
    },
    history: makeDayHistory(),
    dailyUsage: [
      { day: "Mon", kwh: 18.4 }, { day: "Tue", kwh: 22.1 },
      { day: "Wed", kwh: 19.7 }, { day: "Thu", kwh: 25.3 },
      { day: "Fri", kwh: 21.9 }, { day: "Sat", kwh: 28.6 },
      { day: "Sun", kwh: 17.2 },
    ],
    monthlyTrend: [
      { month: "Jan", kwh: 480 }, { month: "Feb", kwh: 520 },
      { month: "Mar", kwh: 450 }, { month: "Apr", kwh: 610 },
      { month: "May", kwh: 580 }, { month: "Jun", kwh: 550 },
    ],
    alerts: [
      { id: 1, type: "voltage", message: "Voltage spike above 240V detected (L1 phase)", timestamp: "11 min ago", severity: "warning" },
    ],
  },
  {
    id: "H002", name: "Vellore Smart Home",
location: "Vellore, Tamil Nadu, IN", hw_id: "HW-ENERGY-005678",
    user_id: "user-456", status: "online", last_seen: "2 min ago",
    current: {
      voltage: 229.8, current: 9.2,
      gridPower: 1.2, apparentPower: 2.28, powerFactor: 0.93,
      frequency: 49.98, energyTodayKwh: 15.3, peakDemandKw: 4.2,
      solarPower: 3.1, batteryPower: -1.2,
      solarEnergyTodayKwh: seedSolarEnergy(3.1),
    },
    history: makeDayHistory(),
    dailyUsage: [
      { day: "Mon", kwh: 14.2 }, { day: "Tue", kwh: 16.8 },
      { day: "Wed", kwh: 13.9 }, { day: "Thu", kwh: 18.1 },
      { day: "Fri", kwh: 15.7 }, { day: "Sat", kwh: 20.4 },
      { day: "Sun", kwh: 12.8 },
    ],
    monthlyTrend: [
      { month: "Jan", kwh: 310 }, { month: "Feb", kwh: 340 },
      { month: "Mar", kwh: 290 }, { month: "Apr", kwh: 380 },
      { month: "May", kwh: 360 }, { month: "Jun", kwh: 330 },
    ],
    alerts: [],
  },
  {
    id: "H003", name: "TV Smart Home",
location: "TVM, Tamil Nadu, IN", hw_id: "HW-ENERGY-009012",
    user_id: "user-789", status: "offline", last_seen: "47 min ago",
    current: {
      voltage: 0, current: 0, gridPower: 0, apparentPower: 0,
      powerFactor: 0, frequency: 0, energyTodayKwh: 8.7,
      peakDemandKw: 3.1, solarPower: 0, batteryPower: 0,
      solarEnergyTodayKwh: 0,
    },
    history: makeDayHistory(),
    dailyUsage: [
      { day: "Mon", kwh: 9.1 }, { day: "Tue", kwh: 7.8 },
      { day: "Wed", kwh: 10.3 }, { day: "Thu", kwh: 8.5 },
      { day: "Fri", kwh: 11.2 }, { day: "Sat", kwh: 6.9 },
      { day: "Sun", kwh: 8.4 },
    ],
    monthlyTrend: [
      { month: "Jan", kwh: 220 }, { month: "Feb", kwh: 210 },
      { month: "Mar", kwh: 240 }, { month: "Apr", kwh: 230 },
      { month: "May", kwh: 260 }, { month: "Jun", kwh: 200 },
    ],
    alerts: [
      { id: 2, type: "offline", message: "Device offline for 47 minutes", timestamp: "47 min ago", severity: "critical" },
    ],
  },
  {
    id: "H004",  name: "Salem Smart Home",
location: "Salem, Tamil Nadu, IN", hw_id: "HW-ENERGY-003456",
    user_id: "user-123", status: "online", last_seen: "Just now",
    current: {
      voltage: 232.7, current: 18.3, gridPower: 2.1,
      apparentPower: 4.38, powerFactor: 0.97,
      frequency: 50.05, energyTodayKwh: 31.2, peakDemandKw: 6.8,
      solarPower: 4.5, batteryPower: -2.3,
      solarEnergyTodayKwh: seedSolarEnergy(4.5),
    },
    history: makeDayHistory(),
    dailyUsage: [
      { day: "Mon", kwh: 29.8 }, { day: "Tue", kwh: 32.4 },
      { day: "Wed", kwh: 27.9 }, { day: "Thu", kwh: 35.1 },
      { day: "Fri", kwh: 30.6 }, { day: "Sat", kwh: 41.2 },
      { day: "Sun", kwh: 25.3 },
    ],
    monthlyTrend: [
      { month: "Jan", kwh: 720 }, { month: "Feb", kwh: 690 },
      { month: "Mar", kwh: 750 }, { month: "Apr", kwh: 810 },
      { month: "May", kwh: 780 }, { month: "Jun", kwh: 830 },
    ],
    alerts: [],
  },
  {
    id: "H005", name: "Bangalore Smart Home",
location: "Bangalore, Bangalore, IN", hw_id: "HW-ENERGY-007890",
    user_id: "user-456", status: "online", last_seen: "9 min ago",
    current: {
      voltage: 230.9, current: 11.6, gridPower: 0.5,
      apparentPower: 2.79, powerFactor: 0.96,
      frequency: 49.97, energyTodayKwh: 19.6, peakDemandKw: 4.9,
      solarPower: 3.8, batteryPower: 0.9,
      solarEnergyTodayKwh: seedSolarEnergy(3.8),
    },
    history: makeDayHistory(),
    dailyUsage: [
      { day: "Mon", kwh: 17.5 }, { day: "Tue", kwh: 21.3 },
      { day: "Wed", kwh: 18.9 }, { day: "Thu", kwh: 23.4 },
      { day: "Fri", kwh: 20.1 }, { day: "Sat", kwh: 26.7 },
      { day: "Sun", kwh: 16.8 },
    ],
    monthlyTrend: [
      { month: "Jan", kwh: 410 }, { month: "Feb", kwh: 430 },
      { month: "Mar", kwh: 390 }, { month: "Apr", kwh: 460 },
      { month: "May", kwh: 480 }, { month: "Jun", kwh: 450 },
    ],
    alerts: [
      { id: 3, type: "current", message: "Current overload detected on L2 phase", timestamp: "31 min ago", severity: "warning" },
    ],
  },
];

// ─── Energy Flow Insight ──────────────────────────────────────────────────────
function EnergyFlowInsight({ solar, battery, grid, total }) {
  const insights = useMemo(() => {
    const items = [];
    if (solar > total)          items.push({ icon: "☀️", label: "Surplus solar charging battery", color: "text-yellow-600 bg-yellow-50 border-yellow-200" });
    if (battery > 0)            items.push({ icon: "🔋", label: "Battery supplying home",          color: "text-purple-600 bg-purple-50 border-purple-200" });
    if (battery < 0)            items.push({ icon: "⚡", label: "Solar charging battery",          color: "text-blue-600 bg-blue-50 border-blue-200"      });
    if (grid > 0)               items.push({ icon: "🔌", label: "Importing from grid",             color: "text-amber-600 bg-amber-50 border-amber-200"   });
    if (grid < 0)               items.push({ icon: "↗️", label: "Exporting to grid",               color: "text-emerald-600 bg-emerald-50 border-emerald-200" });
    if (solar > 0 && grid <= 0) items.push({ icon: "🌿", label: "Running fully on solar",         color: "text-green-600 bg-green-50 border-green-200"    });
    return items.length ? items : [{ icon: "🌙", label: "Low generation – grid standby", color: "text-gray-500 bg-gray-50 border-gray-200" }];
  }, [solar, battery, grid, total]);

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {insights.map((item, i) => (
        <span key={i} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${item.color}`}>
          <span>{item.icon}</span>{item.label}
        </span>
      ))}
    </div>
  );
}

// ─── Sustainability Impact Panel ──────────────────────────────────────────────
function SustainabilityPanel({ carbonSaved, moneySaved, treesEquivalent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Carbon Saved */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/25 dark:via-emerald-900/20 dark:to-teal-900/25 rounded-3xl p-6 border border-green-200 dark:border-green-800 shadow-sm">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-green-100 dark:bg-green-900/30 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full opacity-40 pointer-events-none" />
        <div className="relative flex items-start justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-green-600 dark:text-green-400 mb-1">🌱 Carbon Saved Today</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-green-700 dark:text-green-300">{carbonSaved}</span>
              <span className="text-base font-medium text-green-500 ml-1">kg CO₂</span>
            </div>
          </div>
          <div className="p-3 bg-green-200 dark:bg-green-800/60 rounded-2xl flex-shrink-0">
            <Leaf size={26} className="text-green-700 dark:text-green-300" />
          </div>
        </div>
        <div className="relative mt-4 pt-4 border-t border-green-200 dark:border-green-700/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                Equivalent to planting <span className="text-green-800 dark:text-green-200 font-bold">{treesEquivalent} trees</span>
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-0.5">Based on 21 kg CO₂ absorbed per tree/year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Money Saved */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 dark:from-emerald-900/25 dark:via-cyan-900/20 dark:to-sky-900/25 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-full opacity-40 pointer-events-none" />
        <div className="relative flex items-start justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-emerald-600 dark:text-emerald-400 mb-1">💰 Solar Savings Today</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">₹{moneySaved}</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-200 dark:bg-emerald-800/60 rounded-2xl flex-shrink-0">
            <IndianRupee size={26} className="text-emerald-700 dark:text-emerald-300" />
          </div>
        </div>
        <div className="relative mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Est. monthly savings:{" "}
                <span className="text-emerald-800 dark:text-emerald-200 font-bold">
                  ₹{(parseFloat(moneySaved) * 30).toFixed(0)}
                </span>
              </p>
              <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-0.5">
                At ₹{ELECTRICITY_RATE}/kWh avoided from grid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function EnergyMonitorDashboard() {
  const [houses, setHouses]                   = useState(mockHouses);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [role]                                = useState("SuperAdmin");
  const [, setLastUpdated]                    = useState(new Date());
  const [isDarkMode, setIsDarkMode]           = useState(false);

  const [showModal, setShowModal]         = useState(false);
  const [modalMode, setModalMode]         = useState('add');
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData]           = useState({ name: '', location: '', hw_id: '' });

  // ── MQTT simulation ───────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const nowHour = new Date().getHours();
      setHouses(prev => prev.map(house => {
        if (house.status === "offline") return house;
        if (Math.random() < 0.35) return house;

        const newVoltage  = Math.max(210, Math.min(245, house.current.voltage + (Math.random() * 8 - 4)));
        const newCurrent  = Math.max(0, house.current.current + (Math.random() * 3 - 1.5));
        const newGrid     = parseFloat(Math.max(-2, house.current.gridPower + (Math.random() * 0.2 - 0.1)).toFixed(2));
        const newSolar    = parseFloat(Math.max(0, solarAtHour(nowHour) + (Math.random() * 0.4 - 0.2)).toFixed(2));
        const solarExcess = newSolar - Math.max(0, newGrid);
        const newBattery  = parseFloat((solarExcess > 0.5 ? -(solarExcess * 0.7) : (Math.random() > 0.6 ? 0.6 + Math.random() * 0.4 : 0)).toFixed(2));
        const newApparent = Math.max(0, newGrid) / 0.95;
        const newEnergy   = parseFloat((house.current.energyTodayKwh + Math.random() * 0.18).toFixed(2));
        const totalPow    = parseFloat((newSolar + newBattery + newGrid).toFixed(2));

        // Each tick ≈ 5 minutes = 5/60 hours; accumulate solar kWh
        const newSolarEnergy = parseFloat(
          (house.current.solarEnergyTodayKwh + newSolar * (1 / 60)).toFixed(3)
        );

        const newEntry = {
          timestamp:    new Date().toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" }),
          solarPower:   newSolar,
          batteryPower: newBattery,
          gridPower:    newGrid,
          power:        totalPow,
          voltage:      parseFloat(newVoltage.toFixed(1)),
          energyKwh:    newEnergy,
        };

        let updatedAlerts = [...house.alerts];
        if (newVoltage > 240 && !updatedAlerts.some(a => a.type === "voltage")) {
          updatedAlerts.unshift({ id: Date.now(), type: "voltage", message: "High voltage detected (>240V)", timestamp: "Just now", severity: "warning" });
          if (updatedAlerts.length > 5) updatedAlerts.pop();
        }
        if (newCurrent > 20 && !updatedAlerts.some(a => a.type === "current")) {
          updatedAlerts.unshift({ id: Date.now() + 1, type: "current", message: "Overload detected on main phase", timestamp: "Just now", severity: "critical" });
          if (updatedAlerts.length > 5) updatedAlerts.pop();
        }

        return {
          ...house,
          current: {
            ...house.current,
            voltage:             parseFloat(newVoltage.toFixed(1)),
            current:             parseFloat(newCurrent.toFixed(1)),
            gridPower:           newGrid,
            apparentPower:       parseFloat(newApparent.toFixed(2)),
            energyTodayKwh:      newEnergy,
            solarPower:          newSolar,
            batteryPower:        newBattery,
            solarEnergyTodayKwh: newSolarEnergy,
          },
          history:   [...house.history, newEntry].slice(-24),
          last_seen: "Just now",
          alerts:    updatedAlerts,
        };
      }));
      setLastUpdated(new Date());
   }, 60000); // 1 minute
    return () => clearInterval(id);
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const visibleHouses = useMemo(
    () => role === "SuperAdmin" ? houses : houses.filter(h => h.user_id === "user-123"),
    [houses, role]
  );

  const selectedHouse = visibleHouses.find(h => h.id === selectedHouseId) || null;

  /**
   * All per-house sustainability + power metrics in one memo.
   * Single source of truth — no duplicated calculations.
   */
  const selectedMetrics = useMemo(() => {
    if (!selectedHouse) return null;
    const { solarPower, batteryPower, gridPower, solarEnergyTodayKwh } = selectedHouse.current;
    const totalPower      = parseFloat((solarPower + batteryPower + gridPower).toFixed(2));
    const carbonSaved     = parseFloat((solarEnergyTodayKwh * CO2_PER_KWH).toFixed(2));
    const moneySaved      = parseFloat((solarEnergyTodayKwh * ELECTRICITY_RATE).toFixed(2));
    const treesEquivalent = parseFloat((carbonSaved / KG_CO2_PER_TREE).toFixed(1));
    return { totalPower, carbonSaved, moneySaved, treesEquivalent };
  }, [selectedHouse]);

  /** Global aggregated stats including sustainability totals */
  const globalStats = useMemo(() => {
    const totalHouses             = visibleHouses.length;
    const totalConsumptionToday   = visibleHouses.reduce((s, h) => s + h.current.energyTodayKwh, 0);
    const activeDevices           = visibleHouses.filter(h => h.status === "online").length;
    const totalAlerts             = visibleHouses.reduce((s, h) => s + h.alerts.length, 0);
    const totalSolar              = visibleHouses.reduce((s, h) => s + h.current.solarPower, 0);
    const totalSolarEnergy        = visibleHouses.reduce((s, h) => s + h.current.solarEnergyTodayKwh, 0);
    const totalCostToday          = totalConsumptionToday * ELECTRICITY_RATE;
    const monthlyTotalConsumption = totalConsumptionToday * 30;
    const estimatedMonthlyBill    = monthlyTotalConsumption * ELECTRICITY_RATE;
    // Sustainability aggregates — computed once here, referenced everywhere
    const totalCarbonSaved        = totalSolarEnergy * CO2_PER_KWH;
    const totalSolarSavings       = totalSolarEnergy * ELECTRICITY_RATE;
    const totalTrees              = totalCarbonSaved / KG_CO2_PER_TREE;
    return {
      totalHouses, activeDevices, totalAlerts,
      totalSolar:              totalSolar.toFixed(1),
      totalConsumptionToday:   totalConsumptionToday.toFixed(1),
      totalCostToday:          totalCostToday.toFixed(2),
      monthlyTotalConsumption: monthlyTotalConsumption.toFixed(1),
      estimatedMonthlyBill:    estimatedMonthlyBill.toFixed(2),
      totalCarbonSaved:        totalCarbonSaved.toFixed(1),
      totalSolarSavings:       totalSolarSavings.toFixed(2),
      totalTrees:              totalTrees.toFixed(1),
    };
  }, [visibleHouses]);

  // ── UI helpers ────────────────────────────────────────────────────────────
  const getStatusBadge = (status) =>
    status === "online"
      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-3xl"><CheckCircle size={12} /> ONLINE</span>
      : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-3xl"><XCircle size={12} /> OFFLINE</span>;

  const getSeverityColor = (s) =>
    s === "critical" ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
    : s === "warning" ? "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30"
    : "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openModal = (house = null) => {
    if (house) {
      setModalMode('edit');
      setCurrentEditId(house.id);
      setFormData({ name: house.name, location: house.location, hw_id: house.hw_id });
    } else {
      setModalMode('add');
      setCurrentEditId(null);
      setFormData({
        name:     `New Smart Home ${visibleHouses.length + 1}`,
        location: "Dublin, Leinster, IE",
        hw_id:    `HW-ENERGY-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }
    setShowModal(true);
  };

  const handleSaveHouse = () => {
    if (!formData.name.trim() || !formData.location.trim() || !formData.hw_id.trim()) {
      alert("All fields are required");
      return;
    }
    if (modalMode === 'edit' && currentEditId) {
      setHouses(prev => prev.map(h => h.id === currentEditId ? { ...h, ...formData } : h));
    } else {
      const sp = parseFloat((Math.random() * 4).toFixed(2));
      const newHouse = {
        id: `H${String(Math.floor(100000 + Math.random() * 900000))}`,
        ...formData,
        user_id: "user-123", status: "online", last_seen: "Just now",
        current: {
          voltage: 230 + Math.random() * 8, current: 8 + Math.random() * 12,
          gridPower: 2.2 + Math.random() * 2.5, apparentPower: 2.5,
          powerFactor: 0.96, frequency: 50,
          energyTodayKwh: 12 + Math.random() * 18, peakDemandKw: 4.5 + Math.random() * 3,
          solarPower: sp,
          batteryPower: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
          solarEnergyTodayKwh: seedSolarEnergy(sp),
        },
        history: makeDayHistory(),
        dailyUsage:   ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({ day, kwh: parseFloat((10 + Math.random() * 20).toFixed(1)) })),
        monthlyTrend: ["Jan","Feb","Mar","Apr","May","Jun"].map(month => ({ month, kwh: Math.floor(300 + Math.random() * 400) })),
        alerts: [],
      };
      setHouses(prev => [...prev, newHouse]);
    }
    setShowModal(false);
    setCurrentEditId(null);
  };

  const handleDeleteHouse = (id) => {
    if (window.confirm("Delete this house?")) setHouses(prev => prev.filter(h => h.id !== id));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-950 text-white" : "bg-gray-50"} font-sans flex`}>
      <div className="flex-1 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
              {selectedHouse ? selectedHouse.name : "Smart Energy Overview"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Solar · Battery · Grid · Carbon · Real-time 
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(d => !d)}
              className="p-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 shadow-sm transition-all"
              title="Toggle dark mode"
            >
              <Sun size={18} />
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 rounded-3xl text-sm font-semibold shadow-sm transition-all">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* ══════════════════  OVERVIEW  ══════════════════════════════════ */}
        {!selectedHouse ? (
          <>
            {/* Row 1 – operational KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
              {[
                { label: "Total Houses",      value: globalStats.totalHouses,              unit: "",    icon: <Home size={22} />,        bg: "bg-emerald-100 dark:bg-emerald-900/30", cls: "text-emerald-600" },
                { label: "Active Devices",    value: globalStats.activeDevices,            unit: "",    icon: <Activity size={22} />,    bg: "bg-emerald-100 dark:bg-emerald-900/30", cls: "text-emerald-600" },
                { label: "Solar Generation",  value: globalStats.totalSolar,               unit: "kW",  icon: <Sun size={22} />,         bg: "bg-yellow-100 dark:bg-yellow-900/30",   cls: "text-yellow-500" },
                { label: "Today's Usage",     value: globalStats.totalConsumptionToday,    unit: "kWh", icon: <BarChart3 size={22} />,   bg: "bg-amber-100 dark:bg-amber-900/30",     cls: "text-amber-500"  },
                { label: "Today's Cost",      value: `₹${globalStats.totalCostToday}`,    unit: "",    icon: <IndianRupee size={22} />, bg: "bg-rose-100 dark:bg-rose-900/30",       cls: "text-rose-500"   },
                { label: "Monthly Usage",     value: globalStats.monthlyTotalConsumption,  unit: "kWh", icon: <TrendingUp size={22} />,  bg: "bg-teal-100 dark:bg-teal-900/30",       cls: "text-teal-500"   },
                { label: "Est. Monthly Bill", value: `₹${globalStats.estimatedMonthlyBill}`, unit: "",  icon: <IndianRupee size={22} />, bg: "bg-rose-100 dark:bg-rose-900/30",       cls: "text-rose-500"   },
              ].map(({ label, value, unit, icon, bg, cls }) => (
                <div key={label} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                        {value}{unit && <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>}
                      </p>
                    </div>
                    <div className={`p-2 ${bg} rounded-2xl`}><span className={cls}>{icon}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 – sustainability KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Total Carbon Saved */}
              <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-5 border border-green-200 dark:border-green-800 shadow-sm">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-100 dark:bg-green-800/30 rounded-full opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-green-600 dark:text-green-400">🌱 Total CO₂ Saved</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                      {globalStats.totalCarbonSaved}
                      <span className="text-sm font-medium text-green-500 ml-1">kg CO₂</span>
                    </p>
                    <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                      🌳 Equiv. <strong className="text-green-700 dark:text-green-300">{globalStats.totalTrees} trees</strong> planted today
                    </p>
                  </div>
                  <div className="p-3 bg-green-200 dark:bg-green-800/60 rounded-2xl flex-shrink-0">
                    <Leaf size={26} className="text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </div>

              {/* Total Solar Savings */}
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-5 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100 dark:bg-emerald-800/30 rounded-full opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-emerald-600 dark:text-emerald-400">💰 Total Solar Savings</p>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                      ₹{globalStats.totalSolarSavings}
                    </p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-2">
                      Avoided grid import across all houses today
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-200 dark:bg-emerald-800/60 rounded-2xl flex-shrink-0">
                    <IndianRupee size={26} className="text-emerald-700 dark:text-emerald-300" />
                  </div>
                </div>
              </div>

              {/* Trees Equivalent */}
              <div className="relative overflow-hidden bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-5 border border-teal-200 dark:border-teal-800 shadow-sm">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-100 dark:bg-teal-800/30 rounded-full opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-teal-600 dark:text-teal-400">🌳 Trees Equivalent</p>
                    <p className="text-3xl font-bold text-teal-700 dark:text-teal-300 mt-2">
                      {globalStats.totalTrees}
                      <span className="text-sm font-medium text-teal-500 ml-1">trees/day</span>
                    </p>
                    <p className="text-xs text-teal-500 dark:text-teal-400 mt-2">
                      Combined solar across {globalStats.activeDevices} active homes
                    </p>
                  </div>
                  <div className="p-3 bg-teal-200 dark:bg-teal-800/60 rounded-2xl flex-shrink-0">
                    <Sprout size={26} className="text-teal-700 dark:text-teal-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">All Houses • Live Status</h2>
              <button onClick={() => openModal()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-3xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                <Plus size={18} /> Add House
              </button>
            </div>

            {/* Houses table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    {["HOUSE NAME","LOCATION","SOLAR","GRID","TODAY'S USAGE","🌱 CO₂ SAVED","💰 SAVINGS","STATUS","ACTIONS"].map(h => (
                      <th key={h} className={`py-4 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-widest ${h === "ACTIONS" ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {visibleHouses.map(house => {
                    const co2  = (house.current.solarEnergyTodayKwh * CO2_PER_KWH).toFixed(1);
                    const save = (house.current.solarEnergyTodayKwh * ELECTRICITY_RATE).toFixed(2);
                    return (
                      <tr key={house.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => setSelectedHouseId(house.id)}>
                        <td className="px-5 py-4 font-medium text-base text-gray-900 dark:text-white">{house.name}</td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{house.location}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold">
                            <Sun size={14} />{house.current.solarPower}<span className="text-xs text-gray-400 font-normal ml-0.5">kW</span>
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-lg font-semibold ${house.current.gridPower < 0 ? "text-emerald-600" : ""}`}>
                            {house.current.gridPower > 0 ? "+" : ""}{house.current.gridPower}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">kW</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-lg font-semibold">{house.current.energyTodayKwh}</span>
                          <span className="text-xs text-gray-400 ml-1">kWh</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                            {co2}<span className="text-xs text-gray-400 font-normal ml-0.5">kg</span>
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-emerald-600 font-semibold">₹{save}</span>
                        </td>
                        <td className="px-5 py-4">{getStatusBadge(house.status)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={e => { e.stopPropagation(); openModal(house); }} className="p-2 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-2xl transition-colors"><Edit size={16} /></button>
                            <button onClick={e => { e.stopPropagation(); handleDeleteHouse(house.id); }} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>

        ) : (
          /* ══════════════════  SINGLE HOUSE DETAIL  ══════════════════════ */
          <div className="space-y-8">
            <button onClick={() => setSelectedHouseId(null)} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
              <ArrowLeft size={18} /> Back to All Houses
            </button>

            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Today's Consumption", value: selectedHouse.current.energyTodayKwh,                                                unit: "kWh", icon: <BarChart3 size={24} />,   bg: "bg-amber-100 dark:bg-amber-900/30", cls: "text-amber-500" },
                { label: "Today's Cost",         value: `₹${(selectedHouse.current.energyTodayKwh * ELECTRICITY_RATE).toFixed(2)}`,         unit: "",    icon: <IndianRupee size={24} />, bg: "bg-rose-100 dark:bg-rose-900/30",   cls: "text-rose-500"  },
                { label: "Monthly Consumption",  value: `${(selectedHouse.current.energyTodayKwh * 30).toFixed(1)}`,                       unit: "kWh", icon: <TrendingUp size={24} />,  bg: "bg-teal-100 dark:bg-teal-900/30",   cls: "text-teal-500"  },
                { label: "Est. Monthly Bill",    value: `₹${((selectedHouse.current.energyTodayKwh * 30) * ELECTRICITY_RATE).toFixed(2)}`, unit: "",    icon: <IndianRupee size={24} />, bg: "bg-rose-100 dark:bg-rose-900/30",   cls: "text-rose-500"  },
              ].map(({ label, value, unit, icon, bg, cls }) => (
                <div key={label} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</p>
                      <p className="text-2xl font-semibold mt-2">{value}{unit && <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>}</p>
                    </div>
                    <div className={`p-2 ${bg} rounded-2xl`}><span className={cls}>{icon}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Energy Flow Insight */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">Energy Flow Status</h3>
              <EnergyFlowInsight
                solar={selectedHouse.current.solarPower}
                battery={selectedHouse.current.batteryPower}
                grid={selectedHouse.current.gridPower}
                total={selectedMetrics?.totalPower ?? 0}
              />
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                {[
                  { dot: "bg-yellow-400",  label: "Solar",   val: `${selectedHouse.current.solarPower} kW`,   cls: "" },
                  { dot: "bg-purple-500",  label: "Battery", val: `${selectedHouse.current.batteryPower > 0 ? "+" : ""}${selectedHouse.current.batteryPower} kW`, cls: selectedHouse.current.batteryPower < 0 ? "text-purple-600" : "text-blue-600" },
                  { dot: "bg-blue-500",    label: "Grid",    val: `${selectedHouse.current.gridPower} kW`,     cls: selectedHouse.current.gridPower < 0 ? "text-emerald-600" : "" },
                  { dot: "bg-emerald-500", label: "Load",    val: `${selectedMetrics?.totalPower ?? 0} kW`,    cls: "" },
                ].map(({ dot, label, val, cls }) => (
                  <div key={label} className="flex items-center gap-2 font-mono">
                    <span className={`w-3 h-3 rounded-full inline-block ${dot}`} />
                    {label}: <strong className={cls}>{val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sustainability Impact ──────────────────────────────────── */}
            {selectedMetrics && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Leaf size={16} className="text-green-500" /> Sustainability Impact Today
                </h3>
                <SustainabilityPanel
                  carbonSaved={selectedMetrics.carbonSaved}
                  moneySaved={selectedMetrics.moneySaved}
                  treesEquivalent={selectedMetrics.treesEquivalent}
                />
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500 px-1">
                  <Sun size={13} className="text-yellow-500 flex-shrink-0" />
                  <span>Solar energy generated today:</span>
                  <strong className="text-gray-600 dark:text-gray-300">{selectedHouse.current.solarEnergyTodayKwh} kWh</strong>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>CO₂ factor:</span>
                  <strong className="text-gray-600 dark:text-gray-300">{CO2_PER_KWH} kg/kWh</strong>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>Rate:</span>
                  <strong className="text-gray-600 dark:text-gray-300">₹{ELECTRICITY_RATE}/kWh</strong>
                </div>
              </div>
            )}

            {/* Live Power Source Cards */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Live Power Sources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-3xl p-5 border border-yellow-100 dark:border-yellow-800 text-center hover:shadow transition-shadow">
                  <Sun size={28} className="mx-auto text-yellow-500 mb-2" />
                  <div className="text-xs uppercase tracking-widest text-yellow-700 dark:text-yellow-400 font-medium">Solar Power</div>
                  <div className="text-3xl font-bold mt-1 text-yellow-600">
                    {selectedHouse.current.solarPower}<span className="text-sm text-yellow-400 ml-1">kW</span>
                  </div>
                  <div className="text-xs text-yellow-500 mt-1 font-medium">☀️ Generating</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-3xl p-5 border border-purple-100 dark:border-purple-800 text-center hover:shadow transition-shadow">
                  <Battery size={28} className="mx-auto text-purple-500 mb-2" />
                  <div className="text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 font-medium">Battery</div>
                  <div className={`text-3xl font-bold mt-1 ${selectedHouse.current.batteryPower < 0 ? "text-purple-600" : "text-blue-600"}`}>
                    {selectedHouse.current.batteryPower > 0 ? "+" : ""}{selectedHouse.current.batteryPower}
                    <span className="text-sm text-purple-400 ml-1">kW</span>
                  </div>
                  <div className="text-xs text-purple-500 mt-1 font-medium">
                    {selectedHouse.current.batteryPower < 0 ? "🔋 Charging" : selectedHouse.current.batteryPower > 0 ? "⚡ Discharging" : "💤 Idle"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-3xl p-5 border border-blue-100 dark:border-blue-800 text-center hover:shadow transition-shadow">
                  <Zap size={28} className="mx-auto text-blue-500 mb-2" />
                  <div className="text-xs uppercase tracking-widest text-blue-700 dark:text-blue-400 font-medium">Grid Power</div>
                  <div className={`text-3xl font-bold mt-1 ${selectedHouse.current.gridPower < 0 ? "text-emerald-600" : "text-blue-600"}`}>
                    {selectedHouse.current.gridPower > 0 ? "+" : ""}{selectedHouse.current.gridPower}
                    <span className="text-sm text-blue-400 ml-1">kW</span>
                  </div>
                  <div className="text-xs text-blue-500 mt-1 font-medium">
                    {selectedHouse.current.gridPower < 0 ? "↗️ Exporting" : "🔌 Importing"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-5 border border-emerald-100 dark:border-emerald-800 text-center hover:shadow transition-shadow">
                  <Home size={28} className="mx-auto text-emerald-500 mb-2" />
                  <div className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium">Total Load</div>
                  <div className="text-3xl font-bold mt-1 text-emerald-600">
                    {selectedMetrics?.totalPower ?? 0}
                    <span className="text-sm text-emerald-400 ml-1">kW</span>
                  </div>
                  <div className="text-xs text-emerald-500 mt-1 font-medium">🏠 Consumption</div>
                </div>
              </div>

              {/* Electrical parameters */}
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 mt-6">Electrical Parameters</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { label: "VOLTAGE",      val: selectedHouse.current.voltage,       unit: "V",   icon: <Gauge size={22} className="text-emerald-500" /> },
                  { label: "CURRENT",      val: selectedHouse.current.current,       unit: "A",   icon: <Activity size={22} className="text-blue-500" /> },
                  { label: "APPARENT PWR", val: selectedHouse.current.apparentPower, unit: "kVA", icon: <Battery size={22} className="text-purple-500" /> },
                  { label: "POWER FACTOR", val: selectedHouse.current.powerFactor,   unit: "",    icon: <TrendingUp size={22} className="text-teal-500" /> },
                  { label: "FREQUENCY",    val: selectedHouse.current.frequency,     unit: "Hz",  icon: <Activity size={22} className="text-indigo-500" /> },
                  { label: "PEAK DEMAND",  val: selectedHouse.current.peakDemandKw,  unit: "kW",  icon: <Zap size={22} className="text-amber-500" /> },
                ].map(({ label, val, unit, icon }) => (
                  <div key={label} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 text-center hover:shadow transition-shadow">
                    <div className="mx-auto mb-2 flex justify-center">{icon}</div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</div>
                    <div className="text-xl font-semibold mt-1">{val}<span className="text-xs text-gray-400 ml-1">{unit}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Zap size={20} /> Energy Sources (kW)</h3>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-3xl font-medium">LIVE • </span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={selectedHouse.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="solarPower"   stroke="#eab308" strokeWidth={2.5} dot={false} name="Solar"   />
                    <Line type="monotone" dataKey="batteryPower" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="Battery" />
                    <Line type="monotone" dataKey="gridPower"    stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Grid"    />
                    <Line type="monotone" dataKey="power"        stroke="#10b981" strokeWidth={2.5} dot={false} name="Load"    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Gauge size={20} /> Real-time Voltage (V)</h3>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-3xl font-medium">LIVE • </span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={selectedHouse.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
                    <YAxis domain={[210, 245]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily + Monthly + Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 size={20} /> Daily Usage (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={selectedHouse.dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis /><Tooltip />
                    <Bar dataKey="kwh" fill="#10b981" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} /> Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={selectedHouse.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis /><Tooltip />
                    <Line type="monotone" dataKey="kwh" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle size={20} /> Alerts</h3>
                  {selectedHouse.alerts.length > 0 && (
                    <span className="px-4 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-3xl font-medium">
                      {selectedHouse.alerts.length} active
                    </span>
                  )}
                </div>
                <div className="space-y-3 max-h-[260px] overflow-y-auto">
                  {selectedHouse.alerts.length === 0
                    ? <div className="flex flex-col items-center justify-center h-52 text-gray-400"><CheckCircle size={40} className="mb-3" /><p className="text-sm font-medium">All systems normal</p></div>
                    : selectedHouse.alerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-3xl flex gap-3 text-sm ${getSeverityColor(alert.severity)}`}>
                          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                          <div><div className="font-medium">{alert.message}</div><div className="text-xs mt-1 opacity-70">{alert.timestamp}</div></div>
                        </div>
                      ))
                  }
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center flex-wrap gap-4 text-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl px-6 py-5">
              <div className="flex items-center gap-8 flex-wrap">
                <div><span className="font-mono text-gray-400">HW_ID</span> <span className="font-semibold text-gray-900 dark:text-white">{selectedHouse.hw_id}</span></div>
                <div className="flex items-center gap-3"><span className="font-mono text-gray-400">STATUS</span> {getStatusBadge(selectedHouse.status)}</div>
                <div><span className="font-mono text-gray-400">PEAK</span> <span className="font-semibold">{selectedHouse.current.peakDemandKw} kW</span></div>
                <div className="flex items-center gap-1.5 text-green-600 font-medium">
                  <Leaf size={14} />
                  CO₂ saved: <strong>{selectedMetrics?.carbonSaved ?? 0} kg</strong>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <IndianRupee size={14} />
                  Solar savings: <strong>₹{selectedMetrics?.moneySaved ?? 0}</strong>
                </div>
              </div>
              <div className="text-emerald-600 text-sm font-medium flex items-center gap-2">
                <Wifi size={16} /> Connected via MQTT • Real-time updates enabled
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl">
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-semibold">{modalMode === 'add' ? 'Add New House' : 'Edit House'}</h2>
            </div>
            <div className="px-6 space-y-5 mt-4">
              {[
                { field: "name",     label: "House Name",  placeholder: "Dublin Family Home" },
                { field: "location", label: "Location",    placeholder: "Dublin, Leinster, IE" },
                { field: "hw_id",    label: "Hardware ID", placeholder: "HW-ENERGY-001234", mono: true },
              ].map(({ field, label, placeholder, mono }) => (
                <div key={field}>
                  <label className="block text-xs uppercase tracking-widest font-medium text-gray-500 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className={`w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 focus:border-emerald-300 rounded-3xl text-sm focus:outline-none ${mono ? "font-mono" : ""}`}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-800 mt-6">
              <button onClick={() => { setShowModal(false); setCurrentEditId(null); }} className="flex-1 py-3.5 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={handleSaveHouse} className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-3xl transition-colors">
                {modalMode === 'add' ? 'Add House' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergyMonitorDashboard;