"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Plus, Trash2, Upload, Copy, Check } from "lucide-react"
import { useToast } from "@/components/toast"

// Mock data for existing chatbot
const mockChatbot = {
  id: 1,
  name: "Customer Support Bot",
  category: "customer-support",
  avatarSeed: "bottts5678",
  characteristics: [
    { id: 1, content: "I am a helpful customer support assistant." },
    { id: 2, content: "I can answer questions about products and services." },
    { id: 3, content: "I'm always polite and professional." },
  ],
}

export default function EditChatbotPage() {
  const [chatbot, setChatbot] = useState(mockChatbot)
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()


  useEffect(() => {
    // In a real application, you would fetch the chatbot data here
    setChatbot(mockChatbot)
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatbot({ ...chatbot, name: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    setChatbot({ ...chatbot, category: value })
  }

  const handleAddCharacteristic = () => {
    const newId = Math.max(...chatbot.characteristics.map((c) => c.id)) + 1
    setChatbot({
      ...chatbot,
      characteristics: [...chatbot.characteristics, { id: newId, content: "" }],
    })
  }

  const handleRemoveCharacteristic = (id: number) => {
    setChatbot({
      ...chatbot,
      characteristics: chatbot.characteristics.filter((c) => c.id !== id),
    })
  }

  const handleCharacteristicChange = (id: number, content: string) => {
    setChatbot({
      ...chatbot,
      characteristics: chatbot.characteristics.map((c) => (c.id === id ? { ...c, content } : c)),
    })
  }

  const generateNewAvatar = () => {
    const seeds = ["bottts", "pixel", "micah", "adventurer", "initials"]
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)]
    setChatbot({ ...chatbot, avatarSeed: randomSeed + Math.random().toString(36).substring(2, 8) })
  }

  const copyLink = () => {
    const link = `http://localhost:3000/chat/${chatbot.id}`
    navigator.clipboard.writeText(link)
    addToast({
      type: "info",  // Options: "success", "error", "info", "warning", "default"
      title: "Success", // Optional title
      message: "Your action was completed successfully.",
      duration: 2000,   // Optional, defaults to 5000ms (5 seconds)
    })
    setCopied(true)
    
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 border-b">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
          <div className="pt-2 pb-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Chatbot</h1>
            <p className="text-muted-foreground">Modify your chatbot's characteristics and behavior.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-secondary/50 rounded-full px-4 py-2">
              <span className="text-sm text-muted-foreground">Chat Link:</span>
              <span className="text-sm font-medium">https://your-domain.com/chat/{chatbot.id}</span>
              <Button size="icon" variant="ghost" onClick={copyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto px-4">
        <Card className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the core details of your chatbot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatbot-name">Chatbot Name</Label>
              <Input id="chatbot-name" value={chatbot.name} onChange={handleNameChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={chatbot.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-support">Customer Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="onboarding">User Onboarding</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chatbot Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/${chatbot.avatarSeed.split(/[0-9]/)[0]}/svg?seed=${chatbot.avatarSeed}`}
                    alt="Chatbot Avatar"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                    <Bot size={24} />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={generateNewAvatar} className="w-full">
                    Generate Random
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload size={14} className="mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader>
            <CardTitle>Chatbot Characteristics</CardTitle>
            <CardDescription>Define how your chatbot should behave and respond.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chatbot.characteristics.map((characteristic) => (
              <div key={characteristic.id} className="space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`characteristic-${characteristic.id}`}>Characteristic {characteristic.id}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCharacteristic(characteristic.id)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </div>
                <Textarea
                  id={`characteristic-${characteristic.id}`}
                  value={characteristic.content}
                  onChange={(e) => handleCharacteristicChange(characteristic.id, e.target.value)}
                  rows={3}
                />
              </div>
            ))}

            <Button variant="outline" onClick={handleAddCharacteristic} className="w-full">
              <Plus size={16} className="mr-2" />
              Add Characteristic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

