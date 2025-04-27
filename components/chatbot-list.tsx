"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { CharacteristicsManager } from "@/components/characteristics-manager"
import { ElegantLoader } from "@/components/elegant-loader"
import Avatar from "./avatar"

export interface Chatbot {
  id: number
  clerk_user_id: string
  name: string
  created_at: string
  chatbot_characteristics: ChatbotCharacteristic[]
  chat_sessions: ChatSession[]
}

export interface ChatbotCharacteristic {
  id: number
  chatbot_id: number
  content: string
  created_at: string
}

export interface Guest {
  id: number
  name: string
  created_at: string
  email: string
}

export interface ChatSession {
  id: number
  chatbot_id: number
  guest_id: number
  created_at: string
  messages: Message[]
  guests: Guest
}

export interface Message {
  id: number
  chat_session_id: number
  content: string
  created_at: string
  sender: "ai" | "user"
}

interface ChatbotListProps {
  userId: string
}

export function ChatbotList({ userId }: ChatbotListProps) {
  const BASE_URL = "http://localhost:8000"
  const [chatBots, setChatBots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchChatbots = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${BASE_URL}/chatbotbyuser/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch chatbots")
        }

        const data = await response.json()
        const formattedData = Array.isArray(data) ? data : []
        setChatBots(formattedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching chatbots:", error)
        setError("Failed to load chatbots. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChatbots()
  }, [userId, BASE_URL])

  const handleDelete = async (id: number) => {
    setChatBots(chatBots.filter((bot) => bot.id !== id))
    try {
      const response = await fetch(`${BASE_URL}/delete_chatbot/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatbot_id: id }),
      })
      if (response.ok) {
        console.log("Chatbot deleted successfully")
      } else {
        console.error("Error deleting chatbot")
      }
    } catch (error) {
      console.error("Error deleting chatbot:", error)
    }
  }

  const handleCharacteristicsUpdate = (id: number, newCharacteristics: string[]) => {
    setChatBots(
      chatBots.map((bot) => {
        if (bot.id === id) {
          // Create new chatbot_characteristics array from the strings
          const updatedCharacteristics = newCharacteristics.map((content, index) => ({
            id: index, // This is temporary, would be replaced by real IDs in a real implementation
            chatbot_id: id,
            content,
            created_at: new Date().toISOString(),
          }))

          return { ...bot, chatbot_characteristics: updatedCharacteristics }
        }
        return bot
      }),
    )
    setSelectedChatbot(null)
  }

  // Extract characteristics from chatbot_characteristics array
  const getCharacteristics = (bot: Chatbot): string[] => {
    return bot.chatbot_characteristics.map((char) => char.content)
  }

  // Get limited characteristics (max 3)
  const getLimitedCharacteristics = (bot: Chatbot): string[] => {
    const allCharacteristics = getCharacteristics(bot)
    return allCharacteristics.slice(0, 3)
  }

  // Open characteristics manager for a chatbot
  const handleManageCharacteristics = (bot: Chatbot) => {
    setSelectedChatbot(bot)
  }

  if (loading) {
   return (
       <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50">
         <ElegantLoader size="sm" text="Preparing your AI experience" />
       </div>
     )
  }
  return (
    <div className="space-y-4">
      {chatBots.map((bot) => {
        const allCharacteristics = getCharacteristics(bot)
        const limitedCharacteristics = getLimitedCharacteristics(bot)
        const hasMoreCharacteristics = allCharacteristics.length > 3

        return (
          <Card key={bot.id} className="dark:neumorphic-dark light:neumorphic-light">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar seed={bot.name}></Avatar>
                <div>
                  <CardTitle>{bot.name}</CardTitle>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/edit-chatbot/${bot.id}`}>
                    <Edit className="h-4 w-4 text-purple-500" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(bot.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {limitedCharacteristics.map((char, index) => (
                  <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                    {char}
                  </span>
                ))}
                {hasMoreCharacteristics && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs px-2 py-1 h-auto"
                    onClick={() => handleManageCharacteristics(bot)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {allCharacteristics.length - 3} more
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      {selectedChatbot && (
        <CharacteristicsManager
          chatbot={{
            id: selectedChatbot.id,
            name: selectedChatbot.name,
            characteristics: getCharacteristics(selectedChatbot),
          }}
          onClose={() => setSelectedChatbot(null)}
          onUpdate={(newCharacteristics) => handleCharacteristicsUpdate(selectedChatbot.id, newCharacteristics)}
        />
      )}
    </div>
  )
}
