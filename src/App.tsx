import { useState } from 'react';
import { AlertTriangle, Download, Sun, Moon, RefreshCw, Megaphone, BarChart3 } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const simulateRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const kpiData = [
    { title: "Total Incidents", value: "1,284", change: "-12%" },
    { title: "Fatalities", value: "187", change: "-18%" },
    { title: "Complaints", value: "892", change: "+5%" },
    { title: "Campaign Reach", value: "2.8M", change: "+41%" },
  ];

  const complaintsTrend = { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Complaints', data: [145,132,98,87,76,65], borderColor: '#eab308', tension: 0.4 }] };
  const highwayData = { labels: ['N-5','M-2','M-9','Others'], datasets: [{ label: 'Incidents', data: [452,187,98,471], backgroundColor: '#eab308' }] };
  const severityData = { labels: ['High','Medium','Low'], datasets: [{ data: [35,45,20], backgroundColor: ['#ef4444','#eab308','#22c55e'] }] };

  const pressReleases = [
    { title: "NHA Launches New Road Safety Campaign on M-2", date: "Jun 18, 2026", type: "Campaign" },
    { title: "Update on N-5 Rehabilitation Progress", date: "Jun 15, 2026", type: "Project" },
    { title: "Appeal for Careful Driving During Monsoon", date: "Jun 12, 2026", type: "Advisory" },
  ];

  const crisisAlerts = [
    { message: "High traffic congestion reported on N-5 near Lahore", level: "High" },
    { message: "Landslide reported on N-15 - Teams dispatched", level: "High" },
    { message: "Bridge repair ongoing on M-9", level: "Medium" },
  ];

  const exportPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    const canvas = await html2canvas(element);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 10, 210, 0);
    pdf.save('NHA_PR_Report.pdf');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-green-800' : 'bg-green-700'} border-b border-green-900`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/nha-logo.png" alt="NHA" className="h-12" />
            <div>
              <h1 className="text-2xl font-bold">PR Command Center</h1>
              <p className="text-green-100 text-sm">National Highway Authority</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={simulateRefresh} className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl hover:bg-green-500">
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl hover:bg-green-900">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button onClick={exportPDF} className="flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100">
              <Download size={18} /> Export Report
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-green-900">
          <div className="flex gap-8 text-sm">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'engagement', label: 'Public Engagement', icon: Megaphone },
              { id: 'crisis', label: 'Crisis & Alerts', icon: AlertTriangle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium flex items-center gap-2 ${activeTab === tab.id ? 'border-white text-white' : 'border-transparent text-green-200 hover:text-white'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div id="dashboard-content" className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpiData.map((k, i) => (
                <div key={i} className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
                  <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{k.title}</p>
                  <p className="text-4xl font-bold mt-2">{k.value}</p>
                  <p className="text-green-500 text-sm mt-1">{k.change}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
                <h3 className="font-semibold mb-4">Accident Trend</h3>
                <Line data={complaintsTrend} />
              </div>
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
                <h3 className="font-semibold mb-4">Incidents by Highway</h3>
                <Bar data={highwayData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Public Engagement</h2>
            
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
              <h3 className="font-semibold mb-6 flex items-center gap-2"><Megaphone size={22} /> Recent Press Releases</h3>
              <div className="space-y-4">
                {pressReleases.map((pr, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div>
                      <p className="font-medium">{pr.title}</p>
                      <p className="text-sm text-gray-400">{pr.date}</p>
                    </div>
                    <span className="text-xs bg-green-600 px-4 py-1.5 rounded-full text-white font-medium flex items-center justify-center min-w-[90px] text-center">{pr.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
              <h3 className="font-semibold mb-4">Public Complaints Trend</h3>
              <Line data={complaintsTrend} />
            </div>
          </div>
        )}

        {activeTab === 'crisis' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Crisis & Alerts</h2>
            
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-red-950 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <h3 className="font-semibold flex items-center gap-2 text-red-400 mb-4"><AlertTriangle size={22} /> Active Crisis Alerts</h3>
              {crisisAlerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-2xl mb-3 ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                  {alert.message}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
                <h3 className="font-semibold mb-4">Incident Severity Breakdown</h3>
                <Pie data={severityData} />
              </div>
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-green-800' : 'bg-white border-gray-200 shadow'}`}>
                <h3 className="font-semibold mb-4">Risk Heatmap (Major Highways)</h3>
                <p className="text-sm text-gray-400 mb-6">Visual representation of risk levels based on incident frequency and severity.</p>
                <div className="space-y-4 mt-4">
                  {['N-5', 'M-2', 'M-9', 'N-25'].map((hwy, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-20 font-medium">{hwy}</div>
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${i === 0 ? 'bg-red-500 w-[85%]' : i === 1 ? 'bg-orange-500 w-[60%]' : 'bg-yellow-500 w-[40%]'}`} />
                      </div>
                      <span className="text-sm w-12 text-right font-medium">{i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800 mt-12">
        Built by Qasim Farooq • Portfolio for National Highway Authority
      </footer>
    </div>
  );
}

export default App;