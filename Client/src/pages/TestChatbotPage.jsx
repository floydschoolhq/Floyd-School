import React from 'react';
import Chatbot from '../components/Chatbot';

const TestChatbotPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e7eb 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#333' 
        }}>
          Thinkskool Website Test Page
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          This is a test page to verify the chatbot is working properly.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Expected Behavior:</h3>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Floating button should be visible in bottom-right corner</li>
              <li>Auto-popup after 4 seconds with greeting</li>
              <li>Chat window opens when button is clicked</li>
              <li>Messages appear with proper styling</li>
              <li>Quick reply buttons work</li>
            </ul>
          </div>
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            background: '#e0f2fe', 
            borderRadius: '8px',
            border: '1px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Current Status:</h3>
            <div id="chatbot-status" style={{ 
              padding: '12px', 
              background: '#fbbf24', 
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Checking chatbot Status...
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default TestChatbotPage;
