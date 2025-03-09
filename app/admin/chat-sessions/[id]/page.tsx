"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for a specific chat session
const mockChatSession = {
  id: 101,
  chatbotName: "Customer Support Bot",
  chatbotAvatar: "bottts1234",
  guestName: "John Doe",
  timestamp: "2023-04-15T14:30:00Z",
  messages: [
    { id: 1, content: "Hello! How can I assist you today?", sender: "ai", timestamp: "2023-04-15T14:25:00Z" },
    { id: 2, content: "I have a question about my recent order.", sender: "user", timestamp: "2023-04-15T14:26:00Z" },
    {
      id: 3,
      content: "I'd be happy to help. Could you please provide your order number?",
      sender: "ai",
      timestamp: "2023-04-15T14:26:30Z",
    },
    { id: 4, content: "Sure, it's ORD123456.", sender: "user", timestamp: "2023-04-15T14:27:00Z" },
    {
      id: 5,
      content: "Thank you. I've located your order. What specific information do you need?",
      sender: "ai",
      timestamp: "2023-04-15T14:27:30Z",
    },
    { id: 6, content: "I want to know when it will be delivered.", sender: "user", timestamp: "2023-04-15T14:28:00Z" },
    {
      id: 7,
      content: "According to our records, your order is scheduled for delivery on April 18th.",
      sender: "ai",
      timestamp: "2023-04-15T14:28:30Z",
    },
    { id: 8, content: "Thank you for your help!", sender: "user", timestamp: "2023-04-15T14:29:00Z" },
    {
      id: 9,
      content: "You're welcome! Is there anything else I can help you with?",
      sender: "ai",
      timestamp: "2023-04-15T14:29:30Z",
    },
    { id: 10, content: "No, that's all. Have a great day!", sender: "user", timestamp: "2023-04-15T14:30:00Z" },
  ],
}

export default function ChatSessionPage() {
  const params = useParams()
  const [session, setSession] = useState(mockChatSession)

  useEffect(() => {
    // In a real application, you would fetch the session data based on the ID
    console.log("Fetching session with ID:", params.id)
    // For now, we'll just use the mock data
    setSession(mockChatSession)
  }, [params.id])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/chat-sessions">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{session.chatbotName}</h1>
            <p className="text-muted-foreground">
              Conversation with {session.guestName} on {new Date(session.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <Card className="dark:neumorphic-dark light:neumorphic-light">
        <CardHeader>
          <CardTitle>Chat Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {session.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    {message.sender === "ai" ? (
                      <>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/${session.chatbotAvatar.split(/[0-9]/)[0]}/svg?seed=${session.chatbotAvatar}`}
                          alt={session.chatbotName}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                          <Bot size={16} />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={session.guestName} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <User size={16} />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <div className={message.sender === "user" ? "message-bubble-user" : "message-bubble-ai"}>
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

