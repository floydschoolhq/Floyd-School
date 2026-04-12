import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const [formData, setFormData] = useState({ name: '', school: '', contact: '' });
  const [formError, setFormError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [userPath, setUserPath] = useState('');
  const messagesEndRef = useRef(null);

  // Only show chatbot on home page
  if (location.pathname !== '/') {
    return null;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!autoTriggered) {
      const t = setTimeout(() => {
        setAutoTriggered(true);
        setIsOpen(true);
        pushBot(
          'Hello \ud83d\udc4b\nConfused about which tech skill your child should start with?\nI can guide you in 30 seconds.',
          [{ label: '\u2705 Yes, guide me!', val: 'yes' }]
        );
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [autoTriggered]);

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
        'Hello \ud83d\udc4b Welcome to ThinkSkool\n\nWe help students build real technology projects like AI systems, apps, and smart devices \u2014 not just learn theory.\n\nWhat are you looking for today?',
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
        const response = await fetch('/api/chatbot/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName: formData.name,
            schoolName: formData.school,
            contactInfo: formData.contact,
            selectedCourse: selectedCourse,
            userPath: userPath
          }),
        });

        if (response.ok) {
          console.log('Chatbot lead saved successfully');
        } else {
          console.error('Failed to save chatbot lead');
        }
      } catch (error) {
        console.error('Error saving chatbot lead:', error);
      }

      pushUser(formData.contact);
      setStep(7);
      botReply(
        'Perfect \ud83d\udc4d\n\nWe will send full details along with demo access shortly.\n\nOur team may also guide you personally.\n\n\u2728 Thank you for choosing ThinkSkool!'
      );
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setFormData({ name: '', school: '', contact: '' });
    setFormError('');
    setAutoTriggered(false);
    setIsOpen(false);
  };

  const lastMsg = messages[messages.length - 1];
  const showBtns = lastMsg?.sender === 'bot' && lastMsg?.btns && !isTyping && step < 4;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group"
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 right-4 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 ${!isOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-500 text-sm font-bold">🤖</span>
            </div>
            <div>
              <div className="font-semibold text-sm">ThinkSkool Assistant</div>
              <div className="text-xs text-orange-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                Online • Ready to help
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-3 space-y-2">
          {messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-orange-200 order-2' : 'bg-gray-100'}`}>
                <span className="text-xs">
                  {m.sender === 'bot' ? '🤖' : '👤'}
                </span>
              </div>
              <div className={`max-w-[75%] p-2 rounded-xl text-sm ${m.sender === 'user' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">🤖</span>
              </div>
              <div className="bg-gray-100 text-gray-800 p-2 rounded-xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-200">
          {/* Quick Reply Buttons */}
          {showBtns && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {lastMsg.btns.map((b, bi) => (
                <button
                  key={bi}
                  onClick={() => handleBtn(b.val, b.label)}
                  className="px-2 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {/* Form Inputs */}
          {step === 4 && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Student Name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="text"
                placeholder="School Name"
                value={formData.school}
                onChange={e => setFormData(p => ({ ...p, school: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              {formError && <div className="text-red-500 text-xs mt-1">{formError}</div>}
              <button
                onClick={handleFormSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg py-2 font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-sm"
              >
                Continue
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="WhatsApp number or Email"
                value={formData.contact}
                onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              {formError && <div className="text-red-500 text-xs mt-1">{formError}</div>}
              <button
                onClick={handleFormSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg py-2 font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-sm"
              >
                Send Details
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="text-center py-3">
              <div className="text-green-600 font-medium text-sm">✅ You are all set! We will be in touch soon.</div>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={resetChat}
              className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
            >
              Start over
            </button>
            <div className="text-gray-400 text-xs">Powered by <span className="text-orange-500">ThinkSkool</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;