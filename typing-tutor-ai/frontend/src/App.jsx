import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import TypingTest from './components/TypingTest'
import Learn from './components/Learn'
import Compete from './components/Compete'
import Certificate from './components/Certificate'
import Footer from './components/Footer'
import FAQ from './components/FAQ'
import AuthService from './services/auth.service'

function App() {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [isTimeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [isDifficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        window.location.reload();
    };

    return (
        <Router>
            <div className="min-h-screen bg-slate-900 text-gray-100 font-sans flex flex-col">
                <nav className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
                    <div className="container mx-auto flex items-center justify-between">
                        {/* Left Side - Brand Only */}
                        <Link to="/" className="text-xl font-bold text-sky-400 flex items-center">
                            <span className="mr-2">⚡</span> AI Typer
                        </Link>

                        {/* Right Side - Navigation & Auth */}
                        <div className="flex items-center space-x-6 text-sm font-medium">

                            {/* Time Dropdown */}
                            <div className="relative group text-slate-300 hover:text-white">
                                <button
                                    className="flex items-center transition"
                                    onMouseEnter={() => setTimeDropdownOpen(true)}
                                // onClick={() => setTimeDropdownOpen(!isTimeDropdownOpen)}
                                >
                                    Time ▾
                                </button>
                                <div
                                    className="absolute right-0 mt-0 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50"
                                    onMouseLeave={() => setTimeDropdownOpen(false)}
                                >
                                    <div className="p-1 space-y-1">
                                        <Link to="/test?mode=time&duration=60" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">1 Minute</Link>
                                        <Link to="/test?mode=time&duration=180" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">3 Minutes</Link>
                                        <Link to="/test?mode=time&duration=300" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">5 Minutes</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Difficulty Dropdown */}
                            <div className="relative group text-slate-300 hover:text-white">
                                <button
                                    className="flex items-center transition"
                                    onMouseEnter={() => setDifficultyDropdownOpen(true)}
                                // onClick={() => setDifficultyDropdownOpen(!isDifficultyDropdownOpen)}
                                >
                                    Difficulty ▾
                                </button>
                                <div
                                    className="absolute right-0 mt-0 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50"
                                    onMouseLeave={() => setDifficultyDropdownOpen(false)}
                                >
                                    <div className="p-1 space-y-1">
                                        <Link to="/test?mode=words&length=short" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">Short</Link>
                                        <Link to="/test?mode=words&length=medium" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">Medium</Link>
                                        <Link to="/test?mode=words&length=long" className="block px-3 py-2 hover:bg-slate-700 rounded text-slate-300 text-left">Long</Link>
                                    </div>
                                </div>
                            </div>

                            <Link to="/learn" className="text-slate-300 hover:text-white transition">How to Type</Link>
                            <Link to="/compete" className="text-slate-300 hover:text-white transition">Leaderboard</Link>

                            <div className="border-l border-slate-700 h-6 mx-2"></div>

                            {/* Auth Section */}
                            {currentUser ? (
                                <>
                                    <span className="text-slate-500 hidden lg:inline">Hello, {currentUser.username}</span>
                                    <Link to="/dashboard" className="hover:text-sky-400 transition">Profile</Link>
                                    <button onClick={logOut} className="px-4 py-2 bg-slate-700 hover:bg-red-900/50 hover:text-red-400 rounded transition">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-sky-400 transition">Login</Link>
                                    <Link to="/register" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded text-white font-bold transition">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto p-4 py-8 flex-grow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/test" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/compete" element={<Compete />} />
                        <Route path="/certificate" element={currentUser ? <Certificate /> : <Navigate to="/login" />} />
                        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/test" element={<TypingTest />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    )
}

export default App
