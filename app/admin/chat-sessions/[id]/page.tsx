"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ElegantLoader } from "@/components/elegant-loader"
import CustomAvatar from "@/components/avatar"

interface ChatSessionResponse {
  id: number
  created_at: string
  messages: {
    id: number
    content: string
    sender: "ai" | "user"
    created_at: string
  }[]
  chatbots: {
    name: string
  }
  guests: {
    name: string
    email: string
  }
}

interface FormattedChatSession {
  id: number
  chatbotName: string
  chatbotAvatar: string
  guestName: string
  timestamp: string
  messages: {
    id: number
    content: string
    sender: "ai" | "user"
    timestamp: string
  }[]
}

export default function ChatSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<FormattedChatSession | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChatSession = async () => {
      if (!params.id) return

      setIsLoading(true)
      setError(null)

      try {
        const BASE_URL = "https://chatbot-jtwag8e36-talhas-projects-cc002d63.vercel.app"
        const response = await fetch(`${BASE_URL}/chatsessionmessages/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch chat session: ${response.status}`)
        }

        const data = (await response.json()) as ChatSessionResponse

        // Transform the data to match the expected structure
        const formattedSession: FormattedChatSession = {
          id: data.id,
          chatbotName: data.chatbots?.name || "Unknown Chatbot",
          // Generate a consistent avatar seed based on chatbot name
          chatbotAvatar: `bottts${data.id}`,
          guestName: data.guests?.name || "Unknown Guest",
          timestamp: data.created_at,
          messages: data.messages.map((message) => ({
            id: message.id,
            content: message.content,
            sender: message.sender,
            timestamp: message.created_at,
          })),
        }

        setSession(formattedSession)
      } catch (error) {
        console.error("Error fetching chat session:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatSession()
  }, [params.id])

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
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="default" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center p-6 bg-secondary/30 rounded-lg">
        <h2 className="text-xl font-semibold">Chat Session Not Found</h2>
        <p className="text-muted-foreground">The requested chat session could not be found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/chat-sessions">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">{session.chatbotName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Conversation with {session.guestName} on {new Date(session.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <Card className="dark:neumorphic-dark light:neumorphic-light">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Chat Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {session.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-2 max-w-[90%] sm:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {message.sender === "ai" ? (
                    <div className="relative h-8 w-8 mt-2 flex-shrink-0">
                      <CustomAvatar seed={session.chatbotName} />
                    </div>
                  ) : (
                    <div className="relative h-8 w-8 mt-1 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <User size={16} />
                      </div>
                    </div>
                  )}
                  <div>
                    <div className={message.sender === "user" ? "message-bubble-user" : "message-bubble-ai"}>
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-muted-foreground mt-1 ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}
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
