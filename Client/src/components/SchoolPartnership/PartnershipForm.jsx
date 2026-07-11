import { useState } from 'react';
import api from '../../api/axios';

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    contactPerson: "",
    designation: "",
    phone: "",
    city: "",
    domain: "Foundations of Web Development",
    students: "",
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.schoolName || !formData.contactPerson || !formData.phone) {
      alert('Please fill in all required fields (School Name, Contact Person, and Phone Number)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/school-partnership/lead', formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          schoolName: "",
          contactPerson: "",
          designation: "",
          phone: "",
          city: "",
          domain: "Foundations of Web Development",
          students: "",
          requirements: "",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="partner-form" className="py-16 md:py-24 px-4 sm:px-6 bg-[#050508] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Mobile */}
        <div className="md:hidden text-center mb-12">
          <span className="inline-block px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Get Started
          </span>
          <h2 className="text-2xl font-black text-white leading-tight mb-3">
            Start Your Institutional Journey
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Bring Floyd School to your campus. Fill out the form, and our regional head will contact you within 24 hours.
          </p>
        </div>

        {/* Section Header - Desktop */}
        <div className="hidden md:block text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Partnership Inquiry
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Let's Build This Together.
            <br />
            <span className="text-blue-400">Start Here.</span>
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Bring Floyd School to your campus. Fill out the form, and our regional head will contact you within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-5">
              {/* Left Side - Info */}
              <div className="lg:col-span-2 bg-gradient-to-br from-orange-400 via-blue-500 to-purple-600 p-6 sm:p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-8">Quick Info</h3>
                
                {/* Info Cards */}
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'For Schools', value: 'Classes 7 – 12' },
                    { label: 'Batch Size', value: '25 – 100+ Students' },
                    { label: 'Response Time', value: 'Within 24 Hours' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Contact Channels */}
                <div className="space-y-4 pt-6 border-t border-white/20">
                  <h4 className="text-lg font-bold text-white mb-4">Contact Channels</h4>
                  <div className="space-y-3">
                    <a href="tel:+91-8368801220" className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-medium">+91-8368801220</span>
                    </a>
                    <a href="mailto:floydschoolhq@gmail.com" className="flex items-start gap-3 text-white hover:text-blue-200 transition-colors">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-sm break-all">floydschoolhq@gmail.com</span>
                    </a>
                    <a href="https://instagram.com/thinkskool.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span className="font-medium">@floydschool.in</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="lg:col-span-3 p-6 md:p-12 bg-white">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Thank You!</h3>
                    <p className="text-slate-600 mb-6 max-w-md">
                      Your partnership request has been submitted successfully. Our team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">School Name *</label>
                        <input 
                          name="schoolName" 
                          type="text" 
                          value={formData.schoolName} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Enter your school name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Contact Person *</label>
                        <input 
                          name="contactPerson" 
                          type="text" 
                          value={formData.contactPerson} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Contact person name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Designation</label>
                        <input 
                          name="designation" 
                          type="text" 
                          value={formData.designation} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Your designation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Phone Number *</label>
                        <input 
                          name="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Phone number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">City</label>
                        <input 
                          name="city" 
                          type="text" 
                          value={formData.city} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Your city"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Preferred Domain</label>
                        <select 
                          name="domain" 
                          value={formData.domain} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                        >
                          <option value="Foundations of Web Development">Foundations of Web Development</option>
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="IoT & Robotics">IoT & Robotics</option>
                          <option value="Custom Curriculum">Custom Curriculum</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Approx. Students</label>
                        <input 
                          name="students" 
                          type="number" 
                          value={formData.students} 
                          onChange={handleChange} 
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400" 
                          placeholder="Number of students"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Specific Requirements</label>
                        <textarea 
                          name="requirements" 
                          value={formData.requirements} 
                          onChange={handleChange} 
                          rows="4"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400 resize-none" 
                          placeholder="Any specific requirements or questions..."
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-400 via-blue-500 to-purple-600 text-white font-bold rounded-xl p-4 hover:from-orange-500 hover:via-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : (
                        <>
                          Submit Partnership Request
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                      We respond within 24 hours of submission.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipForm;
