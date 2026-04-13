import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({ name: '', school: '', contact: '' });
  const [formError, setFormError] = useState('');
  const messagesEndRef = useRef(null);

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
        'Hello \uD83D\uDC4B Welcome to ThinkSkool\n\nWe help students build real technology projects like AI systems, apps, and smart devices \u2014 not just learn theory.\n\nWhat are you looking for today?',
        [
          { label: '\uD83E\uDD16 AI & Machine Learning (Live)', val: 'ai' },
          { label: '\uD83C\uDF10 Web Development', val: 'web' },
          { label: '\uD83D\uDD10 Cybersecurity', val: 'cyber' },
          { label: '\u2699\uFE0F IoT & Robotics', val: 'iot' },
          { label: '\uD83E\uDD14 Not Sure Yet', val: 'notsure' },
          { label: '\uD83C\uDFEB School / Institution Partnership', val: 'school' },
        ]
      );
    } else if (step === 1) {
      if (val === 'ai') {
        setStep(2);
        botReply(
          'Great choice! \uD83D\uDE80\n\nOur AI & Machine Learning program is currently LIVE.\n\nStudents build real systems like:\n\u2022 AI Face Recognition System\n\u2022 Spam Detection Models\n\u2022 Computer Vision Applications\n\nHands-on learning, not theory.',
          [
            { label: '\uD83D\uDCCB View details', val: 'collect' },
            { label: '\uD83C\uDF9E Book a demo', val: 'collect' },
            { label: '\uD83D\uDCAC Talk to a mentor', val: 'collect' },
          ]
        );
      } else if (val === 'web' || val === 'cyber' || val === 'iot') {
        setStep(2);
        botReply(
          "That's a great area to explore! \uD83C\uDF1F\n\nThis program is not live yet \u2014 coming soon.\n\nMeanwhile, many students start with AI/ML to build strong foundations early.\n\nWould you like to explore our LIVE AI/ML program?",
          [
            { label: '\u2705 Yes, show me!', val: 'ai_redir' },
            { label: '\u274C Not now', val: 'collect' },
          ]
        );
      } else if (val === 'notsure') {
        setStep(2);
        botReply(
          'No problem at all! \uD83D\uDE0A\n\nWhat would you like your child to gain?',
          [
            { label: '\uD83D\uDEE0 Build real projects', val: 'ai_redir' },
            { label: '\uD83D\uDE80 Future-ready skills', val: 'ai_redir' },
            { label: '\uD83D\uDD0D Just exploring', val: 'ai_redir' },
          ]
        );
      } else if (val === 'school') {
        setStep(2);
        botReply(
          "Got it \uD83D\uDC4B\n\nYou're looking for our school partnership program.\n\nThis chat is for student enrollments.\n\nYou can find the 'Partner With Us' section on the top menu of the landing page.",
          [
            { label: '\uD83D\uDD17 Open that page', val: 'open_page' },
            { label: '\uD83E\uDD1D Talk to our team', val: 'collect' },
          ]
        );
      }
    } else if (step === 2) {
      if (val === 'ai_redir') {
        botReply(
          'Excellent! \uD83D\uDD25\n\nOur AI & Machine Learning program is currently LIVE.\n\nStudents build real systems like:\n\u2022 AI Face Recognition System\n\u2022 Spam Detection Models\n\u2022 Computer Vision Applications',
          [
            { label: '\uD83D\uDCCB View details', val: 'collect' },
            { label: '\uD83C\uDF9E Book a demo', val: 'collect' },
            { label: '\uD83D\uDCAC Talk to a mentor', val: 'collect' },
          ]
        );
      } else if (val === 'collect' || val === 'open_page') {
        setStep(4);
        botReply('To guide you better, could you share a few details? \uD83D\uDCDD');
      }
    }
  };

  const handleFormSubmit = () => {
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
            text: "This is a great stage to start! \uD83C\uDF1F\n\nStudents who begin early:\n\u2022 Build real projects\n\u2022 Improve problem-solving\n\u2022 Stay ahead in today's tech-driven world\n\nOur current AI/ML batch is LIVE with limited seats.",
            btns: null,
            id: Math.random(),
          },
        ]);
        setStep(6);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          pushBot('Where should we send the details?\n\nPlease share your WhatsApp number or email \uD83D\uDCF2');
        }, 1200);
      }, 900);
    } else if (step === 6) {
      if (!formData.contact.trim()) {
        setFormError('Please provide a contact.');
        return;
      }
      pushUser(formData.contact);
      setStep(7);
      botReply(
        'Perfect \uD83D\uDC4D\n\nWe will send full details along with demo access shortly.\n\nOur team may also guide you personally.\n\n\u2728 Thank you for choosing ThinkSkool!'
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .ts * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ts-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #7B61FF, #6EF9C0);
          border: none; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(123,97,255,0.4);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ts-fab:hover { transform: scale(1.1); }
        .ts-fab svg { width: 24px; height: 24px; stroke: #0D0F14; fill: none; }
        .ts-badge {
          position: absolute; top: -2px; right: -2px;
          width: 13px; height: 13px; background: #FF6B6B;
          border-radius: 50%; border: 2px solid #f5f5f5;
          animation: ts-pulse 2s infinite;
        }
        @keyframes ts-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        .ts-win {
          position: fixed; bottom: 92px; right: 24px; z-index: 9998;
          width: 380px; background: #0D0F14;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(110,249,192,0.08);
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .ts-win.closed { transform: scale(0.72) translateY(18px); opacity: 0; pointer-events: none; }
        .ts-hdr {
          background: #16191F; padding: 13px 15px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .ts-hdr-l { display: flex; align-items: center; gap: 10px; }
        .ts-av {
          width: 35px; height: 35px;
          background: linear-gradient(135deg, #7B61FF, #6EF9C0);
          border-radius: 10px; font-size: 16px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ts-hdr-name { font-weight: 600; font-size: 13.5px; color: #F0F2F5; }
        .ts-hdr-status { font-size: 11px; color: #6EF9C0; display: flex; align-items: center; gap: 4px; }
        .ts-dot { width: 6px; height: 6px; background: #6EF9C0; border-radius: 50%; animation: ts-blink 2s infinite; }
        @keyframes ts-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ts-xbtn {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 7px;
          cursor: pointer; color: #8B8FA8;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .ts-xbtn:hover { background: rgba(255,255,255,0.1); color: #F0F2F5; }
        .ts-xbtn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; }
        .ts-body {
          height: 355px; overflow-y: auto; padding: 13px;
          display: flex; flex-direction: column; gap: 9px;
          scrollbar-width: thin; scrollbar-color: rgba(110,249,192,0.15) transparent;
        }
        .ts-body::-webkit-scrollbar { width: 3px; }
        .ts-body::-webkit-scrollbar-thumb { background: rgba(110,249,192,0.18); border-radius: 4px; }
        .ts-msg { display: flex; gap: 7px; animation: ts-fi 0.25s ease; }
        @keyframes ts-fi { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:none} }
        .ts-msg.user { flex-direction: row-reverse; }
        .ts-mav {
          width: 26px; height: 26px;
          background: linear-gradient(135deg, #7B61FF, #6EF9C0);
          border-radius: 8px; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; align-self: flex-end;
        }
        .ts-msg.user .ts-mav { background: linear-gradient(135deg, #FF6B6B, #FFB347); }
        .ts-bub {
          max-width: 82%; padding: 9px 12px;
          border-radius: 13px; font-size: 13px; line-height: 1.55;
          white-space: pre-line;
        }
        .ts-bub.bot {
          background: #1E2230; color: #F0F2F5;
          border: 1px solid rgba(255,255,255,0.07); border-bottom-left-radius: 4px;
        }
        .ts-bub.user {
          background: linear-gradient(135deg, #7B61FF, #6EF9C0);
          color: #0D0F14; font-weight: 600; border-bottom-right-radius: 4px;
        }
        .ts-qrs { display: flex; flex-wrap: wrap; gap: 5px; padding-left: 33px; margin-top: 5px; }
        .ts-qr {
          padding: 6px 11px; background: rgba(123,97,255,0.1);
          border: 1px solid rgba(123,97,255,0.3); border-radius: 18px;
          color: #C4B8FF; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.18s; white-space: nowrap;
        }
        .ts-qr:hover { background: rgba(123,97,255,0.25); color: #F0F2F5; transform: translateY(-1px); }
        .ts-typ { display: flex; gap: 7px; animation: ts-fi 0.25s ease; }
        .ts-typ-bub {
          background: #1E2230; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px; border-bottom-left-radius: 4px;
          padding: 10px 12px; display: flex; gap: 4px;
        }
        .ts-d { width: 6px; height: 6px; background: #8B8FA8; border-radius: 50%; animation: ts-bo 1.2s infinite; }
        .ts-d:nth-child(2){animation-delay:0.15s}.ts-d:nth-child(3){animation-delay:0.3s}
        @keyframes ts-bo{0%,80%,100%{transform:translateY(0);opacity:0.5}40%{transform:translateY(-5px);opacity:1}}
        .ts-ftr { padding: 11px 13px; border-top: 1px solid rgba(255,255,255,0.07); background: #16191F; }
        .ts-inp {
          width: 100%; background: #0D0F14;
          border: 1px solid rgba(255,255,255,0.07); border-radius: 9px;
          color: #F0F2F5; padding: 9px 12px; font-size: 13px; outline: none;
          margin-bottom: 7px; transition: border-color 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ts-inp:focus { border-color: rgba(110,249,192,0.4); }
        .ts-inp::placeholder { color: #8B8FA8; }
        .ts-sub {
          width: 100%; background: linear-gradient(135deg, #7B61FF, #6EF9C0);
          border: none; border-radius: 9px; color: #0D0F14;
          padding: 9px; font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.2s;
        }
        .ts-sub:hover { opacity: 0.88; }
        .ts-err { color: #FF6B6B; font-size: 11.5px; margin: -4px 0 6px; }
        .ts-done { text-align: center; padding: 6px 0; color: #6EF9C0; font-size: 13px; font-weight: 600; }
        .ts-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .ts-rst { background: none; border: none; color: #8B8FA8; font-size: 11px; cursor: pointer; transition: color 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ts-rst:hover { color: #FF6B6B; }
        .ts-brand { font-size: 11px; color: #8B8FA8; }
        .ts-brand span { color: #6EF9C0; }
      `}</style>

      <div className="ts">
        <button className="ts-fab" onClick={() => setIsOpen(o => !o)}>
          {isOpen ? (
            <svg viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          <span className="ts-badge" />
        </button>

        <div className={`ts-win${isOpen ? '' : ' closed'}`}>
          <div className="ts-hdr">
            <div className="ts-hdr-l">
              <div className="ts-av">{'\uD83E\uDD16'}</div>
              <div>
                <div className="ts-hdr-name">ThinkSkool Assistant</div>
                <div className="ts-hdr-status">
                  <span className="ts-dot" />
                  Online &middot; Replies instantly
                </div>
              </div>
            </div>
            <button className="ts-xbtn" onClick={() => setIsOpen(false)}>
              <svg viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="ts-body">
            {messages.map((m, i) => (
              <div key={m.id || i}>
                <div className={`ts-msg ${m.sender}`}>
                  <div className="ts-mav">{m.sender === 'bot' ? '\uD83E\uDD16' : '\uD83D\uDC64'}</div>
                  <div className={`ts-bub ${m.sender}`}>{m.text}</div>
                </div>
                {showBtns && i === messages.length - 1 && (
                  <div className="ts-qrs">
                    {m.btns.map((b, bi) => (
                      <button key={bi} className="ts-qr" onClick={() => handleBtn(b.val, b.label)}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="ts-typ">
                <div className="ts-mav">{'\uD83E\uDD16'}</div>
                <div className="ts-typ-bub">
                  <div className="ts-d" />
                  <div className="ts-d" />
                  <div className="ts-d" />
                </div>
              </div>
            )}
            {step === 6 && (
              <>
                <input
                  className="ts-inp"
                  placeholder="WhatsApp number or Email"
                  value={formData.contact}
                  onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleFormSubmit()}
                />
                {formError && <div className="ts-err">{formError}</div>}
                <button className="ts-sub" onClick={handleFormSubmit}>Send Details</button>
              </>
            )}
            {step === 7 && (
              <div className="ts-done">You are all set! We will be in touch soon.</div>
            )}
            <div className="ts-bar">
              <button className="ts-rst" onClick={resetChat}>Start over</button>
              <div className="ts-brand">Powered by <span>ThinkSkool</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;