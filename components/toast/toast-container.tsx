"use client"

import type React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "./toast-context"
import { Toast } from "./toast"

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2 max-h-screen overflow-hidden pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto"
          >
            <Toast
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

