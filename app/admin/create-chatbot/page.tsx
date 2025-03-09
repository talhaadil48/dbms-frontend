"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Plus, Trash2, Upload } from "lucide-react"

export default function CreateChatbotPage() {
  const [chatbotName, setChatbotName] = useState("")
  const [category, setCategory] = useState("")
  const [characteristics, setCharacteristics] = useState([
    { id: 1, content: "I am a helpful assistant." },
    { id: 2, content: "I provide accurate information about products and services." },
  ])
  const [avatarSeed, setAvatarSeed] = useState("fluffy")

  const handleAddCharacteristic = () => {
    const newId = characteristics.length > 0 ? Math.max(...characteristics.map((c) => c.id)) + 1 : 1
    setCharacteristics([...characteristics, { id: newId, content: "" }])
  }

  const handleRemoveCharacteristic = (id: number) => {
    setCharacteristics(characteristics.filter((c) => c.id !== id))
  }

  const handleCharacteristicChange = (id: number, content: string) => {
    setCharacteristics(characteristics.map((c) => (c.id === id ? { ...c, content } : c)))
  }

  const generateNewAvatar = () => {
    const seeds = ["fluffy", "pixel", "micah", "adventurer", "bottts", "initials"]
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)]
    setAvatarSeed(randomSeed + Math.random().toString(36).substring(2, 8))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Chatbot</h1>
          <p className="text-muted-foreground">Design a new chatbot with custom characteristics and behavior.</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          Save Chatbot
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Set up the core details for your new chatbot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatbot-name">Chatbot Name</Label>
              <Input
                id="chatbot-name"
                placeholder="e.g., Customer Support Assistant"
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
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
                    src={`https://api.dicebear.com/7.x/${avatarSeed.split(/[0-9]/)[0] || "bottts"}/svg?seed=${avatarSeed}`}
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
            {characteristics.map((characteristic) => (
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
                  placeholder="e.g., I am friendly and helpful."
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

