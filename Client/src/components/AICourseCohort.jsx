import React from 'react';

const AICourseCohort = () => {
    return (
        <section className="py-24 px-6 text-center relative" style={{ opacity: 1, transform: 'none' }}>
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-8 text-on-surface">
                    Ready to build your child's AI future?
                </h2>
                <p className="text-xl text-on-surface-variant mb-12">
                    Enroll today — limited seats per cohort to ensure personalized mentorship.
                </p>
                <div className="bg-surface-container-low p-8 rounded-3xl border border-primary/20 inline-block w-full max-w-lg">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center text-left">
                            <div>
                                <p className="text-sm text-secondary font-bold uppercase tracking-widest">Next Cohort Starts</p>
                                <p className="text-lg font-bold text-on-surface">15th April 2026</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-secondary font-bold uppercase tracking-widest">Seats Left</p>
                                <p className="text-lg font-bold text-secondary">07 / 20</p>
                            </div>
                        </div>
                        <button 
                            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-xl font-headline font-black text-xl shadow-xl shadow-[0_25px_50px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                            tabIndex="0" 
                            style={{ 
                                boxShadow: 'rgba(0, 229, 255, 0.5) 0px 30px 60px', 
                                transform: 'none' 
                            }}
                        >
                            <div className="flex items-center justify-center gap-2" style={{ opacity: 1 }}>
                                Reserve Admission Now
                            </div>
                        </button>
                        <p className="text-xs text-on-surface-variant">
                            Secure payment. Immediate curriculum access upon enrollment.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AICourseCohort;
