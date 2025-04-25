"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 size={20} />,
    },
    {
      title: "Create Chatbot",
      href: "/admin/create-chatbot",
      icon: <Plus size={20} />,
    },
    {
      title: "Chat Sessions",
      href: "/admin/chat-sessions",
      icon: <MessageSquare size={20} />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } h-full bg-card border-r border-border transition-all duration-300 flex flex-col dark:neumorphic-dark light:neumorphic-light`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">CB</span>
              </div>
              <span className="font-bold">Chatbot Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      collapsed ? "px-2" : "px-3"
                    } transition-all hover:bg-accent`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className={`w-full justify-start ${
              collapsed ? "px-2" : "px-3"
            } text-destructive hover:text-destructive hover:bg-destructive/10`}
          >
            <LogOut size={20} className="mr-2" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navigation */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card dark:neumorphic-dark light:neumorphic-light pt-[2.25rem] pb-[2.25rem]">
          <div className="text-lg font-semibold">
            {pathname
              .split("/")
              .pop()
              ?.replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton showName />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 pt-5 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
