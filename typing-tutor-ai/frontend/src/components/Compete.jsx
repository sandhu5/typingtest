import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TestService from "../services/test.service";

const Compete = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        TestService.getLeaderboard().then(
            (response) => {
                setLeaderboard(response.data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching leaderboard", error);
                setLoading(false);
            }
        );
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Global Leaderboard</h1>
                <p className="text-slate-400">Top 10 typists by WPM.</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                {loading ? (
                    <p className="text-center text-slate-400 py-8">Loading rankings...</p>
                ) : leaderboard.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-700 text-slate-300">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">Rank</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">WPM</th>
                                    <th className="p-4">Accuracy</th>
                                    <th className="p-4 rounded-tr-lg">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {leaderboard.map((session, index) => (
                                    <tr key={session.id} className="hover:bg-slate-750 transition">
                                        <td className="p-4 font-bold text-slate-400">#{index + 1}</td>
                                        <td className="p-4 text-white font-medium">{session.user ? session.user.username : "Anonymous"}</td>
                                        <td className="p-4 font-bold text-sky-400 text-lg">{session.wpm}</td>
                                        <td className="p-4 text-green-400">{session.accuracy}%</td>
                                        <td className="p-4 text-slate-500">{new Date(session.completedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-slate-400 py-8">No records yet. Be the first!</p>
                )}
            </div>

            <div className="text-center">
                <Link to="/test" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-bold transition shadow-lg">
                    Join the Competition
                </Link>
            </div>
        </div>
    );
};

export default Compete;
