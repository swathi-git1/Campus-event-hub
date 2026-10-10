import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/apiClient'
import { useToast } from '../context/ToastContext'
import './AIAssistant.css'

export default function AIAssistant() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [ttsEnabled, setTtsEnabled] = useState(false)

  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const role = user?.role || 'student'
  const roleDisplay = 
    role === 'faculty_od' ? 'OD In-Charge' :
    role === 'instructor' ? 'Club Advisor' :
    role === 'admin' ? 'Super Admin' : 'Student Scholar'

  // Initialize initial greeting when opened
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = 
        role === 'faculty_od'
          ? `Hello Professor. I am synced with your OD clearance queue. Ask me about pending passes, verification stats, or daily audits.`
          : role === 'instructor'
          ? `Welcome Faculty Advisor. I can summarize student submissions for chapter ${user?.assignedClub || 'CSI'}, event registrations, or participation info.`
          : role === 'admin'
          ? `University Control Plane Assistant online. Query campus chapter health, accreditation metrics, or active events.`
          : `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm your Campus Assistant. Ask me about upcoming workshops, how to register, or your OD permission status.`

      const initialSuggestions =
        role === 'faculty_od'
          ? ['Show pending OD requests.', 'Which requests are waiting for verification?', 'How many requests were approved today?']
          : role === 'instructor'
          ? ['Show pending requests.', 'Which events are scheduled this week?', 'Show participation information.']
          : role === 'admin'
          ? ['System health and metrics', 'Show active chapters', 'Show upcoming events']
          : ['What events are happening this week?', 'Check my OD request', 'How do I submit an OD request?', 'How can I register for an event?']

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: greeting,
          suggestions: initialSuggestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
  }, [role, user, messages.length])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        if (transcript) {
          setInputVal(transcript)
        }
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          showToast('Microphone access was denied. Please allow microphone permissions in your browser.', 'error')
        } else if (event.error !== 'no-speech') {
          showToast(`Voice input: ${event.error}`, 'warning')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } catch (e) {
      setSpeechSupported(false)
    }

    return () => {
      recognitionRef.current?.abort()
    }
  }, [showToast])

  const toggleListening = () => {
    if (!speechSupported) {
      showToast('Speech recognition is not supported in this browser. Please type your message.', 'info')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
      } catch (e) {
        recognitionRef.current?.stop()
        setTimeout(() => recognitionRef.current?.start(), 150)
      }
    }
  }

  const handleSend = async (messageText) => {
    const text = (messageText || inputVal).trim()
    if (!text || isLoading) return

    // Stop microphone if currently listening
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setIsLoading(true)

    try {
      const response = await api.chatWithAssistant(text)
      const assistantMsg = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: response.reply || "I've reviewed the system records, but have no additional details.",
        suggestions: response.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Optional text-to-speech
      if (ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const cleanText = assistantMsg.text.replace(/[*#•]/g, '')
        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.rate = 1.05
        window.speechSynthesis.speak(utterance)
      }
    } catch (err) {
      const errMsg = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: err.message || "I encountered an issue retrieving live records. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        className="ai-assistant-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Campus Assistant"
        title="Campus AI Assistant & Voice Navigator"
      >
        <span className="ai-fab-pulse" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </button>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="ai-chat-window" role="dialog" aria-label="Campus Assistant Chat Window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar-badge">⚡</div>
              <div className="ai-title-row">
                <span className="ai-title">Campus Assistant</span>
                <span className="ai-status-row">
                  <span className="ai-status-dot" />
                  <span>{roleDisplay} · Live ERP</span>
                </span>
              </div>
            </div>

            <div className="ai-header-actions">
              {/* Text to speech toggle */}
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => {
                  setTtsEnabled(!ttsEnabled)
                  if (!ttsEnabled && 'speechSynthesis' in window) {
                    showToast('Voice speech response enabled', 'info')
                  }
                }}
                title={ttsEnabled ? 'Mute voice readouts' : 'Enable voice readouts'}
                aria-label="Toggle voice output"
                style={{ color: ttsEnabled ? '#ea580c' : '#ffffff' }}
              >
                {ttsEnabled ? '🔊' : '🔈'}
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="ai-header-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="ai-messages-list">
            {messages.map((m) => (
              <div key={m.id} className={`ai-msg ${m.sender}`}>
                <div className="ai-bubble">{m.text}</div>
                <span className="ai-timestamp">{m.timestamp}</span>

                {/* Suggested prompt chips */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="ai-suggestions-row">
                    {m.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        className="ai-chip-btn"
                        onClick={() => handleSend(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="ai-msg assistant">
                <div className="ai-typing-indicator">
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Listening State Bar */}
          {isListening && (
            <div className="ai-voice-active-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="ai-voice-wave">
                  <span className="ai-wave-bar" />
                  <span className="ai-wave-bar" />
                  <span className="ai-wave-bar" />
                  <span className="ai-wave-bar" />
                </div>
                <span>Listening... Speak into your microphone</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                style={{
                  background: '#92400e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="ai-input-area">
            {/* Microphone Voice Button */}
            <button
              type="button"
              className={`ai-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              title={isListening ? 'Stop voice input' : 'Speak your question'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>

            {/* Text Input */}
            <input
              type="text"
              className="ai-text-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening to voice...' : 'Ask Campus Assistant...'}
              aria-label="Type a message or question for the assistant"
            />

            {/* Send Button */}
            <button
              type="button"
              className="ai-send-btn"
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
