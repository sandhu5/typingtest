import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        console.log("Attempting login with:", username); // Debug log

        AuthService.login(username, password).then(
            (data) => {
                console.log("Login successful, response:", data); // Debug log
                console.log("Navigating to /dashboard"); // Debug log
                navigate("/dashboard");
                window.location.reload();
            },
            (error) => {
                console.error("Login error:", error); // Debug log
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-96 border border-slate-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-sky-500 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-sky-500 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-sky-600 hover:bg-sky-500 rounded text-white font-bold transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {message && (
                        <div className="text-red-400 text-sm text-center mt-2">
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
