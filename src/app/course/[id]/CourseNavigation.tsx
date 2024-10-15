'use client'

import { ClipboardIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CourseNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around p-2">
      <Link href="/c">
        <Button variant="ghost" className={`flex-col items-center ${pathname === "/c" ? "bg-primary/5" : ""}`}>
          <MessageSquareIcon className="h-5 w-5" />
          <span className="text-xs">Novedades</span>
        </Button>
      </Link>
      <Link href="/c/modulos">
        <Button variant="ghost" className={`flex-col items-center ${pathname === "/c/modulos" ? "bg-primary/5" : ""}`}>
          <ClipboardIcon className="h-5 w-5" />
          <span className="text-xs">Modulos</span>
        </Button>
      </Link>
      <Link href="/c/chatbot">
        <Button variant="ghost" className={`flex-col items-center ${pathname === "/c/chatbot" ? "bg-primary/5" : ""}`}>
          <UsersIcon className="h-5 w-5" />
          <span className="text-xs">Chatbot</span>
        </Button>
      </Link>
    </nav>
  )
}
