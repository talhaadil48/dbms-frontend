import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="animate-fade-in max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="NexusAI Logo" width={28} height={28} />
            <span className="font-bold text-2xl">Oraclia</span>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/admin/dashboard" />
      </div>
    </div>
  );
}
