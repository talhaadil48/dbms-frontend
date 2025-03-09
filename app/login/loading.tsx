import { ElegantLoader } from "@/components/elegant-loader"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50">
      <ElegantLoader size="sm" text="Preparing your AI experience" />
    </div>
  )
}

