"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, ChevronDown, ChevronUp, Search } from "lucide-react"
import Link from "next/link"
import { ElegantLoader } from "@/components/elegant-loader"
// Mock data for chatbots and their sessions
const mockChatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    avatar: "bottts1234",
    sessions: [
      { id: 101, guestName: "John Doe", lastMessage: "Thank you for your help!", timestamp: "2023-04-15T14:30:00Z" },
      {
        id: 102,
        guestName: "Jane Smith",
        lastMessage: "Is there anything else I should know?",
        timestamp: "2023-04-15T16:45:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "Sales Assistant",
    avatar: "pixel5678",
    sessions: [
      {
        id: 201,
        guestName: "Alice Johnson",
        lastMessage: "I'll consider the premium plan, thanks!",
        timestamp: "2023-04-15T10:15:00Z",
      },
      {
        id: 202,
        guestName: "Bob Williams",
        lastMessage: "Can you tell me more about the basic plan?",
        timestamp: "2023-04-16T09:30:00Z",
      },
    ],
  },
]

export default function ChatSessionsPage() {
  const [expandedChatbot, setExpandedChatbot] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChatbots = mockChatbots.filter(
    (chatbot) =>
      chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chatbot.sessions.some((session) => session.guestName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleChatbot = (id: number) => {
    setExpandedChatbot(expandedChatbot === id ? null : id)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Sessions</h1>
          <p className="text-muted-foreground">View and analyze conversations between your chatbots and users.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by chatbot or guest name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredChatbots.map((chatbot) => (
          <Card key={chatbot.id} className="dark:neumorphic-dark light:neumorphic-light">
            <CardHeader className="cursor-pointer" onClick={() => toggleChatbot(chatbot.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/${chatbot.avatar.split(/[0-9]/)[0]}/svg?seed=${chatbot.avatar}`}
                      alt={chatbot.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                    <CardDescription>{chatbot.sessions.length} active sessions</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {expandedChatbot === chatbot.id ? (
                    <>
                      <ChevronUp size={16} className="mr-2" />
                      Hide Sessions
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-2" />
                      View Sessions
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedChatbot === chatbot.id && (
              <CardContent>
                <div className="space-y-4 mt-4">
                  {chatbot.sessions.map((session) => (
                    <Link key={session.id} href={`/admin/chat-sessions/${session.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                        <div>
                          <div className="font-medium">{session.guestName}</div>
                          <div className="text-sm text-muted-foreground">{session.lastMessage}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
       
    </div>
  )
}

