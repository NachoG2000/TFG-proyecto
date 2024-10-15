"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon, UserPlusIcon } from "lucide-react"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function DashboardContent() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div>
      <main className="flex-1 p-4 overflow-auto">
        <ScrollArea className="h-full">
          <div>
            <h2 className="text-lg font-semibold mb-4">Cursos en los que te inscribiste</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
              <Link href="/c" className="block">
                <Card className="w-full max-w-md bg-pink-600 text-white">
                  <CardHeader>
                    <CardTitle>Introducción a la Matemática</CardTitle>
                    <CardDescription className="text-pink-100">2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>María Fernández</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/c" className="block">
                <Card className="w-full max-w-md bg-green-600 text-white">
                  <CardHeader>
                    <CardTitle>Introducción a la Química</CardTitle>
                    <CardDescription className="text-pink-100">2023</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Javier López</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-8">Cursos en los que eres profesor</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
              <Link href="/p" className="block">
                <Card className="w-full max-w-md bg-blue-600 text-white">
                  <CardHeader>
                    <CardTitle>Introducción a la Historia</CardTitle>
                    <CardDescription className="text-pink-100">2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Ignacio Garcia</p>
                  </CardContent>
                </Card>
              </Link>
              </div>
            </div>
          </div>
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  size="icon"
                  className="fixed bottom-4 right-4 rounded-full shadow-lg"
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-4">
                <ClassOptions />
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="fixed bottom-4 right-4 rounded-full shadow-lg"
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ClassOptions />
              </DialogContent>
            </Dialog>
          )}
        </ScrollArea>
      </main>
    </div>
  )
}

function ClassOptions() {
  const router = useRouter()

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Elige una opción</h2>
        <Button variant="outline" className="w-full justify-start text-left" onClick={() => router.push("/dashboard/new-course")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Crear nuevo curso
        </Button>
        <Button variant="outline" className="w-full justify-start text-left" onClick={() => console.log("Join class")}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Unirse a curso existente
        </Button>
      </div>
    )
  }

