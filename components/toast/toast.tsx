"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import type { ToastType } from "./toast-context"

interface ToastComponentProps {
  id: string
  title?: string
  message: string
  type: ToastType
  onClose: () => void
}

export const Toast: React.FC<ToastComponentProps> = ({ title, message, type, onClose }) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 0.5
      })
    }, 25)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (progress === 0) {
      onClose()
    }
  }, [progress, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500 dark:dark:dark:text-gray-400" />
    }
  }

  const getToastClasses = () => {
    const baseClasses =
      "relative flex items-start gap-3 rounded-lg p-4 shadow-lg border max-w-md w-full overflow-hidden"

    switch (type) {
      case "success":
        return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`
      case "error":
        return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`
      case "info":
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`
      case "warning":
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`
      default:
        return `${baseClasses} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`
    }
  }

  return (
    <div className={getToastClasses()}>
      <div className="flex-shrink-0 pt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>}
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close toast"
      >
        <X className="h-4 w-4 text-gray-500 dark:dark:dark:text-gray-400" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full">
        <div
          className={`h-full ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
                ? "bg-red-500"
                : type === "info"
                  ? "bg-blue-500"
                  : type === "warning"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}