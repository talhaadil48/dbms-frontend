"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { CharacteristicsManager } from "@/components/characteristics-manager"

// Mock data for chatbots
const mockChatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    category: "Support",
    characteristics: ["Friendly", "Knowledgeable", "Patient"],
  },
  { id: 2, name: "Sales Assistant", category: "Sales", characteristics: ["Persuasive", "Informative", "Engaging"] },
  {
    id: 3,
    name: "Technical Helper",
    category: "Technical",
    characteristics: ["Detailed", "Analytical", "Problem-solver"],
  },
]

export function ChatbotList() {
  const [chatbots, setChatbots] = useState(mockChatbots)
  const [selectedChatbot, setSelectedChatbot] = useState<(typeof mockChatbots)[0] | null>(null)

  const handleDelete = (id: number) => {
    setChatbots(chatbots.filter((bot) => bot.id !== id))
  }

  const handleCharacteristicsUpdate = (id: number, newCharacteristics: string[]) => {
    setChatbots(chatbots.map((bot) => (bot.id === id ? { ...bot, characteristics: newCharacteristics } : bot)))
    setSelectedChatbot(null)
  }

  return (
    <div className="space-y-4">
      {chatbots.map((chatbot) => (
        <Card key={chatbot.id} className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${chatbot.id}`} />
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{chatbot.name}</CardTitle>
                <CardDescription>{chatbot.category}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/edit-chatbot/${chatbot.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" onClick={() => setSelectedChatbot(chatbot)}>
                <Bot className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDelete(chatbot.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {chatbot.characteristics.map((char, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                  {char}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedChatbot && (
        <CharacteristicsManager
          chatbot={selectedChatbot}
          onClose={() => setSelectedChatbot(null)}
          onUpdate={(newCharacteristics) => handleCharacteristicsUpdate(selectedChatbot.id, newCharacteristics)}
        />
      )}
    </div>
  )
}

