import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Bot, MessageSquare, Settings, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="animate-fade-in flex flex-col items-center justify-center w-full max-w-5xl">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
              <Zap size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">AI Chatbot Platform</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and analyze AI-powered chatbots with our cutting-edge platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl animate-slide-up">
          <FeatureCard
            icon={<Bot className="h-8 w-8 text-blue-500" />}
            title="Intelligent Bots"
            description="Design custom AI assistants tailored to your needs."
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-purple-500" />}
            title="Smart Conversations"
            description="Monitor and analyze chat sessions in real-time."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-green-500" />}
            title="User Insights"
            description="Gain valuable insights from user interactions."
          />
          <FeatureCard
            icon={<Settings className="h-8 w-8 text-yellow-500" />}
            title="Easy Setup"
            description="Customize your chatbots with a user-friendly interface."
          />
        </div>

        <div className="mt-12">
          <Link href="/login?type=admin">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Enter the Future
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="glassmorphic dark:neumorphic-dark light:neumorphic-light overflow-hidden transition-all hover-lift">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-primary/10 glow">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

