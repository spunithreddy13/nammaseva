import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createChatSession } from '../utils/chatLogic'
import { SCHEMES } from '../data/schemes'
import './Chatbot.css'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Namaste! I am SevAI 🤖. I can help you find schemes, check eligibility, or guide you through applications.", sender: 'bot', quickReplies: ["Find schemes for me", "What are business loans?", "Help me apply for a scheme"] }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const chatSessionRef = useRef(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Initialize Gemini Chat Session on mount
  useEffect(() => {
    chatSessionRef.current = createChatSession()
  }, [])

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
      // Extract JSON from the response text
      const responseText = typeof response.text === 'function' ? response.text() : response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        const fullSchemes = result.schemes ? result.schemes.map(id => SCHEMES.find(s => s.id === id)).filter(Boolean) : []
        setMessages(prev => [...prev, { text: result.text, sender: 'bot', quickReplies: result.quickReplies, schemes: fullSchemes }])
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I encountered an issue. Can you rephrase?", sender: 'bot' }])
      }
    } catch (error) {
      console.error("Gemini API Error:", error)
      setMessages(prev => [...prev, { text: "Sorry, my systems are currently experiencing an issue connecting to the AI.", sender: 'bot' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      <button className={`sevai-fab ${isOpen ? 'sevai-fab--hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <span className="sevai-fab__icon">🤖</span>
      </button>

      <div className={`sevai-window ${isOpen ? 'sevai-window--open' : ''}`}>
        <div className="sevai-header">
          <div className="sevai-header__left">
            <span className="sevai-header__icon">🤖</span>
            <div>
              <div className="sevai-header__title">SevAI</div>
              <div className="sevai-header__sub">Powered by Gemini AI</div>
            </div>
          </div>
          <button className="sevai-header__close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="sevai-body">
          {messages.map((m, i) => (
            <div key={i} className={`sevai-msg-wrap sevai-msg-wrap--${m.sender}`}>
              {m.sender === 'bot' && <div className="sevai-msg-avatar">🤖</div>}
              <div className="sevai-msg-content">
                <div className={`sevai-msg sevai-msg--${m.sender}`}>
                  {m.text}
                </div>
                
                {m.schemes && m.schemes.length > 0 && (
                  <div className="sevai-schemes">
                    {m.schemes.map(s => (
                      <div key={s.id} className="sevai-scheme-card" onClick={() => navigate(`/scheme/${s.id}`)}>
                        <div className="sevai-scheme-card__title">{s.name}</div>
                        <div className="sevai-scheme-card__ben">{s.benefit}</div>
                        <div className="sevai-scheme-card__cta">View Details →</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="sevai-quick-replies">
                    {m.quickReplies.map(qr => (
                      <button key={qr} className="sevai-qr-btn" onClick={() => handleSend(qr)}>{qr}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="sevai-msg-wrap sevai-msg-wrap--bot">
              <div className="sevai-msg-avatar">🤖</div>
              <div className="sevai-msg-content">
                <div className="sevai-msg sevai-msg--bot sevai-msg--typing">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="sevai-footer">
          <input 
            type="text" 
            className="sevai-input" 
            placeholder="Ask SevAI anything..." 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="sevai-send" onClick={() => handleSend()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default Chatbot
