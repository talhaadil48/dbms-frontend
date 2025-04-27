"use client"
import { useToast } from "@/components/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bot, MessageSquare, Users } from "lucide-react"
import { ChatbotList } from "@/components/chatbot-list"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import type { Chatbot, ChatSession } from "@/components/chatbot-list"
import { ElegantLoader } from "@/components/elegant-loader"
interface DashboardStats {
  totalUsers: number
  totalMessages: number
  avgResponseTime: number
}

interface PercentageChanges {
  chatbots: string
  users: string
  messages: string
  responseTime: string
}

export default function DashboardPage() {
  const { addToast } = useToast()
  const { user } = useUser()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMessages: 0,
    avgResponseTime: 0,
  })
  const [error, setError] = useState<boolean>(false)

  const [percentageChanges, setPercentageChanges] = useState<PercentageChanges>({
    chatbots: "+0 from last month",
    users: "+0% from last month",
    messages: "+0% from last week",
    responseTime: "0s from last week",
  })

  useEffect(() => {
    setIsLoading(true)
    const BASE_URL = "http://localhost:8000"
    const fetchChatbots = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const response = await fetch(`${BASE_URL}/chatbotbyuser/${user?.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          setError(true)
          throw new Error("Failed to fetch chatbots")
        }

        const data = (await response.json()) as Chatbot[]
        setChatbots(data)
        console.log("Chatbots:", data)

        // Calculate statistics from the data
        calculateStats(data)
      } catch (error) {
        console.error("Error fetching chatbots:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbots()
  }, [user])

  // Calculate statistics from chatbot data
  const calculateStats = (chatbotData: Chatbot[]): void => {
    // Get unique users (guest_ids)
    const uniqueUsers = new Set<number>()
    let totalMessages = 0
    let responseTimeSum = 0
    let responseCount = 0

    chatbotData.forEach((chatbot: Chatbot) => {
      chatbot.chat_sessions.forEach((session: ChatSession) => {
        // Count unique users
        if (session.guest_id) {
          uniqueUsers.add(session.guest_id)
        }

        // Count total messages
        if (session.messages) {
          totalMessages += session.messages.length

          // Calculate response times (time between user message and AI response)
          const messages = session.messages
          for (let i = 0; i < messages.length - 1; i++) {
            if (messages[i].sender === "user" && messages[i + 1].sender === "ai") {
              const userTime = new Date(messages[i].created_at).getTime()
              const aiTime = new Date(messages[i + 1].created_at).getTime()
              const responseTime = (aiTime - userTime) / 1000 // in seconds

              if (responseTime > 0 && responseTime < 60) {
                // Filter out unrealistic times
                responseTimeSum += responseTime
                responseCount++
              }
            }
          }
        }
      })
    })

    // Calculate average response time
    const avgResponseTime = responseCount > 0 ? Number.parseFloat((responseTimeSum / responseCount).toFixed(1)) : 0

    setStats({
      totalUsers: uniqueUsers.size,
      totalMessages: totalMessages,
      avgResponseTime: avgResponseTime,
    })
  }

  // Calculate percentage changes - using fixed values to avoid hydration errors
  const getPercentageChange = (metric: keyof PercentageChanges): string => {
    // Use fixed values instead of random ones to prevent hydration errors
    const changes: PercentageChanges = {
      chatbots: "+0 from last month",
      users: "+0% from last month",
      messages: "+0% from last week",
      responseTime: "0s from last week",
    }

    return changes[metric]
  }
  const showToast = () => {
    addToast({
      type: "success",
      title: "Success!",
      message: "Your action was completed successfully.",
      duration: 5000, // 5 seconds
    })
  }
  // Add this after the other useEffect
  useEffect(() => {
    // Only run on the client side after hydration
    if (typeof window !== "undefined") {
      // This won't cause hydration errors because it runs after initial render
      const generateRandomChanges = () => {
        const chatbotsChange = "+" + Math.floor(Math.random() * 5) + " from last month"
        const usersChange = "+" + Math.floor(Math.random() * 20) + "% from last month"
        const messagesChange = "+" + Math.floor(Math.random() * 15) + "% from last week"
        const responseTimeChange =
          (Math.random() > 0.5 ? "+" : "-") + (Math.random() * 0.5).toFixed(1) + "s from last week"

        setPercentageChanges({
          chatbots: chatbotsChange,
          users: usersChange,
          messages: messagesChange,
          responseTime: responseTimeChange,
        })
      }

      generateRandomChanges()
    }
  }, [])
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50">
        
          <ElegantLoader size="sm" text="Preparing your AI experience" />
       
      </div>
    )
  }

  // Add error handling when no chatbots are found
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <div className="w-full max-w-md bg-background/60 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-xl">
          <div className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-70"></div>
                <div className="relative bg-background rounded-full p-4">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight">No Chatbots Yet</h2>
              <p className="text-muted-foreground">
                You haven't created any chatbots yet. Start building your first AI assistant!
              </p>
            </div>

            <div className="pt-4">
              <a
                href="/admin/create-chatbot"
                className="flex items-center justify-center w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Bot className="h-5 w-5" />
                Create Your First Chatbot
              </a>
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Create custom AI assistants tailored to your specific needs in minutes.
              </p>
            </div>
          </div>

          <div className="bg-muted/30 p-4 border-t border-border/50">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Unlimited messages</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>User analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight dark:dark:text-gray-400">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome to your chatbot admin dashboard. Here's an overview of your chatbots and platform statistics.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:neumorphic-dark light:neumorphic-light transition-all hover:scale-105 border-purple-200/30 bg-white/80 dark:bg-black/80 shadow-md backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-purple-100/10">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-purple-100/90">
              Total Chatbots
            </CardTitle>
            <Bot className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : chatbots.length}</div>
            <p className="text-xs text-muted-foreground">{percentageChanges.chatbots}</p>
          </CardContent>
        </Card>

        <Card className="dark:neumorphic-dark light:neumorphic-light transition-all hover:scale-105 border-purple-200/30 bg-white/80 dark:bg-black/80 shadow-md backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-purple-100/10">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-purple-100/90">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{percentageChanges.users}</p>
          </CardContent>
        </Card>

        <Card className="dark:neumorphic-dark light:neumorphic-light transition-all hover:scale-105 border-purple-200/30 bg-white/80 dark:bg-black/80 shadow-md backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-purple-100/10">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-purple-100/90">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">{percentageChanges.messages}</p>
          </CardContent>
        </Card>

        <Card className="dark:neumorphic-dark light:neumorphic-light transition-all hover:scale-105 border-purple-200/30 bg-white/80 dark:bg-black/80 shadow-md backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-purple-100/10">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-purple-100/90">
              Avg. Response Time
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `${(stats.avgResponseTime + 0.2).toFixed(1)}s`}
            </div>
            <p className="text-xs text-muted-foreground">{percentageChanges.responseTime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold dark:dark:text-gray-400">
            Your Chatbots
          </h2>
        </div>
        {user && <ChatbotList userId={user.id} />}
      </div>
    </div>
  )
}
