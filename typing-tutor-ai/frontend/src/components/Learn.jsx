import { Link } from "react-router-dom";

const Learn = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Learn to Type</h1>
                <p className="text-slate-400">Master touch typing with correct finger placement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-sky-400">Starting Position</h2>
                    <p className="text-slate-300 mb-4">
                        Place your fingers on the <strong>Home Row</strong> keys:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>Left Index: <span className="font-mono bg-slate-700 px-2 rounded">F</span></li>
                        <li>Left Middle: <span className="font-mono bg-slate-700 px-2 rounded">D</span></li>
                        <li>Left Ring: <span className="font-mono bg-slate-700 px-2 rounded">S</span></li>
                        <li>Left Pinky: <span className="font-mono bg-slate-700 px-2 rounded">A</span></li>
                        <li className="mt-2">Right Index: <span className="font-mono bg-slate-700 px-2 rounded">J</span></li>
                        <li>Right Middle: <span className="font-mono bg-slate-700 px-2 rounded">K</span></li>
                        <li>Right Ring: <span className="font-mono bg-slate-700 px-2 rounded">L</span></li>
                        <li>Right Pinky: <span className="font-mono bg-slate-700 px-2 rounded">;</span></li>
                    </ul>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-sky-400">Pro Tips</h2>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            Keep your wrists hovering, not resting on the desk.
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            Look at the screen, not your fingers.
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            Focus on accuracy first, speed will come naturally.
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            Use both thumbs for the spacebar.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center mt-8">
                <Link to="/test" className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition shadow-lg">
                    Start Practice
                </Link>
            </div>
        </div>
    );
};

export default Learn;
