"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Bot, ExternalLink, MessageSquare, Settings, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  // Update the landing page to be responsive
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Static background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <GridPattern />
        </div>

        {/* Static decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-blue-500/5 dark:bg-purple-500/5"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-purple-500/5 dark:bg-blue-500/5"></div>
        <div className="absolute top-2/3 left-2/3 w-24 sm:w-48 h-24 sm:h-48 rounded-full bg-blue-500/5 dark:bg-purple-500/5"></div>
        <div className="absolute top-1/2 right-1/2 w-36 sm:w-72 h-36 sm:h-72 rounded-full bg-purple-500/5 dark:bg-blue-500/5"></div>
      </div>

      {/* Header with mode toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="NexusAI Logo" width={28} height={28} />
          <span className="font-bold text-lg sm:text-xl">Oraclia</span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 relative z-10">
        <div className="flex flex-col items-center justify-center w-full max-w-6xl">
          {/* Hero section */}
          <div className="mb-12 sm:mb-16 text-center relative">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-70"></div>
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-background flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="NexusAI Logo"
                      width={50}
                      height={50}
                      className="sm:w-[75px] sm:h-[75px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              AI Chatbot Platform
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Create, manage, and analyze AI-powered chatbots with our cutting-edge platform.
            </p>
          </div>

          {/* Features section */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Cutting-Edge Features</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>

          {/* CTA section */}
          <div className="mt-12 sm:mt-16 text-center">
            <Link href="/login?type=admin">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter the Future
                  <ExternalLink size={16} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
              Experience the next generation of AI chatbots
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const features = [
  {
    icon: <Bot className="h-8 w-8 text-blue-500" />,
    title: "Intelligent Bots",
    description: "Design custom AI assistants tailored to your needs.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
    title: "Smart Conversations",
    description: "Monitor and analyze chat sessions in real-time.",
  },
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: "User Insights",
    description: "Gain valuable insights from user interactions.",
  },
  {
    icon: <Settings className="h-8 w-8 text-yellow-500" />,
    title: "Easy Setup",
    description: "Customize your chatbots with a user-friendly interface.",
  },
]

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 border border-gray-200 dark:border-gray-800 bg-background/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4 p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StaticOrbitDots() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-blue-400"
          style={{
            transform: `rotate(${i * 90}deg) translateY(-60px)`,
            transformOrigin: "center center",
            left: "calc(50% - 1.5px)",
            top: "calc(50% - 1.5px)",
          }}
        />
      ))}
    </>
  )
}

function GridPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}
