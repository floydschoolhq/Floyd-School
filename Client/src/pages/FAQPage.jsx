import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';
import SEO from '../components/common/SEO';

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('students');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'schools', label: 'For Schools' },
    { id: 'students', label: 'For Students' },
    { id: 'programs', label: 'Programs' },
    { id: 'logistics', label: 'Logistics' },
  ];

  const faqs = [
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
  ];

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await api.post('/leads', {
        ...formData,
        source: 'faq_page',
        type: 'query'
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <SEO 
          title="Frequently Asked Questions" 
          description="Find answers to common questions about Thinkskool's industrial tech programs, school partnerships, student portal, and more."
      />
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-base">← Back</span>
          </button>
          <div className="font-bold text-lg">
            <span className="text-blue-500">think</span>
            <span className="text-orange-500">skool</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          Frequently Asked Questions
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-lg text-base transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-slate-400 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-base font-medium text-white/80 pr-4">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 ${openIndex === index ? 'text-white' : 'text-slate-500'}`}>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 text-base text-slate-500 leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          {!showForm ? (
            <div className="text-center">
              <p className="text-base text-slate-500 mb-4">
                Still have questions?
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3.5 bg-white/10 border border-white/10 text-white rounded-xl font-medium text-base hover:bg-white/20 transition-all"
              >
                Contact Support
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-6"
            >
              <h3 className="text-xl font-medium text-white mb-6">Send us a message</h3>
              <AnimatePresence>
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center"
                  >
                    <p className="text-white font-medium">Message sent!</p>
                    <p className="text-base text-slate-500 mt-1">We will get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-base text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-base text-white placeholder-slate-500 ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-base text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-base text-white placeholder-slate-500 ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-base text-slate-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-base text-white placeholder-slate-500 ${
                          errors.phone ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="1234567890"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-base text-slate-400 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-base text-white placeholder-slate-500 resize-none"
                        placeholder="Your question..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 py-3 border border-white/10 text-slate-400 rounded-lg text-base hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-white text-black rounded-lg text-base font-medium hover:bg-slate-100 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
