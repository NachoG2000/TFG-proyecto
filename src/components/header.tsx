"use client"

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LogOut, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Sidebar from './sidebar'
import { handleSignOut as handleSignOutAction } from '@/utils/auth/authActions'
// import AvatarComponent from './avatarComponent'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    try {
      await handleSignOutAction()
      router.refresh()
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background text-foreground">
      <div className="flex items-center space-x-4">
        {/* Sidebar trigger button for mobile */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard">
            <h1 className="text-xl font-semibold">Classroom</h1>
        </Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={""} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}

// SidebarContent would be a component or content that you'd like to display in the sidebar when it's opened
function SidebarContent() {
  return (
    <div>
      <Sidebar />
    </div>
  )
}
