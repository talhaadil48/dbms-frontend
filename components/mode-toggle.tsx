"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useThemeContext } from "./shadeTheme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export function ModeToggle() {
  const { setTheme } = useTheme()
  const { currentTheme, setCurrentTheme } = useThemeContext();
  console.log(currentTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 dark:neumorphic-dark light:neumorphic-light transition-all hover:scale-110"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glassmorphic">
        <DropdownMenuItem 
          onClick={() => {
            setTheme("light")
            setCurrentTheme("light")
            
          }} 
          className="cursor-pointer"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setTheme("dark")
            setCurrentTheme("dark")

          }} 
          className="cursor-pointer"
        >
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
