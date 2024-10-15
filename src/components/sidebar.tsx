import { Button } from '@/components/ui/button'
import {
  HomeIcon,
  SettingsIcon,
  HelpCircleIcon,
} from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <nav className="space-y-2">
      <Link href="/dashboard">
        <Button variant="ghost" className="w-full justify-start">
          <HomeIcon className="mr-2 h-4 w-4" />
          Cursos
        </Button>
      </Link>
      {/* <Button variant="ghost" className="w-full justify-start">
        <CalendarIcon className="mr-2 h-4 w-4" />
        Calendario
      </Button> */}
      <div className="py-2">
        <h3 className="px-4 text-sm font-semibold">CURSOS EN LOS QUE TE INSCRIBISTE</h3>
      </div>
      <Button variant="ghost" className="w-full justify-start  hover:bg-pink-200 hover:text-pink-800">
        Introducción a la Matemática
      </Button>
      <Button variant="ghost" className="w-full justify-start  hover:bg-green-200 hover:text-green-800">
        Introducción a la Química
      </Button>
      <div className="py-2">
        <h3 className="px-4 text-sm font-semibold">CURSOS EN LOS QUE ERES PROFESOR</h3>
      </div>
      <Button variant="ghost" className="w-full justify-start  hover:bg-blue-200 hover:text-blue-800">
        Introducción a la Historia
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <SettingsIcon className="mr-2 h-4 w-4" />
        Configuración
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <HelpCircleIcon className="mr-2 h-4 w-4" />
        Ayuda
      </Button>
    </nav>
  )
}
