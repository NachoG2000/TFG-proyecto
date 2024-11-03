'use client'

import { BarChartIcon, ClipboardIcon, MessageSquareIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CourseNavigation({ courseId, participationId, role }: { courseId: string, participationId: string, role: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around p-2">
      <Link href={`/course/${courseId}`}>
        <Button variant="ghost" className={`flex-col items-center h-max ${pathname === `/course/${courseId}` ? "bg-primary/5" : ""}`}>
        <MessageSquareIcon className="h-3 w-3" />
        <span className="text-xs">Novedades</span>
        </Button>
      </Link>
      <Link href={`/course/${courseId}/modules`}>
        <Button variant="ghost" className={`flex-col items-center h-max ${pathname === `/course/${courseId}/modules` ? "bg-primary/5" : ""}`}>
          <ClipboardIcon className="h-3 w-3" />
          <span className="text-xs">Modulos</span>
        </Button>
      </Link>
      <Link href={`/course/${courseId}/chatbot`}>
        <Button variant="ghost" className={`flex-col items-center h-max ${pathname === `/course/${courseId}/chatbot` ? "bg-primary/5" : ""}`}>
          <UsersIcon className="h-3 w-3" />
          <span className="text-xs">Chatbot</span>
        </Button>
      </Link>
      {role === 'student' ? (
        <Link href={`/course/${courseId}/profile/${participationId}`}>
          <Button variant="ghost" className={`flex-col items-center h-max ${pathname === `/course/${courseId}/profile/${participationId}` ? "bg-primary/5" : ""}`}>
            <UserIcon className="h-3 w-3" />
            <span className="text-xs">Perfil</span>
          </Button>
        </Link>
      ) : (
        <Link href={`/course/${courseId}/performances`}>
          <Button variant="ghost" className={`flex-col items-center h-max ${pathname === `/course/${courseId}/performances` ? "bg-primary/5" : ""}`}>
            <BarChartIcon className="h-3 w-3" />
            <span className="text-xs">Desempeño</span>
          </Button>
        </Link>
      )}
    </nav>
  )
}
