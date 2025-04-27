"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  Plus,
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Update the sidebar to be more responsive
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  // Add a function to handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check if we're on mobile
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile header */}
      <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-card dark:neumorphic-dark light:neumorphic-light">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="NexusAI Logo" width={28} height={28} />
          <span className="font-bold text-xl">Oraclia</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileOpen ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
          <ModeToggle />
        </div>
      </header>

      {/* Sidebar - hidden on mobile unless toggled */}
      <aside
        className={`${collapsed ? "w-16" : "w-64"} ${
          mobileOpen ? "fixed inset-0 z-50" : "hidden md:flex"
        } h-full bg-card border-r border-border transition-all duration-300 flex flex-col dark:neumorphic-dark light:neumorphic-light`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          {!collapsed && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="NexusAI Logo"
                  width={28}
                  height={28}
                />
                <span className="font-bold text-xl">Oraclia</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
            style={{ display: mobileOpen ? "none" : "flex" }}
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
            } text-gray-400`}
          >
            <LogOut size={20} className="mr-2" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navigation - only on desktop */}
        <header className="h-16 border-b border-border hidden md:flex items-center justify-between px-4 bg-card dark:neumorphic-dark light:neumorphic-light pt-[2.25rem] pb-[2.25rem]">
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
        <main className="flex-1 overflow-auto p-4 md:p-6 pt-5 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
