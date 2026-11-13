import { useState, useEffect, useRef } from 'react'

/**
 * useVoiceReader - Cross-browser Text-to-Speech hook
 * Supports South Indian regional voices (Kannada, Telugu, Tamil) and Indian English
 */
export const useVoiceReader = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeSpeechId, setActiveSpeechId] = useState(null)
  const [voices, setVoices] = useState([])
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)

  useEffect(() => {
    if (!synthRef.current) return

    const updateVoices = () => {
      const available = synthRef.current.getVoices()
      setVoices(available)
    }

    updateVoices()
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = updateVoices
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
    setActiveSpeechId(null)
  }

  const speak = (text, langCode = 'en', id = null) => {
    if (!synthRef.current) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }

    // If currently speaking this item, toggle stop
    if (isSpeaking && activeSpeechId === id) {
      stop()
      return
    }

    // Stop previous utterance
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Map language code to BCP 47 tag
    const langMap = {
      kn: 'kn-IN', // Kannada
      te: 'te-IN', // Telugu
      ta: 'ta-IN', // Tamil
      en: 'en-IN', // Indian English
    }

    const targetLang = langMap[langCode] || 'en-IN'
    utterance.lang = targetLang
    utterance.rate = 0.95 // slightly slower for maximum clarity in regional speeches
    utterance.pitch = 1.0

    // Pick best matching voice if installed in the OS/browser
    const matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
                         voices.find(v => v.lang.toLowerCase().startsWith(langCode)) ||
                         voices.find(v => v.lang.includes('IN'))

    if (matchedVoice) {
      utterance.voice = matchedVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      setActiveSpeechId(id)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setActiveSpeechId(null)
    }

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e)
      setIsSpeaking(false)
      setActiveSpeechId(null)
    }

    synthRef.current.speak(utterance)
  }

  return {
    speak,
    stop,
    isSpeaking,
    activeSpeechId,
  }
}

export default useVoiceReader
