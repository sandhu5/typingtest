import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">AI Typer</h3>
                    <p className="text-sm">
                        Improve your typing speed and accuracy with our AI-powered typing tutor.
                        Personalized practice to help you master touch typing.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Typing Test</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/test?mode=time&duration=60" className="hover:text-sky-400 transition">1 Minute Test</Link></li>
                        <li><Link to="/test?mode=time&duration=180" className="hover:text-sky-400 transition">3 Minute Test</Link></li>
                        <li><Link to="/test?mode=time&duration=300" className="hover:text-sky-400 transition">5 Minute Test</Link></li>
                        <li><Link to="/test?mode=words&length=long" className="hover:text-sky-400 transition">Text Practice</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/learn" className="hover:text-sky-400 transition">How to Type</Link></li>
                        <li><Link to="/faq" className="hover:text-sky-400 transition">FAQ</Link></li>
                        <li><Link to="/compete" className="hover:text-sky-400 transition">Leaderboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-sky-400 transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-sky-400 transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-sky-400 transition">Contact Us</a></li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-xs mt-12 pt-8 border-t border-slate-800">
                &copy; {new Date().getFullYear()} AI Typer. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
