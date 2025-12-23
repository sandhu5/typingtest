import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TestService from "../services/test.service";
import AuthService from "../services/auth.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(AuthService.getCurrentUser() || {}); // Default to empty object to prevent null crash

  useEffect(() => {
    // Fetch History
    TestService.getHistory().then(
      (response) => {
        setHistory(response.data);
      },
      (error) => {
        console.error("Error fetching history", error);
      }
    );

    // Fetch latest User Stats
    TestService.getUserProfile().then(
      (response) => {
        setUser(response.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile", error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  const chartData = {
    labels: history.slice(0, 10).reverse().map((session, index) => "Test " + (index + 1)),
    datasets: [
      {
        label: "WPM",
        data: history.slice(0, 10).reverse().map((session) => session.wpm),
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.5)",
      },
      {
        label: "Accuracy %",
        data: history.slice(0, 10).reverse().map((session) => session.accuracy),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Recent Performance',
        color: 'white'
      },
    },
    scales: {
      y: {
        ticks: { color: 'gray' },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: 'gray' },
        grid: { color: '#334155' }
      }
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.username || "User"}</h1>
          <p className="text-slate-400">Track your progress and improve.</p>
        </div>
        <Link to="/test" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-bold transition shadow-lg shadow-sky-900/50">
          Start Typing Test
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded text-center">
              <p className="text-sm text-slate-400">Avg WPM</p>
              <p className="text-2xl font-bold text-sky-400">{user.averageWpm || 0}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded text-center">
              <p className="text-sm text-slate-400">Avg Accuracy</p>
              <p className="text-2xl font-bold text-green-400">{user.averageAccuracy || 0}%</p>
            </div>
            <div className="bg-slate-700 p-4 rounded text-center">
              <p className="text-sm text-slate-400">Total Tests</p>
              <p className="text-2xl font-bold text-white">{user.totalTests || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Performance Graph</h2>
          {history.length > 0 ? <Line options={options} data={chartData} /> : <p className="text-slate-400 text-center py-10">No tests taken yet.</p>}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent History</h2>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-700 text-slate-300">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">WPM</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {history.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-750">
                    <td className="p-3">{new Date(session.completedAt).toLocaleDateString()} {new Date(session.completedAt).toLocaleTimeString()}</td>
                    <td className="p-3 font-bold text-sky-400">{session.wpm}</td>
                    <td className="p-3 text-green-400">{session.accuracy}%</td>
                    <td className="p-3 text-red-400">{session.errorCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400">No tests taken yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
