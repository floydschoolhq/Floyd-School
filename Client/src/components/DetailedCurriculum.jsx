import React from 'react';
import termsPDF from '../assets/pdf/floydschool_terms_and_conditions.pdf';

const DetailedCurriculum = () => {
    return (
        <div className="bg-surface text-on-surface font-body antialiased">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.06)]">
                <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
                    <div className="text-2xl font-black tracking-tighter text-primary font-headline">
                        Luminescent Academy
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                        <a className="text-primary border-b-2 border-primary pb-1 font-manrope tracking-tight" href="#">Curriculum</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-manrope tracking-tight" href="#">Projects</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-manrope tracking-tight" href="#">Mentors</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-manrope tracking-tight" href="#">Community</a>
                        <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-bold scale-95 active:scale-90 transition-transform">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20">
                {/* Hero Header */}
                <header className="relative px-8 py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low to-transparent pointer-events-none"></div>
                    <div className="max-w-6xl mx-auto relative z-10 text-center">
                        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                            Foundations of
                            <br className="block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                                AI and Machine Learning
                            </span>
                        </h1>
                        <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                            The question isn't whether AI will shape your child's future. It's whether they'll build it — or just watch.
                        </p>
                    </div>
                </header>

                {/* Quick Stats Section */}
                <section className="px-8 py-12">
                    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface-container-high p-8 rounded-xl border-t-2 border-primary-container/30 text-center">
                            <span className="block text-4xl font-headline font-black text-primary-container mb-2">12</span>
                            <span className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Weeks</span>
                        </div>
                        <div className="bg-surface-container-high p-8 rounded-xl border-t-2 border-secondary/30 text-center">
                            <span className="block text-4xl font-headline font-black text-secondary mb-2">36</span>
                            <span className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Classes</span>
                        </div>
                        <div className="bg-surface-container-high p-8 rounded-xl border-t-2 border-primary-container/30 text-center">
                            <span className="block text-4xl font-headline font-black text-primary-container mb-2">8+</span>
                            <span className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Projects</span>
                        </div>
                        <div className="bg-surface-container-high p-8 rounded-xl border-t-2 border-secondary/30 text-center">
                            <span className="block text-4xl font-headline font-black text-secondary mb-2">1</span>
                            <span className="text-on-surface-variant uppercase tracking-widest text-xs font-bold">Capstone</span>
                        </div>
                    </div>
                </section>

                {/* Curriculum Breakdown */}
                <section className="px-8 py-16 space-y-32">
                    {/* Month 1 */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                            <h2 className="font-headline text-3xl font-extrabold text-primary-fixed tracking-tight">Month 01: Python Fundamentals</h2>
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Week 1 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group hover:border-primary-container/50 transition-colors">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">01</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 1</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Python from Scratch</h3>
                                <p className="text-on-surface-variant italic mb-6">"Coding isn't just syntax; it's the language of logic."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Variables & Data Types</li>
                                            <li>• Control Flow & Logic</li>
                                            <li>• Basic Syntax Paradigms</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">The Logic Engine: Interactive Calculator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 2 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group hover:border-primary-container/50 transition-colors">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">02</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 2</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Structures & Collections</h3>
                                <p className="text-on-surface-variant italic mb-6">"Organizing data is the first step toward intelligence."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Lists & Dictionaries</li>
                                            <li>• Looping & Iteration</li>
                                            <li>• Memory Management Basics</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Dynamic Inventory System</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 3 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group hover:border-primary-container/50 transition-colors">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">03</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 3</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Modular Design</h3>
                                <p className="text-on-surface-variant italic mb-6">"Scaling complexity through reusable components."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Functions & Parameters</li>
                                            <li>• Libraries & Imports</li>
                                            <li>• Error Handling Patterns</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Multi-tool Science Utility</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 4 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group hover:border-primary-container/50 transition-colors">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">04</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 4</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">The Final Foundation</h3>
                                <p className="text-on-surface-variant italic mb-6">"Synthesizing basics into complex problem solving."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• File I/O Operations</li>
                                            <li>• Complex Algorithm Practice</li>
                                            <li>• Month 1 Review</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Mini-CRM: Student Database</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month 2 */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                            <h2 className="font-headline text-3xl font-extrabold text-primary-fixed tracking-tight">Month 02: APIs & Machine Learning</h2>
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Week 5 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">05</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 5</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">The Connected Web</h3>
                                <p className="text-on-surface-variant italic mb-6">"Accessing the world's data through APIs."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• REST API Fundamentals</li>
                                            <li>• Request/Response Cycle</li>
                                            <li>• JSON Parsing</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Global Weather Command Center</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 6 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">06</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 6</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">AI Service Integration</h3>
                                <p className="text-on-surface-variant italic mb-6">"Standing on the shoulders of giants: OpenAI & more."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• LLM Integration (GPT-4)</li>
                                            <li>• Prompt Engineering Basics</li>
                                            <li>• Secure API Key Management</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Personal AI Tutor Bot</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 7 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">07</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 7</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Introduction to ML</h3>
                                <p className="text-on-surface-variant italic mb-6">"Moving from rules to patterns."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Supervised Learning</li>
                                            <li>• Regression vs Classification</li>
                                            <li>• Scikit-Learn Basics</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Price Prediction Algorithm</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 8 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">08</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 8</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Neural Thinking</h3>
                                <p className="text-on-surface-variant italic mb-6">"Mimicking the architecture of the human brain."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Perceptrons & Layers</li>
                                            <li>• Backpropagation Logic</li>
                                            <li>• Training vs Inference</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Sentiment Analysis Engine</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month 3 */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                            <h2 className="font-headline text-3xl font-extrabold text-primary-fixed tracking-tight">Month 03: Computer Vision & Deployment</h2>
                            <div className="h-px flex-1 bg-outline-variant/30"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Week 9 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">09</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 9</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Vision with OpenCV</h3>
                                <p className="text-on-surface-variant italic mb-6">"Teaching machines to see and interpret reality."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Image Processing Basics</li>
                                            <li>• Color Space Manipulation</li>
                                            <li>• Real-time Video Feeds</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">Smart Motion Detector</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 10 */}
                            <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-5 text-8xl font-black text-primary pointer-events-none">10</div>
                                <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 10</span>
                                <h3 className="text-2xl font-headline font-bold mb-4">Web Apps with Flask</h3>
                                <p className="text-on-surface-variant italic mb-6">"Bringing models to the world via the browser."</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-primary mb-2">Key Topics</h4>
                                        <ul className="text-sm space-y-1 text-on-surface-variant">
                                            <li>• Server-side Logic</li>
                                            <li>• HTML/CSS Templates</li>
                                            <li>• Integration of ML into Web</li>
                                        </ul>
                                    </div>
                                    <div className="bg-surface-container-high p-4 rounded-lg">
                                        <h4 className="text-xs font-bold uppercase text-secondary mb-1">Project / Milestone</h4>
                                        <p className="text-sm">AI-Powered Portfolio Site</p>
                                    </div>
                                </div>
                            </div>

                            {/* Week 11 & 12 */}
                            <div className="md:col-span-2 bg-gradient-to-br from-surface-container-low to-surface-container-high p-12 rounded-2xl border border-primary-container/20 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-12 opacity-10">
                                    <span className="material-symbols-outlined text-[200px]" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
                                </div>
                                <div className="max-w-2xl relative z-10">
                                    <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">Week 11 - 12</span>
                                    <h3 className="text-4xl font-headline font-black mb-6 text-primary">The Capstone Horizon</h3>
                                    <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                                        Students will spend the final two weeks building their master project: The Face Recognition Attendance System. This represents the ultimate synthesis of Python, OpenCV, and Flask.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">System Architecture</span>
                                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">UI/UX Design</span>
                                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">Final Debugging</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capstone Deep Dive */}
                <section className="px-8 py-24 bg-surface-container-lowest">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-on-surface-variant">Build a live system that opens the webcam, recognises student faces in real time, logs attendance automatically with timestamps and displays everything on a web dashboard. Every part of it written and built by you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-surface p-6 rounded-xl border border-outline-variant/10 text-center hover:bg-surface-bright transition-colors">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                                </div>
                                <h4 className="font-bold mb-2">Face Recognition Attendance System</h4>
                                <p className="text-sm text-on-surface-variant">Detects and identifies faces live using OpenCV and Dlib.</p>
                            </div>
                            <div className="bg-surface p-6 rounded-xl border border-outline-variant/10 text-center hover:bg-surface-bright transition-colors">
                                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-secondary text-3xl">terminal</span>
                                </div>
                                <h4 className="font-bold mb-2">Live Attendance Logger</h4>
                                <p className="text-sm text-on-surface-variant">Automatically records name and timestamp the moment a face is recognised.</p>
                            </div>
                            <div className="bg-surface p-6 rounded-xl border border-outline-variant/10 text-center hover:bg-surface-bright transition-colors">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-primary text-3xl">dashboard</span>
                                </div>
                                <h4 className="font-bold mb-2">Flask Web Dashboard</h4>
                                <p className="text-sm text-on-surface-variant">View and manage all attendance records from a clean browser interface.</p>
                            </div>
                            <div className="bg-surface p-6 rounded-xl border border-outline-variant/10 text-center hover:bg-surface-bright transition-colors">
                                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-secondary text-3xl">campaign</span>
                                </div>
                                <h4 className="font-bold mb-2">Demo Day</h4>
                                <p className="text-sm text-on-surface-variant">Live presentation to industry mentors and fellow students.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Certification Section */}
                <section className="px-8 py-24">
                    <div className="max-w-4xl mx-auto bg-surface-container-high rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
                        <div className="md:w-1/2 p-12 flex flex-col justify-center">
                            <h2 className="font-headline text-3xl font-extrabold mb-4">Luminescent Certification</h2>
                            <p className="text-on-surface-variant mb-6 leading-relaxed">
                                The "Programme Completion Certificate" isn't just a piece of paper. It represents hundreds of hours of coding, debugging, and innovation. It is awarded on Demo Day to those who successfully complete their Capstone project.
                            </p>
                            <div className="flex items-center gap-3 text-primary-container font-bold">
                                <span className="material-symbols-outlined">verified</span>
                                <span>Industry Verified Credential</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gradient-to-br from-primary-container/20 to-secondary/20 p-12 flex items-center justify-center relative">
                            {/* Abstract Certificate Representation */}
                            <div className="w-full aspect-[4/3] bg-surface-container-highest rounded-lg shadow-xl border border-white/10 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">star</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-on-surface-variant">LUMINESCENT ACADEMY</div>
                                        <div className="text-[8px] text-on-surface-variant/50">EST. 2024</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1 bg-outline-variant/30 w-1/3"></div>
                                    <div className="h-4 bg-primary/20 w-3/4 rounded"></div>
                                    <div className="h-1 bg-outline-variant/30 w-1/2"></div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="h-4 bg-outline-variant/30 w-24"></div>
                                    <div className="w-16 h-16 bg-primary-container/10 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="px-8 py-32 text-center bg-gradient-to-t from-primary/10 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-headline text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to build your child's AI future?</h2>
                        <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-5 rounded-xl font-headline font-black text-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all transform hover:-translate-y-1">
                            Enroll Today
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface w-full py-12 px-8 border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
                    <div className="text-lg font-bold text-primary font-headline">Luminescent Academy</div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-inter text-sm antialiased" href="#">Privacy Policy</a>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-inter text-sm antialiased" href={termsPDF} target="_blank" rel="noopener noreferrer">Terms of Service</a>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-inter text-sm antialiased" href="#">Research Labs</a>
                        <a className="text-on-surface-variant hover:text-secondary transition-colors duration-200 font-inter text-sm antialiased" href="#">Support</a>
                    </div>
                    <div className="text-on-surface-variant font-inter text-sm antialiased opacity-80">
                        © 2024 Luminescent Academy. Engineering the Future.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DetailedCurriculum;
