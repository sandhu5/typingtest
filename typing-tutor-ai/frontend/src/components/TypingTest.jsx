import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TestService from "../services/test.service";

const TypingTest = () => {
    const [text, setText] = useState("Loading test...");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    // Settings
    const [testMode, setTestMode] = useState("time"); // 'time' or 'words'
    const [durationOption, setDurationOption] = useState(60); // 60, 180, 300
    const [lengthOption, setLengthOption] = useState("medium"); // short, medium, long
    const [isConfiguring, setIsConfiguring] = useState(true);

    const [searchParams] = useSearchParams();

    // Check query params for auto-start
    useEffect(() => {
        const modeParam = searchParams.get('mode');
        const durationParam = searchParams.get('duration');
        const lengthParam = searchParams.get('length');

        if (modeParam) {
            setTestMode(modeParam);
            if (modeParam === 'time' && durationParam) {
                setDurationOption(parseInt(durationParam));
                setTimeLeft(parseInt(durationParam));
                setIsConfiguring(false);
                // Need to trigger load new test here directly or rely on a separate effect
                // Since this runs on mount, and loadNewTest handles API call...
                // But loadNewTest is called in another useEffect[]. We effectively race.
                // Better to just set Config=false and let the user click start? Or auto-start?
                // The prompt implies quick links start the test.
                // Let's rely on standard flow: if config is false, we might need to manually trigger text load.
                // Actually, the useEffect[] calls `loadNewTest` with defaults.
                // We should update `loadNewTest` to read current state? No, closures.
                // Let's FORCE a reload if params exist.
                setTimeout(() => {
                    loadNewTest(lengthParam || "medium");
                }, 100);
            } else if (modeParam === 'words' && lengthParam) {
                setLengthOption(lengthParam);
                setDurationOption(60); // Default placeholder
                setIsConfiguring(false);
                setTimeout(() => {
                    loadNewTest(lengthParam);
                }, 100);
            }
        }
    }, [searchParams]);

    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Stats tracking
    const [errors, setErrors] = useState(0);
    const [errorKeys, setErrorKeys] = useState([]);

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    // Initial load
    useEffect(() => {
        // Wait for user configuration
    }, []);

    const startTestSession = () => {
        setIsConfiguring(false);
        setTimeLeft(durationOption);
        loadNewTest(lengthOption);
    };

    const loadNewTest = (length = "medium") => {
        setText("Loading...");
        TestService.getPersonalizedText(length).then(
            (response) => {
                setText(response.data.message);
                resetTest();
            },
            (error) => {
                console.error("Error loading test", error);
                setText("The quick brown fox jumps over the lazy dog. Failed to load customized text.");
                resetTest();
            }
        );
    };

    const resetTest = () => {
        setUserInput("");
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setTimeLeft(durationOption);
        setIsActive(false);
        setIsFinished(false);
        setErrors(0);
        setErrorKeys([]);
        if (timerRef.current) clearInterval(timerRef.current);
        if (inputRef.current) inputRef.current.focus();
    };

    const startTimer = () => {
        setIsActive(true);
        setStartTime(Date.now());

        timerRef.current = setInterval(() => {
            if (testMode === 'time') {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                // In word mode, we just track time elapsed for WPM calc, but here let's validly update wpm
                // For simplicity, we can let timeLeft go negative or just use startTime
                setTimeLeft((prev) => prev - 1);
            }
        }, 1000);
    };

    const [currentUser, setCurrentUser] = useState(undefined);

    // Check for user login
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const finishTest = () => {
        clearInterval(timerRef.current);
        setIsFinished(true);
        setIsActive(false);

        // Calculate final stats
        const timeElapsed = testMode === 'time' ? (durationOption - timeLeft) : (Date.now() - startTime) / 1000;
        const safeTime = timeElapsed < 1 ? 1 : timeElapsed; // Avoid div by zero

        // Submit results ONLY if logged in
        if (currentUser) {
            TestService.submitTest(
                wpm,
                accuracy,
                Math.round(safeTime),
                errors,
                errorKeys.join(",")
            ).then(() => {
                console.log("Test submitted");
            });
        }
    };

    const handleInput = (e) => {
        const value = e.target.value;

        if (!isActive && !isFinished) {
            startTimer();
        }

        if (isFinished) return;

        // --- Improved Error Logic ---
        // Instead of incremental counters, compare full strings to get current error state
        let currentErrors = 0;
        const currentKeys = [];

        for (let i = 0; i < value.length; i++) {
            if (i < text.length && value[i] !== text[i]) {
                currentErrors++;
                currentKeys.push(text[i]); // Track the key they MISSED
            }
        }

        setErrors(currentErrors);

        // Accumulate specific keys for AI (we want all historical mistakes, so we keep adding to set/list?)
        // Requirement: "user can correct their mistakes... cursor is not resetting"
        // If we strictly track CURRENT errors, the red highlighting fixes itself.
        // For AI analysis, we probably want to know *everything* they typed wrong. 
        // Let's keep `errorKeys` cumulative for analysis, but `errors` (count) reflective of current state for UI/Accuracy.
        if (value.length > userInput.length) {
            const char = value[value.length - 1];
            const expected = text[value.length - 1];
            if (char !== expected) {
                setErrorKeys(prev => [...prev, expected]);
            }
        }

        // Check if we need more text (Infinite Scroll for Time Mode)
        if (testMode === 'time' && value.length > text.length - 50) {
            TestService.getPersonalizedText("medium").then(res => {
                // Append transparently. Note: this might cause state sync issues if user types super fast.
                // ideally we append to a 'pendingText' queue, but appending to state works for now.
                // We must handle the space between texts.
                setText(prev => prev + " " + res.data.message);
            });
        }

        setUserInput(value);

        // Calculate Stats
        const words = value.trim().split(/\s+/).length;

        let timeElapsed = 0;
        if (startTime) {
            timeElapsed = (Date.now() - startTime) / 1000;
        }

        const minutes = timeElapsed / 60;
        const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0;
        const currentAccuracy = value.length > 0
            ? Math.round(((value.length - currentErrors) / value.length) * 100)
            : 100;

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);

        // Auto-finish ONLY if Words Mode
        if (testMode === 'words' && value.length >= text.length) {
            finishTest();
        }
    };

    // Render text with highlighting
    const renderText = () => {
        return text.split("").map((char, index) => {
            let color = "text-slate-400";
            if (index < userInput.length) {
                color = userInput[index] === char ? "text-green-400" : "text-red-500 bg-red-900/30";
            }
            // highlight current cursor position
            let cursorClass = "";
            if (index === userInput.length && isActive) {
                cursorClass = " border-l-2 border-sky-400 animate-pulse";
            }

            return (
                <span key={index} className={color + cursorClass}>
                    {char}
                </span>
            );
        });
    };

    if (isConfiguring) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Configure Test</h2>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sky-400 font-bold mb-4">Mode</h3>
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={() => setTestMode('time')}
                                    className={`p-3 rounded border transition ${testMode === 'time' ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300'}`}
                                >
                                    Time Limit
                                </button>
                                <button
                                    onClick={() => setTestMode('words')}
                                    className={`p-3 rounded border transition ${testMode === 'words' ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300'}`}
                                >
                                    Word Count
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sky-400 font-bold mb-4">Options</h3>
                            {testMode === 'time' ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {[60, 180, 300].map(sec => (
                                        <button key={sec} onClick={() => setDurationOption(sec)} className={`p-2 rounded border ${durationOption === sec ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 border-slate-600'}`}>
                                            {sec / 60} Minutes
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {['short', 'medium', 'long'].map(len => (
                                        <button key={len} onClick={() => setLengthOption(len)} className={`p-2 rounded border ${lengthOption === len ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 border-slate-600 capitalize'}`}>
                                            {len} Text
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={startTestSession} className="w-full py-4 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-bold text-xl transition shadow-lg shadow-sky-900/50">
                        Start Typing Test
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {!isFinished ? (
                <>
                    <div className="flex justify-between items-center text-xl font-bold text-slate-300">
                        <div>
                            {testMode === 'time' ? 'Time Left' : 'Time Elapsed'}: <span className="text-white">{testMode === 'time' ? timeLeft : Math.abs(timeLeft - 60)}s</span>
                        </div>
                        <div>WPM: <span className="text-white">{wpm}</span></div>
                        <div>Accuracy: <span className="text-white">{accuracy}%</span></div>
                    </div>

                    <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg text-2xl font-mono leading-relaxed min-h-[200px] cursor-text" onClick={() => inputRef.current.focus()}>
                        <div className="absolute inset-0 p-8 pointer-events-none whitespace-pre-wrap break-words z-10">
                            {renderText()}
                        </div>
                        <textarea
                            ref={inputRef}
                            value={userInput}
                            onChange={handleInput}
                            className="w-full h-full bg-transparent text-transparent caret-transparent focus:outline-none resize-none absolute inset-0 p-8 z-0 font-mono"
                            spellCheck="false"
                            autoFocus
                        />
                    </div>

                    <div className="text-center text-slate-500 text-sm">
                        Start typing to begin. {testMode === 'time' && "Stop when time runs out."}
                    </div>
                </>
            ) : (
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">Test Completed!</h2>
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        <div className="bg-slate-700 p-4 rounded">
                            <p className="text-slate-400">WPM</p>
                            <p className="text-3xl font-bold text-sky-400">{wpm}</p>
                        </div>
                        <div className="bg-slate-700 p-4 rounded">
                            <p className="text-slate-400">Accuracy</p>
                            <p className="text-3xl font-bold text-green-400">{accuracy}%</p>
                        </div>
                        <div className="bg-slate-700 p-4 rounded">
                            <p className="text-slate-400">Errors</p>
                            <p className="text-3xl font-bold text-red-400">{errors}</p>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => setIsConfiguring(true)} className="px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded text-white font-bold transition">New Test</button>
                        {currentUser ? (
                            <Link to="/dashboard" className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded text-white font-bold transition">Back to Dashboard</Link>
                        ) : (
                            <Link to="/login" className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold transition">Login to Save Progress</Link>
                        )}
                    </div>

                    {wpm > 0 && (
                        <div className="pt-6 border-t border-slate-700">
                            <Link to={`/certificate?wpm=${wpm}&accuracy=${accuracy}`} className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg text-white font-bold transition shadow-lg transform hover:scale-105">
                                🏆 Get Certificate
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TypingTest;
