"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { ToastContainer } from "./toast-container"

export type ToastType = "success" | "error" | "info" | "warning" | "default"

export interface ToastProps {
  id: string
  message: string
  title?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = uuidv4()
    const newToast = { ...toast, id }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-remove toast after duration
    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

