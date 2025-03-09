"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ElegantLoaderProps {
  text?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal"
}

export function ElegantLoader({ 
  text = "Loading your AI experience", 
  size = "md", 
  variant = "default" 
}: ElegantLoaderProps) {
  const [dots, setDots] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4)
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer rotating ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/70 border-b-primary/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle rotating ring (opposite direction) */}
        <motion.div 
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-purple-500 border-l-purple-500/70 border-b-purple-500/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing circle */}
        <motion.div 
          className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {/* Bot icon */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-1/3 h-1/3"
          >
            <rect width="18" height="10" x="3" y="11" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16" />
            <line x1="16" y1="16" x2="16" y2="16" />
          </svg>
        </motion.div>
        
        {/* Floating particles */}
        {variant === "default" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/80"
                initial={{ 
                  x: 0, 
                  y: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Loading text with animated dots */}
      <div className="mt-8 text-center">
        <motion.p 
          className={`font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 ${textSizeClasses[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {text}{'.'.repeat(dots)}
        </motion.p>
      </div>
    </div>
  )
}
