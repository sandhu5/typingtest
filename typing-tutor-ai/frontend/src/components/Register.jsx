import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        AuthService.register(username, email, password).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                setTimeout(() => navigate("/login"), 2000);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-96 border border-slate-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
                <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-sky-500 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-sky-500 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
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
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-sky-600 hover:bg-sky-500 rounded text-white font-bold transition"
                    >
                        Sign Up
                    </button>

                    {message && (
                        <div
                            className={`text-sm text-center mt-2 ${successful ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;
