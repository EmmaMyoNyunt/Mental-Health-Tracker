import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm here to provide general mental health support and information. How can I help you today? 🌱\n\nPlease note: I provide general guidance only. For professional support, please consult with a healthcare provider or visit HSE Mental Health Services.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Check if API key is configured
      const apiKey = localStorage.getItem('moodGarden_openai_key')
      
      if (!apiKey) {
        // Fallback to simple rule-based responses
        const response = generateFallbackResponse(userMessage.content)
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
        return
      }

      // Use OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a supportive mental health assistant. Provide empathetic, helpful, and evidence-based general advice. Always remind users that you are not a replacement for professional help. Keep responses concise and supportive. Reference HSE (Health Service Executive) resources when appropriate.',
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: 'user',
              content: userMessage.content,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('anxious') || lowerInput.includes('anxiety') || lowerInput.includes('worried')) {
      return "I understand that anxiety can be challenging. Here are some general tips:\n\n• Try deep breathing exercises (4-4-4 technique)\n• Practice mindfulness or meditation\n• Take regular breaks and get some fresh air\n• Consider talking to someone you trust\n\nFor professional support, visit: https://www2.hse.ie/mental-health/\n\nRemember, I provide general guidance only. If you're experiencing severe anxiety, please consult a healthcare professional."
    }
    
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('down')) {
      return "I'm sorry you're feeling this way. Here are some general suggestions:\n\n• Try to maintain a routine\n• Get some natural light and gentle exercise\n• Stay connected with supportive people\n• Consider journaling your thoughts\n• Practice self-compassion\n\nFor professional support, visit: https://www2.hse.ie/mental-health/\n\nIf you're having thoughts of self-harm, please contact emergency services immediately."
    }
    
    if (lowerInput.includes('stress') || lowerInput.includes('stressed')) {
      return "Stress can be overwhelming. Here are some general strategies:\n\n• Break tasks into smaller steps\n• Practice time management\n• Try relaxation techniques\n• Ensure you're getting enough sleep\n• Consider what you can control vs. what you can't\n\nFor more resources, visit: https://www2.hse.ie/mental-health/\n\nRemember, I provide general guidance only."
    }
    
    if (lowerInput.includes('sleep') || lowerInput.includes('tired') || lowerInput.includes('insomnia')) {
      return "Sleep is important for mental health. General tips:\n\n• Maintain a regular sleep schedule\n• Create a calming bedtime routine\n• Limit screens before bed\n• Avoid caffeine in the afternoon\n• Keep your bedroom cool and dark\n\nFor persistent sleep issues, consider consulting a healthcare provider."
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I'm here to listen and provide general guidance. Here are some resources:\n\n• HSE Mental Health Services: https://www2.hse.ie/mental-health/\n• HSE Live: 1800 700 700 (Mon-Fri 8am-8pm)\n• In an emergency, call 999 or 112\n\nRemember, I provide general information only. For professional mental health support, please consult with a healthcare provider."
    }
    
    return "Thank you for sharing. I understand this is important to you. Here are some general mental health tips:\n\n• Practice self-care regularly\n• Stay connected with supportive people\n• Maintain a routine when possible\n• Consider mindfulness or relaxation techniques\n• Track your mood and patterns (like you're doing in MoodGarden!)\n\nFor professional support and resources, visit: https://www2.hse.ie/mental-health/\n\nRemember, I provide general guidance only. If you need immediate help, please contact emergency services or a healthcare professional."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary-600 dark:bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 flex items-center justify-center z-40 hover:scale-110"
        aria-label="Open AI Chatbot"
      >
        <MessageCircle size={28} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-primary-600 dark:bg-primary-500 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">AI Mental Health Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Bot size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          General guidance only. For professional help, visit{' '}
          <a href="https://www2.hse.ie/mental-health/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
            HSE Mental Health
          </a>
        </p>
      </div>
    </div>
  )
}

export default AIChatbot

