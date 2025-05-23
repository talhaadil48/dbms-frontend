"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Copy, Check, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { ElegantLoader } from "@/components/elegant-loader"
import CustomAvatar from "@/components/avatar"

interface Characteristic {
  id: number
  content: string
  created_at: string
}

interface Chatbot {
  id: number
  name: string
  created_at: string
  chatbot_characteristics: Characteristic[]
  chat_sessions: any[] // We don't need the full type for sessions in this page
}

export default function EditChatbotPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [chatbot, setChatbot] = useState<Chatbot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newCharacteristic, setNewCharacteristic] = useState("")
  const [copied, setCopied] = useState(false)
  const [chatbotName, setChatbotName] = useState("")

  useEffect(() => {
    const fetchChatbot = async () => {
      if (!params.id) return

      setIsLoading(true)
      setError(null)

      try {
        const BASE_URL = "https://chatbot-ai-mocha.vercel.app"
        const response = await fetch(`${BASE_URL}/chatbots/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch chatbot: ${response.status}`)
        }

        const data = (await response.json()) as Chatbot
        setChatbot(data)
        setChatbotName(data.name)
      } catch (error) {
        console.error("Error fetching chatbot:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbot()
  }, [params.id])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatbotName(e.target.value)
  }

  const handleSaveChanges = async () => {
    if (!chatbot) return

    setIsSaving(true)
    try {
      const BASE_URL = "https://chatbot-ai-mocha.vercel.app"
      const response = await fetch(`${BASE_URL}/update_chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_id: chatbot.id,
          name: chatbotName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update chatbot")
      }

      toast({
        title: "Changes saved",
        description: "Your chatbot has been updated successfully.",
      })

      // Update local state
      setChatbot({
        ...chatbot,
        name: chatbotName,
      })
    } catch (error) {
      console.error("Error updating chatbot:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCharacteristic = async () => {
    if (!chatbot || !newCharacteristic.trim()) return

    try {
      const BASE_URL = "https://chatbot-ai-mocha.vercel.app"
      const response = await fetch(`${BASE_URL}/characteristics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_id: chatbot.id,
          content: newCharacteristic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add characteristic")
      }

      // Refetch the chatbot to get the updated characteristics
      const updatedChatbotResponse = await fetch(`${BASE_URL}/chatbots/${chatbot.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!updatedChatbotResponse.ok) {
        throw new Error("Failed to fetch updated chatbot")
      }

      const updatedChatbot = (await updatedChatbotResponse.json()) as Chatbot
      setChatbot(updatedChatbot)
      setNewCharacteristic("")

      toast({
        title: "Characteristic added",
        description: "Your chatbot characteristic has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding characteristic:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add characteristic. Please try again.",
      })
    }
  }

  const handleRemoveCharacteristic = async (id: number) => {
    if (!chatbot) return

    try {
      const BASE_URL = "https://chatbot-ai-mocha.vercel.app"
      const response = await fetch(`${BASE_URL}/remove_characteristic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characteristic_id: id,
        }),
      })

      if (!response.ok) {
        console.log(response)
      }

      // Update local state
      setChatbot({
        ...chatbot,
        chatbot_characteristics: chatbot.chatbot_characteristics.filter((c) => c.id !== id),
      })

      toast({
        title: "Characteristic removed",
        description: "Your chatbot characteristic has been removed successfully.",
      })
    } catch (error) {
      console.error("Error removing characteristic:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove characteristic. Please try again.",
      })
    }
  }

  const copyLink = () => {
    if (!chatbot) return

    const link = `${window.location.origin}/chat/${chatbot.id}`;
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "Chatbot link has been copied to clipboard.",
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  if (!chatbot) {
    return (
      <div className="text-center p-6 bg-secondary/30 rounded-lg">
        <h2 className="text-xl font-semibold">Chatbot Not Found</h2>
        <p className="text-muted-foreground">The requested chatbot could not be found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  // Update the edit chatbot page to be responsive
  return (
    <div className="space-y-6 animate-fade-in">
      <div className= "bg-background/80 backdrop-blur-sm py-4 border-b border-purple-200/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-6xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-purple-100/10"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight dark:dark:text-gray-400">Edit Chatbot</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Customize your chatbot's behavior and responses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              className="text-white bg-purple-900/80 hover:bg-purple-900/40 w-full sm:w-auto"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <ElegantLoader />
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4 pb-12">
        <div className="md:col-span-1 space-y-6">
          <Card className="dark:neumorphic-dark light:neumorphic-light shadow-md">
            <CardHeader className="border-b border-purple-100/10 pb-4">
              <CardTitle className="text-base sm:text-lg text-purple-900/80 dark:text-purple-100/90">
                Chatbot Details
              </CardTitle>
              <CardDescription>Basic information about your chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-center mb-6">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-secondary ring-2 ring-purple-300/20 ring-offset-2 ring-offset-background">
                  <CustomAvatar seed={chatbot.name} className="h-20 w-20 sm:h-24 sm:w-24" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatbot-name" className="text-purple-900/80 dark:text-purple-100/90">
                  Chatbot Name
                </Label>
                <Input
                  id="chatbot-name"
                  value={chatbotName}
                  onChange={handleNameChange}
                  className="bg-secondary/30 focus-visible:ring-purple-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-900/80 dark:text-purple-100/90">Created On</Label>
                <div className="text-xs sm:text-sm text-muted-foreground bg-purple-50/10 dark:bg-purple-900/10 p-2 rounded-md">
                  {new Date(chatbot.created_at).toLocaleDateString()} at{" "}
                  {new Date(chatbot.created_at).toLocaleTimeString()}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-900/80 dark:text-purple-100/90">Active Sessions</Label>
                <div className="text-xs sm:text-sm font-medium bg-purple-50/10 dark:bg-purple-900/10 p-2 rounded-md">
                  {chatbot.chat_sessions.length} active conversations
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2 border-t border-purple-100/10 pt-4">
              <div className="flex items-center justify-between bg-purple-50/20 dark:bg-purple-900/10 rounded-lg p-3 text-xs sm:text-sm">
                <span className="text-muted-foreground">Chat Link:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyLink}
                  className="h-8 hover:bg-purple-100/20 hover:text-purple-700"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="dark:neumorphic-dark light:neumorphic-light border-purple-200/20 shadow-md">
            <CardHeader className="border-b border-purple-100/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg text-purple-900/80 dark:text-purple-100/90">
                    Chatbot Characteristics
                  </CardTitle>
                  <CardDescription>Define how your chatbot should behave and respond</CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-50/20 dark:bg-purple-900/10 border-purple-200/30">
                  {chatbot.chatbot_characteristics.length} Characteristics
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-4">
                {chatbot.chatbot_characteristics.map((characteristic) => (
                  <div
                    key={characteristic.id}
                    className="bg-secondary/20 p-4 rounded-lg relative group transition-all hover:bg-secondary/30"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCharacteristic(characteristic.id)}
                        className="h-6 w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <p className="pr-8 text-xs sm:text-sm">{characteristic.content}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Added on {new Date(characteristic.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-purple-100/10">
                <Label htmlFor="new-characteristic" className="mb-2 block text-purple-900/80 dark:text-purple-100/90">
                  Add New Characteristic
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    id="new-characteristic"
                    placeholder="Enter a new characteristic for your chatbot..."
                    value={newCharacteristic}
                    onChange={(e) => setNewCharacteristic(e.target.value)}
                    className="bg-secondary/20 min-h-[80px] focus-visible:ring-purple-400/30 text-xs sm:text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddCharacteristic}
                  className="mt-2 w-full bg-purple-50/20 dark:bg-purple-900/10 hover:bg-purple-100/30 dark:hover:bg-purple-800/20 border-purple-200/30"
                  disabled={!newCharacteristic.trim()}
                >
                  <Plus size={16} className="mr-2" />
                  Add Characteristic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
