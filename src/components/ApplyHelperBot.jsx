import { useState, useEffect, useRef } from 'react'
import { createApplyHelperSession } from '../utils/chatLogic'
import './ApplyHelperBot.css'

const ApplyHelperBot = ({ scheme, onClose }) => {
  const [messages, setMessages] = useState([
    { text: `I see you're interested in ${scheme.name}. Would you like help applying?`, sender: 'bot', quickReplies: ["Yes, please guide me", "What are the common mistakes?"] }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const chatSessionRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chatSessionRef.current = createApplyHelperSession(scheme)
  }, [scheme])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (textOverride) => {
    const text = textOverride || inputValue.trim()
    if (!text) return

    setInputValue('')
    setMessages(prev => [...prev, { text, sender: 'user' }])
    setIsTyping(true)

    try {
      const response = await chatSessionRef.current.sendMessage({ message: text })
      const responseText = typeof response.text === 'function' ? response.text() : response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        setMessages(prev => [...prev, { text: result.text, sender: 'bot', quickReplies: result.quickReplies }])
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I encountered an issue parsing the response.", sender: 'bot' }])
      }
    } catch (error) {
      console.error("Gemini API Error:", error)
      setMessages(prev => [...prev, { text: "Sorry, there was an error connecting to the AI.", sender: 'bot' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="helper-bot-overlay">
      <div className="helper-bot-panel">
        <div className="helper-bot-header">
          <div className="helper-bot-header__info">
            <div className="helper-bot-header__icon">📋</div>
            <div>
              <div className="helper-bot-header__title">Apply Helper</div>
              <div className="helper-bot-header__sub">{scheme.name}</div>
            </div>
          </div>
          <button className="helper-bot-close" onClick={onClose}>✕</button>
        </div>

        <div className="helper-bot-body">
          {messages.map((m, i) => (
            <div key={i} className={`helper-msg-wrap helper-msg-wrap--${m.sender}`}>
              {m.sender === 'bot' && <div className="helper-avatar">📋</div>}
              {m.sender === 'user' && <div className="helper-avatar">👤</div>}
              <div className="helper-msg-content">
                <div className={`helper-msg helper-msg--${m.sender}`}>
                  {m.text}
                </div>
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="helper-quick-replies">
                    {m.quickReplies.map(qr => (
                      <button key={qr} className="helper-qr-btn" onClick={() => handleSend(qr)}>{qr}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="helper-msg-wrap helper-msg-wrap--bot">
              <div className="helper-avatar">📋</div>
              <div className="helper-msg-content">
                <div className="helper-msg helper-msg--bot" style={{ color: '#94a3b8' }}>Typing...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="helper-bot-footer">
          <div className="helper-input-wrap">
            <input 
              type="text" 
              className="helper-input" 
              placeholder="Ask for help..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="helper-send" onClick={() => handleSend()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyHelperBot
