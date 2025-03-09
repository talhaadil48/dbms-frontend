"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Save } from "lucide-react"

interface CharacteristicsManagerProps {
  chatbot: {
    id: number
    name: string
    characteristics: string[]
  }
  onClose: () => void
  onUpdate: (newCharacteristics: string[]) => void
}

export function CharacteristicsManager({ chatbot, onClose, onUpdate }: CharacteristicsManagerProps) {
  const [characteristics, setCharacteristics] = useState(chatbot.characteristics)
  const [newCharacteristic, setNewCharacteristic] = useState("")

  const handleAdd = () => {
    if (newCharacteristic.trim()) {
      setCharacteristics([...characteristics, newCharacteristic.trim()])
      setNewCharacteristic("")
    }
  }

  const handleRemove = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onUpdate(characteristics)
  }

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Manage Characteristics for {chatbot.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              placeholder="New characteristic"
            />
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {characteristics.map((char, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                <span>{char}</span>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </Card>
  )
}

