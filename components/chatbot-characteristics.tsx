"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface ChatbotCharacteristicsProps {
  characteristics: string[]
}

export function ChatbotCharacteristics({ characteristics }: ChatbotCharacteristicsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-full">
        <Info size={20} />
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 z-10 animate-fade-in">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2">Chatbot Characteristics</h3>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {characteristics.map((char, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

