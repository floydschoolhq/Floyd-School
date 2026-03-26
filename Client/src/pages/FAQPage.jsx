import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  HelpCircle,
  School,
  Users,
  BookOpen,
  Clock,
  Award,
  Laptop,
  Phone
} from 'lucide-react';

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'schools', label: 'For Schools', icon: School },
    { id: 'students', label: 'For Students', icon: Users },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'logistics', label: 'Logistics', icon: Clock },
  ];

  const faqs = [
    // For Schools
    {
      question: "What does thinkskool need from our school to get started?",
      answer: "We only need a classroom or lab space with basic infrastructure like electricity and internet. We bring our own mentors, equipment, and curriculum. No additional staff or technical setup is required from your side.",
      category: 'schools'
    },
    {
      question: "Is there any cost to the school for the trial bootcamp?",
      answer: "No, the 7-day trial bootcamp is completely free for schools. There are no hidden charges or commitments required. You can evaluate our teaching methodology and student response before making any decision.",
      category: 'schools'
    },
    {
      question: "How do you handle scheduling with our existing academic calendar?",
      answer: "We work closely with your administration to map our sessions to your existing schedule. Classes can be arranged during zero periods, after school hours, or within dedicated technology periods. We ensure zero disruption to your regular academic flow.",
      category: 'schools'
    },
    {
      question: "What kind of reporting do you provide to school administrators?",
      answer: "Schools receive a comprehensive admin dashboard showing real-time attendance, student progress, assessment scores, and engagement metrics. We also provide monthly reports and semester-end certifications for all participating students.",
      category: 'schools'
    },
    {
      question: "Are your instructors industry professionals or school teachers?",
      answer: "Our instructors are active industry professionals and experienced engineers who bring real-world context into the classroom. They are not traditional school teachers but practitioners who work in technology companies and bring current industry knowledge, tools, and practices to students.",
      category: 'schools'
    },
    
    // For Students
    {
      question: "Do students need prior coding experience to join?",
      answer: "No prior experience is required for most of our programs. We start from fundamentals and gradually build up to advanced concepts. Our curriculum is designed to be accessible to beginners while challenging for those with some background.",
      category: 'students'
    },
    {
      question: "What certification do students receive upon completion?",
      answer: "Students receive an industry-recognized thinkskool certification that is verified by our tech partners. This certification includes their project portfolio, skill assessments, and can be showcased on LinkedIn and resumes.",
      category: 'students'
    },
    {
      question: "Are session recordings available for students who miss classes?",
      answer: "Yes, every live session is recorded and made available to students through their personal dashboard. They have lifetime access to revisit classes, review concepts, and catch up on missed content.",
      category: 'students'
    },
    {
      question: "How do students get help with doubts outside of class hours?",
      answer: "Students have access to our doubt resolution system where they can post questions and receive responses from mentors. We also offer scheduled 1-on-1 mentoring sessions and peer community support.",
      category: 'students'
    },
    {
      question: "What kind of projects will students build?",
      answer: "Students build real-world projects based on their chosen track. For example: AI students create predictive models and chatbots; Web Development students build full-stack applications; Cybersecurity students design secure systems; IoT students create smart devices. All projects go into their professional portfolio.",
      category: 'students'
    },

    // Programs
    {
      question: "What technology domains do you offer?",
      answer: "We offer four core technology tracks: 1) AI & Machine Learning - covering neural networks, computer vision, and predictive modeling; 2) Web Development - full-stack with React, Node.js, and cloud deployment; 3) Cybersecurity - ethical hacking, network protection, and threat analysis; 4) IoT & Robotics - hardware integration, embedded systems, and autonomous devices.",
      category: 'programs'
    },
    {
      question: "How long is the full program?",
      answer: "The full program runs for 4 months, with classes typically held 2-3 times per week. The program includes the initial demo bootcamp, domain selection, intensive learning phase, and culminates in a national hackathon.",
      category: 'programs'
    },
    {
      question: "What is the national hackathon?",
      answer: "The national hackathon is a culminating event where students from all our partner schools compete to build and showcase their projects. It provides exposure to industry judges, networking opportunities, and recognition at a national level.",
      category: 'programs'
    },
    {
      question: "Can students switch domains after starting?",
      answer: "Yes, within the first two weeks students can switch to a different technology track after consultation with our mentors. We want to ensure every student is in the domain that best matches their interests and aptitude.",
      category: 'programs'
    },

    // Logistics
    {
      question: "What are the typical batch timings?",
      answer: "We offer flexible scheduling including: morning batches (before school), afternoon batches (after school), and weekend intensive programs. Exact timings are determined in consultation with the school administration.",
      category: 'logistics'
    },
    {
      question: "How many students can be accommodated in one batch?",
      answer: "Our batches typically have 20-30 students to ensure personalized attention and effective hands-on learning. For larger schools, we can run multiple parallel batches.",
      category: 'logistics'
    },
    {
      question: "What equipment do students need to bring?",
      answer: "Students need to bring only a laptop. We provide all specialized hardware required for specific tracks (like IoT kits, robotics components). Schools with computer labs can also use existing machines.",
      category: 'logistics'
    },
    {
      question: "What kind of hardware and software resources do you provide?",
      answer: "We provide all necessary software licenses, cloud-based development environments, learning management systems, and specialized hardware like IoT kits, robotics components, and microcontrollers. Students only need to bring a basic laptop. Schools don't need to invest in any additional infrastructure or equipment.",
      category: 'logistics'
    },
    {
      question: "How quickly can you start after we express interest?",
      answer: "Once you submit the partnership form, our regional head will contact you within 24 hours. We can typically launch the free trial bootcamp within 1-2 weeks of initial contact, depending on your school's schedule.",
      category: 'logistics'
    },
    {
      question: "How does thinkskool integrate with our existing school curriculum?",
      answer: "Our curriculum is designed to complement your existing academic structure. We align our modules with school physics and math syllabus where possible, and schedule sessions during zero periods, after school hours, or dedicated technology periods. We ensure zero disruption to your regular academic flow while enhancing your school's technology education offering.",
      category: 'schools'
    },
    {
      question: "Is there any cost to the school for the partnership?",
      answer: "The initial 7-day trial bootcamp is completely free with no hidden charges. For continued partnership, we offer flexible pricing models that are structured per student. There are no upfront infrastructure costs or hidden fees for the school. Contact us for a customized quote based on your specific requirements.",
      category: 'schools'
    },
    {
      question: "How do you measure student progress and success?",
      answer: "We track student progress through multiple metrics including project completion rates, assessment scores, attendance, and engagement levels. Schools receive detailed analytics through an admin dashboard showing individual and batch performance. Students also build a portfolio of real projects that demonstrates their practical skills.",
      category: 'schools'
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isMobile = window.innerWidth < 768; // Simple mobile check for FAQPage

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-['Outfit']">
        {/* Mobile Navigation */}
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400">
              <ArrowLeft size={24} />
            </button>
            <div className="font-black text-lg tracking-tighter">
              <span className="text-blue-500">THINK</span>
              <span className="text-orange-500">SKOOL</span>
            </div>
          </div>
        </nav>

        {/* Mobile Hero */}
        <div className="px-6 pt-12 pb-8">
           <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <HelpCircle size={14} />
              Support
           </div>
           <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">
              FAQ<span className="text-blue-500">.</span>
           </h1>
           <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Find answers to common questions about our programs and partnerships.
           </p>
        </div>

        {/* Mobile Categories */}
        <div className="px-6 mb-8 overflow-x-auto scrollbar-hide py-2">
           <div className="flex gap-2 w-max">
             {categories.map((cat) => {
               const Icon = cat.icon;
               const isActive = activeCategory === cat.id;
               return (
                 <button 
                   key={cat.id} 
                   onClick={() => setActiveCategory(cat.id)}
                   className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                     isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-500 border border-white/5'
                   }`}
                 >
                   <Icon size={14} />
                   {cat.label}
                 </button>
               );
             })}
           </div>
        </div>

        {/* Mobile FAQ List */}
        <div className="px-6 space-y-4 pb-12">
           {filteredFaqs.map((faq, index) => (
             <div key={index} className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-sm font-black uppercase tracking-tight pr-4 leading-tight">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    openIndex === index ? 'bg-blue-600' : 'bg-slate-800'
                  }`}>
                     {openIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 pt-2 text-slate-400 text-[13px] font-medium leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Mobile Contact */}
        <div className="px-6 pb-20">
           <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] p-8 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Phone size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Still Stuck?</h3>
              <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Our support team is ready to help you with any custom queries.</p>
              <button 
                 onClick={() => navigate('/contact')}
                 className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
              >
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-['Outfit']">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <div className="font-black text-xl tracking-tighter uppercase">
            <span className="text-blue-500">think</span>
            <span className="text-orange-500">skool</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[11px] font-black uppercase tracking-[0.3em] mb-8">
              <HelpCircle size={16} />
              <span>Help Center</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
              FREQUENTLY ASKED <span className="text-blue-500">QUESTIONS</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Everything you need to know about our school partnerships, technology tracks, and how we're reshaping education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 scale-105'
                      : 'bg-slate-900/50 text-slate-500 hover:bg-slate-900 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/20 transition-all duration-500"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-8 text-left"
                >
                  <span className="text-lg font-black uppercase tracking-tight text-white pr-8 leading-tight group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    openIndex === index 
                      ? 'bg-blue-600 text-white rotate-180' 
                      : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                  }`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-8 pb-8 text-slate-400 font-medium leading-relaxed border-t border-white/5 pt-6 text-[15px]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/5 via-slate-900/50 to-purple-600/5 border border-white/5 rounded-[3rem] p-12 text-center group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                  <Phone size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                  STILL HAVE <span className="text-blue-500">QUESTIONS?</span>
                </h3>
                <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
                  Can't find what you're looking for? Our elite support team is standing by to help you with your technological journey.
                </p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/20 hover:-translate-y-1 active:scale-95"
                >
                  Contact Support
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} THINKSKOOL. ENGINEERED FOR THE FUTURE.
          </p>
        </div>
      </footer>
    </div>
  );
};


export default FAQPage;
