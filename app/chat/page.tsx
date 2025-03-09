"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Paperclip, Send } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  content: string
  sender: "ai" | "user"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        content: `I understand you're asking about "${inputValue}". Let me help you with that.`,
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

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card dark:neumorphic-dark light:neumorphic-light">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">CB</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Customer Support Bot</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
        </div>
        <ModeToggle />
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
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                        CB
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        YO
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                    CB
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
      <div className="p-4 border-t border-border bg-card dark:neumorphic-dark light:neumorphic-light">
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
            className="rounded-full flex-shrink-0 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

