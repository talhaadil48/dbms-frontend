"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Bot, Sparkles, Plus, Trash, Save, ArrowRight, Lightbulb } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Avatar from "@/components/avatar"

export default function CreateChatbotPage() {
  const BASE_URL = "http://localhost:8000"
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [chatbotName, setChatbotName] = useState("")
  const [characteristics, setCharacteristics] = useState([
    { id: 1, content: "I am a helpful assistant." },
    { id: 2, content: "I provide accurate information about products and services." },
  ])
  const [newCharacteristic, setNewCharacteristic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const characteristicInputRef = useRef<HTMLTextAreaElement>(null)

  const characteristicSuggestions = [
    "I am friendly and approachable in my responses.",
    "I use simple language that's easy to understand.",
    "I provide concise answers to questions.",
    "I can explain complex topics in simple terms.",
    "I maintain a professional tone in all interactions.",
    "I'm designed to be helpful without being judgmental.",
    "I always try to provide the most accurate information available.",
    "I'm patient and can repeat information when needed.",
  ]

  const pillColors = ["purple", "blue", "pink", "indigo"]

  const handleAddCharacteristic = () => {
    if (!newCharacteristic.trim()) return

    const newId = characteristics.length > 0 ? Math.max(...characteristics.map((c) => c.id)) + 1 : 1
    setCharacteristics([...characteristics, { id: newId, content: newCharacteristic.trim() }])
    setNewCharacteristic("")

    if (characteristicInputRef.current) {
      characteristicInputRef.current.focus()
    }
  }

  const handleRemoveCharacteristic = (id: number) => {
    setCharacteristics(characteristics.filter((c) => c.id !== id))
  }

  const handleSuggestionClick = (suggestion: string) => {
    const newId = characteristics.length > 0 ? Math.max(...characteristics.map((c) => c.id)) + 1 : 1
    setCharacteristics([...characteristics, { id: newId, content: suggestion }])
  }

  const insertChatbot = async () => {
    if (!chatbotName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your chatbot.",
        variant: "destructive",
      })
      return
    }

    if (characteristics.length === 0) {
      toast({
        title: "Characteristics required",
        description: "Please add at least one characteristic for your chatbot.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/create_chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chatbotName,
          clerk_user_id: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create chatbot")
      }

      const data = await response.json()
      const chatbotId = data.id

      // Create all characteristics
      await Promise.all(
        characteristics.map(async (characteristic) => {
          const response = await fetch(`${BASE_URL}/characteristics`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatbot_id: chatbotId,
              content: characteristic.content,
            }),
          })

          if (!response.ok) {
            console.log(response)
            throw new Error("Failed to create characteristic")
          }
        }),
      )

      toast({
        title: "Chatbot created!",
        description: `${chatbotName} has been created successfully.`,
      })

      // Redirect to dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error creating chatbot:", error)
      toast({
        title: "Error",
        description: "Failed to create chatbot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && !chatbotName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your chatbot.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:dark:dark:text-gray-400">
            Create Your AI Assistant
          </h1>
          <p className="text-muted-foreground">Design a custom chatbot with unique characteristics and behavior</p>
        </div>
      </div>

      <div className="relative">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-md">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1 ? "bg-purple-900/80 text-white" : "bg-muted text-muted-foreground"
                } transition-colors duration-300`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep >= 2 ? "bg-purple-900/80" : "bg-muted"
                } transition-colors duration-300`}
              ></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2 ? "bg-purple-900/80 text-white" : "bg-muted text-muted-foreground"
                } transition-colors duration-300`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex w-full max-w-md">
              <div className="flex-1 text-center text-sm font-medium">Basic Info</div>
              <div className="flex-1 text-center text-sm font-medium">Characteristics</div>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Basic Information</CardTitle>
                <CardDescription>Let's start with the fundamentals of your AI assistant</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative w-32 h-32">
                  <Avatar seed={chatbotName || "dsadjkldasda"} />

                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="floating-label w-full">
                      <Input
                        id="chatbot-name"
                        value={chatbotName}
                        onChange={(e) => setChatbotName(e.target.value)}
                        className="w-full mb-4 focus-visible:ring-gray-400"
                        placeholder=" "
                      />
                      <label htmlFor="chatbot-name" className="text-muted-foreground">
                        Chatbot Name
                      </label>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Give your AI assistant a memorable name that reflects its purpose and personality.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Sparkles className="h-5 w-5 text-purple-900/80" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Chatbot Tip</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choose a name that's easy to remember and pronounce. Names that reflect your brand or the
                        chatbot's purpose tend to work best.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end pt-4 border-t border-border">
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r bg-purple-900/80 hover:bg-purple-900/40  text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Step 2: Characteristics */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Define Characteristics</CardTitle>
                <CardDescription>Shape your AI assistant's personality and behavior</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative w-12 h-12">
                  <Avatar seed={chatbotName || "das"} />
                  </div>
                  <h3 className="text-lg font-medium">{chatbotName || "Your AI Assistant"}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {characteristics.map((char, index) => (
                      <div
                        key={char.id}
                        className={`characteristic-pill characteristic-pill-${pillColors[index % pillColors.length]} flex items-center gap-1 group`}
                      >
                        <span>{char.content}</span>
                        <button
                          onClick={() => handleRemoveCharacteristic(char.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash className="h-4 w-4 text-red-700" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      ref={characteristicInputRef}
                      value={newCharacteristic}
                      onChange={(e) => setNewCharacteristic(e.target.value)}
                      placeholder="Add a new characteristic (e.g., I am friendly and helpful)"
                      className="min-h-[80px] focus-visible:ring-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleAddCharacteristic()
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="border-purple-200 dark:border-purple-800/50"
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
                    </Button>

                    <Button
                      onClick={handleAddCharacteristic}
                      disabled={!newCharacteristic.trim()}
                      className="bg-purple-900/80 hover:bg-purple-900/40 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Characteristic
                    </Button>
                  </div>

                  {showSuggestions && (
                    <div className="animate-fade-in">
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                        Suggested Characteristics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {characteristicSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-left text-sm p-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={prevStep} className="border-purple-200 dark:border-purple-800/50">
                  Back
                </Button>
                <Button
                variant="outline"
                  onClick={insertChatbot}
                  disabled={isSubmitting || characteristics.length === 0}
                  className="border-purple-200 dark:border-purple-800/50"
                >
                  {isSubmitting ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Chatbot
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
