import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function EnergyMonitorDashboard() {
  // Sample data for dashboard
  const [data, setData] = useState({
    summary: {
      totalActivePower: 85.7,
      totalPowerFactor: 0.92,
      averageVoltage: 230.5,
      averageCurrent: 124.3,
    },
    phases: {
      R: {
        voltage: 232.1,
        current: 125.7,
        powerConsumption: 29.2,
        powerFactor: 0.94,
        apparentPower: 31.1,
        reactivePower: 10.5,
        status: "Good"
      },
      Y: {
        voltage: 228.7,
        current: 138.2,
        powerConsumption: 31.6,
        powerFactor: 0.79,
        apparentPower: 40.0,
        reactivePower: 24.3,
        status: "Low"
      },
      B: {
        voltage: 230.8,
        current: 109.1,
        powerConsumption: 24.9,
        powerFactor: 0.88,
        apparentPower: 28.3,
        reactivePower: 13.4,
        status: "Fair"
      }
    },
    alerts: [
      {
        title: "Unbalanced Load Detected in Y Phase",
        description: "Current consumption 26% above average. Investigate potential unauthorized connection."
      },
      {
        title: "kWh-kVAh Mismatch",
        description: "Variance of 8.2% detected between active and apparent energy consumption."
      }
    ],
    tips: [
      {
        title: "Install Capacitors for Y Phase",
        description: "Power factor (0.79) is below optimal level. Installing power factor correction capacitors can improve efficiency."
      },
      {
        title: "Load Balancing Recommended",
        description: "Redistribute loads more evenly across all three phases to improve system efficiency."
      },
      {
        title: "Schedule Heavy Loads for Off-Peak Hours",
        description: "Running high-power equipment during off-peak hours can reduce energy costs by 15-20%."
      }
    ]
  });

  // Chart data
  const timeLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  const kwhData = [42, 45, 40, 38, 55, 65, 75, 85, 78, 88, 70, 58];
  const kvahData = [48, 50, 45, 42, 60, 72, 82, 93, 85, 95, 78, 65];
  const kvarhData = [20, 22, 18, 15, 25, 30, 35, 42, 38, 40, 32, 28];

  // Line chart options
  const lineChartOptions = {
    chart: {
      height: 250,
      type: 'line',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories: timeLabels
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + ' units';
        }
      }
    },
    legend: {
      position: 'top'
    },
    markers: {
      size: 4
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['#f3f4f6', 'transparent'],
        opacity: 0.5
      }
    }
  };

  const lineChartSeries = [
    {
      name: 'Active Energy (kWh)',
      data: kwhData,
      color: '#3182ce'
    },
    {
      name: 'Apparent Energy (kVAh)',
      data: kvahData,
      color: '#e53e3e'
    },
    {
      name: 'Reactive Energy (kVARh)',
      data: kvarhData,
      color: '#d69e2e'
    }
  ];

  // Bar chart options
  const barChartOptions = {
    chart: {
      height: 250,
      type: 'bar',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 8,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#e53e3e', '#d69e2e', '#3182ce'],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + ' kW';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    xaxis: {
      categories: ['R Phase', 'Y Phase', 'B Phase'],
      position: 'bottom',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: true,
        formatter: function(val) {
          return val + ' kW';
        }
      }
    }
  };

  const barChartSeries = [{
    name: 'Power Consumption (kW)',
    data: [data.phases.R.powerConsumption, data.phases.Y.powerConsumption, data.phases.B.powerConsumption],
  }];

  // Helper function to get badge color
  const getBadgeColor = (status) => {
    switch(status) {
      case "Good": return "bg-green-100 text-green-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Refresh data function
  const refreshData = () => {
    // In a real application, this would fetch new data from an API
    console.log("Refreshing data...");
    // Mock data update
    setData(prevData => ({
      ...prevData,
      summary: {
        ...prevData.summary,
        totalActivePower: (prevData.summary.totalActivePower + (Math.random() * 2 - 1)).toFixed(1),
      }
    }));
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="container-fluid mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-2">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Active Power</p>
                <h2 className="text-2xl font-bold">{data.summary.totalActivePower} kW</h2>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-500">+3.2%</span> from yesterday
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-2">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Power Factor</p>
                <h2 className="text-2xl font-bold">{data.summary.totalPowerFactor}</h2>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-500">+0.05</span> from yesterday
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-2">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Voltage</p>
                <h2 className="text-2xl font-bold">{data.summary.averageVoltage} V</h2>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-red-500">-1.2%</span> from yesterday
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-2">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Current</p>
                <h2 className="text-2xl font-bold">{data.summary.averageCurrent} A</h2>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-500">+2.8%</span> from yesterday
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Phase-Wise Monitoring */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4 text-red-600">R Phase</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Voltage</span>
                <span className="font-semibold">{data.phases.R.voltage} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current</span>
                <span className="font-semibold">{data.phases.R.current} A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Consumption</span>
                <span className="font-semibold">{data.phases.R.powerConsumption} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Factor</span>
                <span className="font-semibold">
                  {data.phases.R.powerFactor} 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getBadgeColor(data.phases.R.status)}`}>
                    {data.phases.R.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Apparent Power</span>
                <span className="font-semibold">{data.phases.R.apparentPower} kVA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reactive Power</span>
                <span className="font-semibold">{data.phases.R.reactivePower} kVAR</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4 text-yellow-600">Y Phase</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Voltage</span>
                <span className="font-semibold">{data.phases.Y.voltage} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current</span>
                <span className="font-semibold">{data.phases.Y.current} A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Consumption</span>
                <span className="font-semibold">{data.phases.Y.powerConsumption} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Factor</span>
                <span className="font-semibold">
                  {data.phases.Y.powerFactor} 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getBadgeColor(data.phases.Y.status)}`}>
                    {data.phases.Y.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Apparent Power</span>
                <span className="font-semibold">{data.phases.Y.apparentPower} kVA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reactive Power</span>
                <span className="font-semibold">{data.phases.Y.reactivePower} kVAR</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4 text-blue-600">B Phase</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Voltage</span>
                <span className="font-semibold">{data.phases.B.voltage} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current</span>
                <span className="font-semibold">{data.phases.B.current} A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Consumption</span>
                <span className="font-semibold">{data.phases.B.powerConsumption} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power Factor</span>
                <span className="font-semibold">
                  {data.phases.B.powerFactor} 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getBadgeColor(data.phases.B.status)}`}>
                    {data.phases.B.status}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Apparent Power</span>
                <span className="font-semibold">{data.phases.B.apparentPower} kVA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reactive Power</span>
                <span className="font-semibold">{data.phases.B.reactivePower} kVAR</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Theft Detection and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Theft Detection Panel */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Theft Detection
            </h3>
            <div className="space-y-4">
              {data.alerts.map((alert, index) => (
                <div key={index} className="bg-red-100 p-4 rounded-lg">
                  <div className="font-semibold text-red-700 mb-1">{alert.title}</div>
                  <p className="text-red-600 text-sm">{alert.description}</p>
                </div>
              ))}
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-2"
                onClick={() => alert("Generating security report...")}
              >
                Generate Security Report
              </button>
            </div>
          </div>
          
          {/* Energy-Saving Tips */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Energy-Saving Tips
            </h3>
            <div className="space-y-4">
              {data.tips.map((tip, index) => (
                <div key={index} className="bg-blue-100 p-4 rounded-lg">
                  <div className="font-semibold text-blue-700 mb-1">{tip.title}</div>
                  <p className="text-blue-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4">Energy Consumption Over Time</h3>
            <Chart 
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={250}
            />
          </div>
          
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-4">Phase-wise Power Consumption</h3>
            <Chart 
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={250}
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white p-6 rounded-lg shadow mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              &copy; 2025 Energy Monitor System | Last updated: April 11, 2025 11:23 AM
            </div>
            <div className="flex space-x-4">
              <button onClick={() => alert("Downloading report...")} className="text-blue-500 hover:text-blue-700">Download Report</button>
              <button onClick={() => alert("Opening user manual...")} className="text-blue-500 hover:text-blue-700">User Manual</button>
              <button onClick={() => alert("Contacting support...")} className="text-blue-500 hover:text-blue-700">Contact Support</button>
            </div>
          </div>
        </footer>
        
        {/* Refresh Button - Floating */}
        <button 
          onClick={refreshData}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}