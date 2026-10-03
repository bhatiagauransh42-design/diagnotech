import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2, Stethoscope, AlertTriangle } from 'lucide-react';

const QUICK_QUESTIONS = [
  "What is HbA1c?",
  "What does high systolic BP mean?",
  "Healthy BMI ranges?",
  "Good vs bad cholesterol?"
];

export default function HealthAiAssistant({ backendUrl = '/api/v1', language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am Diagnotech’s Health Education Assistant. Ask me about clinical biomarkers (HbA1c, glucose, blood pressure, cholesterol, BMI) or lifestyle factors.',
      disclaimer: 'This educational assistant provides physiological explanations and reference ranges. It does not provide medical diagnoses or treatment plans.'
    }
  ]);

  const handleSend = async (questionText) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    // Add user question to thread
    const newMessages = [...messages, { role: 'user', text: q }];
    setMessages(newMessages);
    setInputQuestion('');
    setLoading(true);

    try {
      const endpoint = backendUrl.endsWith('/') ? `${backendUrl}ai/question` : `${backendUrl}/ai/question`;
      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, language })
        });
      } catch (netErr) {
        // Fallback to relative /api/v1/ai/question in case proxy is configured
        if (backendUrl.includes(':8000')) {
          res = await fetch('/api/v1/ai/question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q, language })
          });
        } else {
          throw netErr;
        }
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Assistant API error');
      }
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: data.response,
          provider: data.provider,
          disclaimer: data.disclaimer
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'The health education service is currently offline or unreachable. Please ensure the Diagnotech backend server is running (e.g. python run_server.py). For clinical reference, consult CDC or AHA guidelines.',
          disclaimer: 'Always consult a qualified physician for clinical concerns.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#FFFFFF',
            border: '2px solid #00E87E',
            borderRadius: '9999px',
            padding: '0.7rem 1.35rem',
            color: '#0F0F0F',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0, 232, 126, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease'
          }}
          id="ai-assistant-toggle-btn"
        >
          <Sparkles size={16} color="#00E87E" />
          <span>✦ AI Health Assistant</span>
        </button>
      )}

      {/* Floating Drawer Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 4rem)',
            zIndex: 1000,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#0F0F0F'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #E5E7EB',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={18} color="#0284C7" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F0F0F' }}>
                    AI Health Assistant
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    background: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                    Online
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                  Live OpenRouter AI • {language.toUpperCase()}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: '0.6rem 1rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              background: '#F1F5F9'
            }}
          >
            {QUICK_QUESTIONS.map((qq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qq)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.68rem',
                  color: '#334155',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {qq}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              background: '#FFFFFF'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div
                  style={{
                    padding: '0.65rem 0.95rem',
                    borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.role === 'user' ? '#0284C7' : '#F8FAFC',
                    border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
                    color: m.role === 'user' ? '#FFFFFF' : '#1E293B',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    boxShadow: m.role === 'user' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
                  }}
                >
                  {m.text}
                </div>
                {m.disclaimer && (
                  <span style={{ fontSize: '0.62rem', color: '#64748B', fontStyle: 'italic', paddingLeft: '4px' }}>
                    * {m.disclaimer}
                  </span>
                )}
                {m.provider && (
                  <span style={{ fontSize: '0.6rem', color: '#0284C7', fontWeight: 600, paddingLeft: '4px' }}>
                    ⚡ Powered by {m.provider.toUpperCase()}
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284C7', fontSize: '0.74rem', padding: '0.5rem' }}>
                <Loader2 size={14} className="spin-animation" />
                <span>AI analyzing question...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid #E5E7EB',
              background: '#F8FAFC',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Ask about HbA1c, BP, BMI..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              style={{
                flex: 1,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '9999px',
                padding: '0.45rem 0.9rem',
                color: '#0F0F0F',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              style={{
                background: '#00E87E',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#050811',
                cursor: loading || !inputQuestion.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !inputQuestion.trim() ? 0.5 : 1,
                boxShadow: '0 2px 6px rgba(0, 232, 126, 0.25)'
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
