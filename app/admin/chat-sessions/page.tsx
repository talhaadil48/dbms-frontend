"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import Link from "next/link"
import { ElegantLoader } from "@/components/elegant-loader"
import { useUser } from "@clerk/nextjs"
import type { Chatbot } from "@/components/chatbot-list"
import CustomAvatar from "@/components/avatar"

interface FormattedChatbot {
  id: number
  name: string
  avatar: string
  sessions: FormattedSession[]
}

interface FormattedSession {
  id: number
  guestName: string
  lastMessage: string
  timestamp: string
}

export default function ChatSessionsPage() {
  const { user } = useUser()
  const [chatbots, setChatbots] = useState<FormattedChatbot[]>([])
  const [expandedChatbot, setExpandedChatbot] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const BASE_URL = "http://localhost:8000"
    const fetchChatbots = async () => {
      if (!user) return
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${BASE_URL}/chatbotbyuser/${user?.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch chatbots")
        }

        const data = (await response.json()) as Chatbot[]

        // Transform the data to match the expected structure
        const formattedChatbots: FormattedChatbot[] = data.map((chatbot) => {
          return {
            id: chatbot.id,
            name: chatbot.name,
            // Generate a consistent avatar seed based on chatbot name
            avatar: `bottts${chatbot.id}`,
            sessions: chatbot.chat_sessions
              .filter((session) => session.messages && session.messages.length > 0)
              .map((session) => {
                // Find the last message in the session
                const messages = session.messages || []
                const lastMessage =
                  messages.length > 0
                    ? messages[messages.length - 1]
                    : { content: "No messages", created_at: session.created_at }

                return {
                  id: session.id,
                  guestName: session.guests?.name || `Guest ${session.guest_id}`,
                  lastMessage: lastMessage.content,
                  timestamp: lastMessage.created_at || session.created_at,
                }
              }),
          }
        })

        setChatbots(formattedChatbots)
      } catch (error) {
        console.error("Error fetching chatbots:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbots()
  }, [user])

  const filteredChatbots = chatbots.filter(
    (chatbot) =>
      chatbot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chatbot.sessions.some((session) => session.guestName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleChatbot = (id: number) => {
    setExpandedChatbot(expandedChatbot === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50">
      <ElegantLoader size="sm" text="Preparing your AI experience" />
    </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (chatbots.length === 0) {
    return (
      <div className="text-center p-6 bg-secondary/30 rounded-lg">
        <h2 className="text-xl font-semibold">No Chatbots Found</h2>
        <p className="text-muted-foreground">You don't have any chatbots with active sessions yet.</p>
      </div>
    )
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
                  <div className="relative h-12 w-12">
                    <CustomAvatar seed={chatbot.name}/>
                  </div>
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
                  {chatbot.sessions.length > 0 ? (
                    chatbot.sessions.map((session) => (
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
                    ))
                  ) : (
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <p className="text-muted-foreground">No active sessions for this chatbot.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
