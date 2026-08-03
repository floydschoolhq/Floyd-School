import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', school: '', contact: '' });
  const [formError, setFormError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [userPath, setUserPath] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const pushBot = (text, btns) => {
    setMessages(prev => [...prev, { sender: 'bot', text, btns: btns || null, id: Math.random() }]);
  };

  const pushUser = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text, id: Math.random() }]);
  };

  const botReply = (text, btns, delay = 900) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushBot(text, btns);
    }, delay);
  };

  const handleBtn = (val, label) => {
    pushUser(label);

    if (step === 0) {
      setStep(1);
      botReply(
        'Hello \ud83d\udc4b Welcome to Floyd School\n\nWe help students build real technology projects like AI systems, apps, and smart devices \u2014 not just learn theory.\n\nWhat are you looking for today?',
        [
          { label: '\ud83e\udd16 AI & Machine Learning (Live)', val: 'ai' },
          { label: '\ud83c\udf10 Web Development', val: 'web' },
          { label: '\ud83d\udd10 Cybersecurity', val: 'cyber' },
          { label: '\u2699\ufe0f IoT & Robotics', val: 'iot' },
          { label: '\ud83e\udd14 Not Sure Yet', val: 'notsure' },
          { label: '\ud83c\udfeb School / Institution Partnership', val: 'school' },
        ]
      );
    } else if (step === 1) {
      if (val === 'ai') {
        setSelectedCourse('AI & Machine Learning');
        setUserPath('direct_ai');
        setStep(2);
        botReply(
          'Great choice! \ud83d\ude80\n\nOur AI & Machine Learning program is currently LIVE.\n\nStudents build real systems like:\n\u2022 AI Face Recognition System\n\u2022 Spam Detection Models\n\u2022 Computer Vision Applications\n\nHands-on learning, not theory.',
          [
            { label: '\ud83d\udccb View details', val: 'collect' },
            { label: '\ud83c\udf9e Book a demo', val: 'collect' },
            { label: '\ud83d\udcac Talk to a mentor', val: 'collect' },
          ]
        );
      } else if (val === 'web' || val === 'cyber' || val === 'iot') {
        setSelectedCourse(val === 'web' ? 'Web Development' : val === 'cyber' ? 'Cybersecurity' : 'IoT & Robotics');
        setUserPath('redirected_to_ai');
        setStep(2);
        botReply(
          "That's a great area to explore! \ud83c\udf1f\n\nThis program is not live yet \u2014 coming soon.\n\nMeanwhile, many students start with AI/ML to build strong foundations early.\n\nWould you like to explore our LIVE AI/ML program?",
          [
            { label: '\u2705 Yes, show me!', val: 'ai_redir' },
            { label: '\u274c Not now', val: 'collect' },
          ]
        );
      } else if (val === 'notsure') {
        setSelectedCourse('Not Sure');
        setUserPath('redirected_to_ai');
        setStep(2);
        botReply(
          'No problem at all! \ud83d\ude0a\n\nWhat would you like your child to gain?',
          [
            { label: '\ud83d\udee0 Build real projects', val: 'ai_redir' },
            { label: '\ud83d\ude80 Future-ready skills', val: 'ai_redir' },
            { label: '\ud83d\udd0d Just exploring', val: 'ai_redir' },
          ]
        );
      } else if (val === 'school') {
        setSelectedCourse('School Partnership');
        setUserPath('partnership_inquiry');
        setStep(2);
        botReply(
          "Got it \ud83d\udc4b\n\nYou're looking for our school partnership program.\n\nThis chat is for student enrollments.\n\nYou can find 'Partner With Us' section on the top menu of the landing page.",
          [
            { label: '\ud83d\udd17 Open that page', val: 'open_page' },
            { label: '\ud83e\udd1d Talk to our team', val: 'collect' },
          ]
        );
      }
    } else if (step === 2) {
      if (val === 'ai_redir') {
        setSelectedCourse('AI & Machine Learning');
        botReply(
          'Excellent! \ud83d\udd25\n\nOur AI & Machine Learning program is currently LIVE.\n\nStudents build real systems like:\n\u2022 AI Face Recognition System\n\u2022 Spam Detection Models\n\u2022 Computer Vision Applications',
          [
            { label: '\ud83d\udccb View details', val: 'collect' },
            { label: '\ud83c\udf9e Book a demo', val: 'collect' },
            { label: '\ud83d\udcac Talk to a mentor', val: 'collect' },
          ]
        );
      } else if (val === 'collect' || val === 'open_page') {
        setStep(4);
        botReply('To guide you better, could you share a few details? \ud83d\udcdd');
      }
    }
  };

  const handleFormSubmit = async () => {
    setFormError('');
    if (step === 4) {
      if (!formData.name.trim() || !formData.school.trim()) {
        setFormError('Please fill in both fields.');
        return;
      }
      pushUser('Name: ' + formData.name + ', School: ' + formData.school);
      setStep(5);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: "This is a great stage to start! \ud83c\udf1f\n\nStudents who begin early:\n\u2022 Build real projects\n\u2022 Improve problem-solving\n\u2022 Stay ahead in today's tech-driven world\n\nOur current AI/ML batch is LIVE with limited seats.",
            btns: null,
            id: Math.random(),
          },
        ]);
        setStep(6);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          pushBot('Where should we send the details?\n\nPlease share your WhatsApp number or email \ud83d\udcf2');
        }, 1200);
      }, 900);
    } else if (step === 6) {
      if (!formData.contact.trim()) {
        setFormError('Please provide a contact.');
        return;
      }
      
      // Save to MongoDB
      try {
        const payload = {
          studentName: formData.name || 'Not provided',
          schoolName: formData.school || 'Not provided',
          contactInfo: formData.contact,
          selectedCourse: selectedCourse || 'Not Sure',
          userPath: userPath || 'direct'
        };
        
        console.log('[Chatbot] Submitting lead:', payload);
        
        const response = await api.post('/chatbot/lead', payload);
        const data = response.data;
        
        console.log('[Chatbot] Response:', data);
        
        if (data.success) {
          console.log('[Chatbot] Lead saved:', data.data?._id);
        }
      } catch (error) {
        console.error('[Chatbot] Submission Error:', error.response?.data || error.message);
      }

      pushUser(formData.contact);
      setStep(7);
      botReply(
        'Perfect \ud83d\udc4d\n\nWe will send full details along with demo access shortly.\n\nOur team may also guide you personally.\n\n\u2728 Thank you for choosing Floyd School!'
      );
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setFormData({ name: '', school: '', contact: '' });
    setFormError('');
    setIsOpen(false);
  };

  const lastMsg = messages[messages.length - 1];
  const showBtns = lastMsg?.sender === 'bot' && lastMsg?.btns && !isTyping && step < 4;

  return (
    <>
      {/* Floating Chat Button */}
      <button
      onClick={() => {
        const opening = !isOpen;
        setIsOpen(opening);
        if (opening && messages.length === 0) {
          pushBot(
            'Hello \ud83d\udc4b\nConfused about which tech skill your child should start with?\nI can guide you in 30 seconds.',
            [{ label: '\u2705 Yes, guide me!', val: 'yes' }]
          );
        }
      }}
        className={`fixed z-50 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group ${
          isMobile 
            ? 'bottom-4 right-4 w-12 h-12 bg-black rounded-full' 
            : 'bottom-6 right-6 w-14 h-14 bg-black rounded-full'
        }`}
      >
        {isOpen ? (
          <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </button>

      {/* Chat Window */}
      <div className={`fixed z-40 rounded-3xl shadow-2xl border border-sky-500/20 transition-all duration-300 backdrop-blur-xl ${
        isMobile 
          ? 'bottom-20 left-2 right-2 w-[calc(100vw-1rem)] max-h-[70vh] bg-white/95' 
          : 'bottom-24 right-6 w-80 bg-white/95'
      } ${!isOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'}`}>
        {/* Header */}
        <div className={`bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-3xl flex items-center justify-between ${isMobile ? 'p-2' : 'p-4'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center ${isMobile ? '' : 'flex-shrink-0'}`}>
              <span className={`${isMobile ? 'text-xs' : 'text-lg'} text-white font-bold`}>{'\ud83e\udd16'}</span>
            </div>
            <div>
              <div className={`font-bold tracking-tight ${isMobile ? 'text-xs' : 'text-base'}`}>Floyd School AI</div>
              <div className={`text-[10px] ${isMobile ? 'text-sky-100' : 'text-sky-100'} flex items-center gap-1 uppercase font-black tracking-widest`}>
                <span className={`w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]`}></span>
                <span>Active Presence</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`hover:bg-white/20 rounded-lg transition-colors ${isMobile ? 'p-1' : 'p-2'}`}
          >
            <svg className={`text-white ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className={`overflow-y-auto space-y-2 ${isMobile ? 'p-2 h-[60vh] max-h-[400px]' : 'p-3 h-80'}`}>
          {messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-sky-100 order-2' : 'bg-gray-100'}`}>
                <span className="text-[8px]">
                  {m.sender === 'bot' ? '\ud83e\udd16' : '\ud83d\udc64'}
                </span>
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl ${isMobile ? 'text-xs' : 'text-sm'} ${m.sender === 'user' ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-none shadow-md shadow-sky-500/20' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className={`w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                <span className="text-[8px]">\ud83e\udd16</span>
              </div>
              <div className="bg-gray-100 text-gray-800 p-2 rounded-xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`border-t border-gray-200 ${isMobile ? 'p-2' : 'p-4'}`}>
          {/* Quick Reply Buttons */}
          {showBtns && (
            <div className={`grid gap-2 mb-2 ${isMobile ? 'grid-cols-2' : 'flex flex-wrap'}`}>
              {lastMsg.btns.map((b, bi) => (
                <button
                  key={bi}
                  onClick={() => handleBtn(b.val, b.label)}
                  className={`px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-bold border border-sky-100 transition-all duration-300 ${isMobile ? 'text-[10px]' : 'text-xs'} hover:shadow-sm hover:scale-[1.02]`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {/* Form Inputs */}
          {step === 4 && (
            <div className={`space-y-2 ${isMobile ? 'space-y-1' : ''}`}>
              <input
                type="text"
                placeholder="Student Name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all ${isMobile ? 'text-xs' : 'text-sm'}`}
              />
              <input
                type="text"
                placeholder="School Name"
                value={formData.school}
                onChange={e => setFormData(p => ({ ...p, school: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all ${isMobile ? 'text-xs' : 'text-sm'}`}
              />
              {formError && <div className={`text-rose-500 mt-1 font-bold ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{formError}</div>}
              <button
                onClick={handleFormSubmit}
                className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-sky-500/20 active:scale-95 ${isMobile ? 'text-[10px] py-3' : 'text-xs py-3.5'}`}
              >
                Continue
              </button>
            </div>
          )}

          {step === 6 && (
            <div className={`space-y-2 ${isMobile ? 'space-y-1' : ''}`}>
              <input
                type="text"
                placeholder="WhatsApp number or Email"
                value={formData.contact}
                onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all ${isMobile ? 'text-xs' : 'text-sm'}`}
              />
              {formError && <div className={`text-rose-500 mt-1 font-bold ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{formError}</div>}
              <button
                onClick={handleFormSubmit}
                className={`w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-sky-500/20 active:scale-95 ${isMobile ? 'text-[10px] py-3' : 'text-xs py-3.5'}`}
              >
                Send Details
              </button>
            </div>
          )}

          {step === 7 && (
            <div className={`text-center py-2 ${isMobile ? 'py-1' : ''}`}>
              <div className={`text-green-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>You are all set!</div>
            </div>
          )}

          {/* Reset Button */}
          <div className={`flex justify-between items-center ${isMobile ? 'mt-1' : 'mt-3'}`}>
            <button
              onClick={resetChat}
              className={`text-gray-400 hover:text-gray-600 transition-colors ${isMobile ? 'text-[10px]' : 'text-xs'}`}
            >
              Start over
            </button>
            <div className={`text-gray-400 text-xs ${isMobile ? 'text-[10px]' : ''}`}>Floyd School</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
