const FAQ = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                <p className="text-slate-400">Common questions about typing and our platform.</p>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-xl font-bold text-sky-400 mb-2">How is WPM calculated?</h3>
                    <p className="text-slate-300">
                        WPM (Words Per Minute) is calculated by taking the number of characters typed divided by 5 (the standard word length) and then dividing by the time elapsed in minutes.
                        <strong> Formula: (Characters / 5) / Minutes</strong>.
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-xl font-bold text-sky-400 mb-2">How can I improve my typing speed?</h3>
                    <p className="text-slate-300">
                        Consistency is key! Practice daily using our <strong>Learn to Type</strong> guide to ensure proper finger placement.
                        Focus on <em>accuracy</em> first; speed will naturally follow as your muscle memory builds.
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-xl font-bold text-sky-400 mb-2">What is a good typing speed?</h3>
                    <p className="text-slate-300">
                        The average typing speed is around 40 WPM. Professional typists often reach 65-75 WPM. Advanced competitive typists can reach speeds over 120 WPM!
                    </p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-xl font-bold text-sky-400 mb-2">Is this service free?</h3>
                    <p className="text-slate-300">
                        Yes! AI Typer is completely free to use. You can practice as a guest, or create an account to track your progress and compete on the global leaderboard.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
