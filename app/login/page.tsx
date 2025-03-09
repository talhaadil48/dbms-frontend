"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Eye, EyeOff, Github, Mail } from "lucide-react"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="animate-fade-in w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16 rounded-full mr-10 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl font-bold text-white">CB</span>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/admin/dashboard"/>

      </div>
    </div>
  )
}

