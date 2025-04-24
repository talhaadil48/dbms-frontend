"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Plus, Trash, Trash2, Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Avatar from "@/components/avatar";
export default function CreateChatbotPage() {
  const BASE_URL = "http://localhost:8000";
  const { user } = useUser();
  const [chatbotName, setChatbotName] = useState("");
  const [characteristics, setCharacteristics] = useState([
    { id: 1, content: "I am a helpful assistant." },
    {
      id: 2,
      content: "I provide accurate information about products and services.",
    },
  ]);
  const [avatarSeed, setAvatarSeed] = useState("fluffy");

  const handleAddCharacteristic = () => {
    const newId =
      characteristics.length > 0
        ? Math.max(...characteristics.map((c) => c.id)) + 1
        : 1;
    setCharacteristics([...characteristics, { id: newId, content: "" }]);
  };

  const handleRemoveCharacteristic = (id: number) => {
    setCharacteristics(characteristics.filter((c) => c.id !== id));
  };

  const handleCharacteristicChange = (id: number, content: string) => {
    setCharacteristics(
      characteristics.map((c) => (c.id === id ? { ...c, content } : c))
    );
  };

  const generateNewAvatar = () => {
    const seeds = [
      "fluffy",
      "pixel",
      "micah",
      "adventurer",
      "bottts",
      "initials",
    ];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setAvatarSeed(randomSeed + Math.random().toString(36).substring(2, 8));
  };
  const insertChatbot = async () => {
    const response = await fetch(`${BASE_URL}/create_chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: chatbotName,
        clerk_user_id: user?.id,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      const chatbotId = data.id;
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
        });

        if (response.ok) {
          console.log(
            "Characteristic created successfully:",
            await response.json()
          );
          // ✅ Reset to defaults
          setChatbotName("");
          setCharacteristics([
            { id: 1, content: "I am a helpful assistant." },
            {
              id: 2,
              content:
                "I provide accurate information about products and services.",
            },
          ]);
          setAvatarSeed("fluffy");
        } else {
          const error = await response.json();
          console.log("Error creating characteristic:", error);
        }
      });
    } else {
      const error = await response.json();
      console.log("Error creating chatbot:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Chatbot</h1>
          <p className="text-muted-foreground">
            Design a new chatbot with custom characteristics and behavior.
          </p>
        </div>
        <Button
          onClick={insertChatbot}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Create Chatbot
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Set up the core details for your new chatbot.
            </CardDescription>
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
              <Label>Chatbot Avatar</Label>
              <div className="flex items-center gap-4">
              <Avatar seed={chatbotName || "create-chatbot"} />

                
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:neumorphic-dark light:neumorphic-light">
          <CardHeader>
            <CardTitle>Chatbot Characteristics</CardTitle>
            <CardDescription>
              Define how your chatbot should behave and respond.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {characteristics.map((characteristic) => (
              <div key={characteristic.id} className="space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`characteristic-${characteristic.id}`}>
                    Characteristic {characteristic.id}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveCharacteristic(characteristic.id)}
                >
                  {/* <Trash2 size={16} color></Trash2> */}
                  <Trash size={16} className="text-red-500" />
                </Button>
                <Textarea
                  id={`characteristic-${characteristic.id}`}
                  placeholder="e.g., I am friendly and helpful."
                  value={characteristic.content}
                  onChange={(e) =>
                    handleCharacteristicChange(
                      characteristic.id,
                      e.target.value
                    )
                  }
                  rows={3}
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={handleAddCharacteristic}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Characteristic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
