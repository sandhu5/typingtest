import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Certificate = () => {
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(AuthService.getCurrentUser());

    const wpm = searchParams.get("wpm") || 0;
    const accuracy = searchParams.get("accuracy") || 0;
    const date = new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">

            {/* Certificate Container - Designed for Print */}
            <div id="certificate-view" className="bg-orange-50 text-slate-900 p-12 rounded-lg border-8 border-double border-yellow-600 shadow-2xl max-w-4xl w-full text-center relative overflow-hidden">
                {/* Background Watermark/Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                    <span className="text-9xl font-serif">AI</span>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="border-b-4 border-slate-900 inline-block pb-2 mb-8">
                        <h1 className="text-6xl font-serif font-bold uppercase tracking-widest text-slate-800">Certificate</h1>
                        <h2 className="text-2xl font-serif text-slate-600 uppercase tracking-widest mt-2">of Completion</h2>
                    </div>

                    <p className="text-xl italic font-serif text-slate-600">This certifies that</p>

                    <h3 className="text-5xl font-bold font-serif text-sky-700 py-4 border-b border-slate-300 inline-block px-12">
                        {user ? user.username : "Valued User"}
                    </h3>

                    <p className="text-xl italic font-serif text-slate-600 mt-6">has successfully demonstrated typing proficiency with the following results:</p>

                    <div className="flex justify-center space-x-12 my-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">{wpm}</p>
                            <p className="uppercase text-sm tracking-wide text-slate-500 font-bold">Words Per Minute</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-slate-900">{accuracy}%</p>
                            <p className="uppercase text-sm tracking-wide text-slate-500 font-bold">Accuracy</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-300">
                        <div className="text-left">
                            <p className="font-bold text-lg">{date}</p>
                            <p className="text-sm uppercase text-slate-500">Date</p>
                        </div>

                        <div className="text-right">
                            <div className="h-10">
                                {/* Signature placeholder */}
                                <span className="font-script text-3xl text-sky-800">AI Typer App</span>
                            </div>
                            <p className="text-sm uppercase text-slate-500 mt-2 border-t border-slate-400 pt-1 px-8 inline-block">Certified By</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* No-Print Controls */}
            <div className="mt-8 space-x-4 print:hidden">
                <button onClick={() => window.print()} className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow-lg transition">
                    Print / Save as PDF
                </button>
                <Link to="/dashboard" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold shadow-lg transition">
                    Back to Dashboard
                </Link>
            </div>

            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-view, #certificate-view * {
            visibility: visible;
          }
          #certificate-view {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            border: 4px solid #b45309 !important; /* Force border color */
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
              display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default Certificate;
