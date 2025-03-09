"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, Paperclip } from "lucide-react"
import { GuestInfoForm } from "@/components/guest-info-form"
import { ChatbotCharacteristics } from "@/components/chatbot-characteristics"

// Mock data for a chatbot
const mockChatbot = {
  id: 1,
  name: "AI Assistant",
  avatarSeed: "bottts5678",
  characteristics: [
    "I am a helpful AI assistant.",
    "I can answer questions on various topics.",
    "I'm always eager to learn and assist.",
    "I maintain a friendly and professional tone.",
    "I can provide detailed explanations when needed.",
  ],
}

interface Message {
  id: number
  content: string
  sender: "ai" | "user"
  timestamp: Date
}

export default function ChatPage() {
  const params = useParams()
  const [chatbot, setChatbot] = useState(mockChatbot)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(true)
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you would fetch the chatbot data based on the ID
    console.log("Fetching chatbot with ID:", params.id)
    // For now, we'll just use the mock data
    setChatbot(mockChatbot)
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        content: `Hello ${guestInfo.name}, I understand you're asking about "${inputValue}". As an AI Assistant, I can help you with that. ${chatbot.characteristics[Math.floor(Math.random() * chatbot.characteristics.length)]}`,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleGuestInfoSubmit = (name: string, email: string) => {
    setGuestInfo({ name, email })
    setShowGuestForm(false)
    // You might want to send this info to your backend here
    console.log("Guest info submitted:", { name, email })

    // Add initial greeting message from the chatbot
    const initialGreeting: Message = {
      id: 1,
      content: `Hello ${name}! Welcome to our chat. I'm ${chatbot.name}, your AI assistant. How can I help you today?`,
      sender: "ai",
      timestamp: new Date(),
    }
    setMessages([initialGreeting])
  }

  if (showGuestForm) {
    return <GuestInfoForm onSubmit={handleGuestInfoSubmit} />
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/${chatbot.avatarSeed.split(/[0-9]/)[0]}/svg?seed=${chatbot.avatarSeed}`}
              alt={chatbot.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{chatbot.name}</div>
            <div className="text-xs text-muted-foreground">AI Powered Assistant</div>
          </div>
        </div>
        <ChatbotCharacteristics characteristics={chatbot.characteristics} />
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  {message.sender === "ai" ? (
                    <>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/${chatbot.avatarSeed.split(/[0-9]/)[0]}/svg?seed=${chatbot.avatarSeed}`}
                        alt={chatbot.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={16} />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={guestInfo.name} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {guestInfo.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <div
                    className={`${message.sender === "user" ? "message-bubble-user" : "message-bubble-ai"} animate-fade-in`}
                  >
                    {message.content}
                  </div>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/${chatbot.avatarSeed.split(/[0-9]/)[0]}/svg?seed=${chatbot.avatarSeed}`}
                    alt={chatbot.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="message-bubble-ai flex items-center gap-1 py-3">
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <Paperclip size={18} />
          </Button>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="rounded-full"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

