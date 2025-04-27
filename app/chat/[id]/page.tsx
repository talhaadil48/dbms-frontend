"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { User, Send, AlertCircle } from "lucide-react"
import { GuestInfoForm } from "@/components/guest-info-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CustomAvatar from "@/components/avatar"

// Base URL for API calls
const BASE_URL = "http://localhost:8000"

interface Chatbot {
  id: number
  name: string
  avatarSeed?: string
  characteristics: string[]
}

interface Message {
  id: number
  content: string
  sender: "ai" | "user"
  timestamp: Date | string
  created_at?: string
}

interface Guest {
  id: number
  name: string
  email: string
}

interface ChatSession {
  id: number
  chatbot_id: number
  guest_id: number
}

export default function ChatPage() {
  const params = useParams()
  const chatbotId = params.id as string

  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(true)
  const [guestInfo, setGuestInfo] = useState<Guest | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch chatbot data when component mounts
  useEffect(() => {
    const fetchChatbot = async () => {
      if (!chatbotId) return

      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/chatbots/${chatbotId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch chatbot: ${response.status}`)
        }

        const data = await response.json()

        // Transform the data to match our interface
        const formattedChatbot: Chatbot = {
          id: data.id,
          name: data.name,
          avatarSeed: `bottts${data.id}`, // Generate a consistent avatar seed
          characteristics: data.chatbot_characteristics.map((c: any) => c.content),
        }

        setChatbot(formattedChatbot)
      } catch (err) {
        console.error("Error fetching chatbot:", err)
        setError("Failed to load chatbot. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbot()
  }, [chatbotId])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Create a guest user
  const createGuest = async (name: string, email: string): Promise<number> => {
    try {
      const response = await fetch(`${BASE_URL}/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create guest")
      }

      const data = await response.json()
      return data.id
    } catch (err) {
      console.error("Error creating guest:", err)
      throw err
    }
  }

  // Create a chat session
  const createChatSession = async (chatbotId: number, guestId: number): Promise<number> => {
    try {
      const response = await fetch(`${BASE_URL}/chat_sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          guest_id: guestId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create chat session")
      }

      const data = await response.json()
      return data.id
    } catch (err) {
      console.error("Error creating chat session:", err)
      throw err
    }
  }

  // Send a message to the API
  const sendMessage = async (chatSessionId: number, content: string, sender: "ai" | "user"): Promise<number> => {
    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_session_id: chatSessionId,
          content,
          sender,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      return data.id
    } catch (err) {
      console.error("Error sending message:", err)
      throw err
    }
  }

  // Fetch chat session messages
  const fetchChatSessionMessages = async (chatSessionId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/chatsessionmessages/${chatSessionId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch chat session messages: ${response.status}`)
      }

      const data = await response.json()

      // Transform the messages to match our interface
      const formattedMessages: Message[] = data.messages.map((message: any) => ({
        id: message.id,
        content: message.content,
        sender: message.sender as "ai" | "user",
        timestamp: new Date(message.created_at),
        created_at: message.created_at,
      }))

      setMessages(formattedMessages)
    } catch (err) {
      console.error("Error fetching chat session messages:", err)
      setError("Failed to load messages. Please try again later.")
    }
  }

  // Get AI response from OpenAI
  const getAIResponse = async (userMessage: string, chatbotCharacteristics: string[]): Promise<string> => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          characteristics: chatbotCharacteristics,
          chatbotName: chatbot?.name || "AI Assistant",
          userName: guestInfo?.name || "User",
        }),
      })

      if (!response.ok) {
        console.log(response)
      }

      const data = await response.json()
      return data.response
    } catch (err) {
      console.log("Error getting AI response:", err)
      return "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later."
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession || !chatbot) return

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Send user message to API
      await sendMessage(chatSession.id, userMessage.content, "user")

      // Get AI response
      const aiResponse = await getAIResponse(userMessage.content, chatbot.characteristics)

      // Send AI response to API
      await sendMessage(chatSession.id, aiResponse, "ai")

      // Add AI response to UI
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Error in message flow:", err)
      setError("Failed to process message. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle guest info submission
  const handleGuestInfoSubmit = async (name: string, email: string) => {
    if (!chatbot) return

    try {
      // Create guest
      const guestId = await createGuest(name, email)

      // Store guest info
      const guest: Guest = {
        id: guestId,
        name,
        email,
      }
      setGuestInfo(guest)

      // Create chat session
      const sessionId = await createChatSession(chatbot.id, guestId)

      // Store chat session
      const session: ChatSession = {
        id: sessionId,
        chatbot_id: chatbot.id,
        guest_id: guestId,
      }
      setChatSession(session)

      // Hide guest form
      setShowGuestForm(false)

      // Add initial greeting message
      const initialGreeting: Message = {
        id: Date.now(),
        content: `Hello ${name}! Welcome to our chat. I'm ${chatbot.name}, your AI assistant. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
      }

      // Send AI greeting to API
      await sendMessage(sessionId, initialGreeting.content, "ai")

      // Add greeting to UI
      setMessages([initialGreeting])
    } catch (err) {
      console.error("Error in guest submission flow:", err)
      setError("Failed to start chat. Please try again.")
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-150"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-300"></div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show guest form if needed
  if (showGuestForm) {
    return chatbot ? <GuestInfoForm chatbotName={chatbot.name} onSubmit={handleGuestInfoSubmit} /> : null
  }

  // Main chat interface
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            {chatbot && <CustomAvatar seed={chatbot.name}></CustomAvatar>}
            <div className="relative h-8 w-8 mt-1 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </div>
          </Avatar>
          <div>
            <div className="font-medium text-sm sm:text-base">{chatbot?.name || "AI Assistant"}</div>
            <div className="text-xs text-muted-foreground">AI Powered Assistant</div>
          </div>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-background">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex gap-2 max-w-[90%] sm:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  {message.sender === "ai" ? (
                    <>{chatbot && <CustomAvatar seed={chatbot.name}></CustomAvatar>}</>
                  ) : (
                    <>
                      <div className="relative h-8 w-8 mt-1 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <User size={16} />
                        </div>
                      </div>
                    </>
                  )}
                </Avatar>
                <div>
                  <div
                    className={`${
                      message.sender === "user" ? "message-bubble-user" : "message-bubble-ai"
                    } animate-fade-in text-sm`}
                  >
                    {message.content}
                  </div>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[90%] sm:max-w-[80%]">
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  {chatbot && <CustomAvatar seed={chatbot.name}></CustomAvatar>}
                  <div className="relative h-8 w-8 mt-1 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                  </div>
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
      <div className="p-2 sm:p-4 border-t border-border bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
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
            className="rounded-full text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isTyping || !inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
