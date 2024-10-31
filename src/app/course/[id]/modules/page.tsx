"use client"
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, FileIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ClassroomPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const modules = [
    { id: 1, title: "Módulo 1: Introducción a los Números Reales" },
    { id: 2, title: "Módulo 2: Funciones y Gráficas" },
    { id: 3, title: "Módulo 3: Límites y Continuidad" },
    { id: 4, title: "Módulo 4: Derivadas" },
    { id: 5, title: "Módulo 5: Aplicaciones de las Derivadas" },
  ]
  
    return (
        <div>
            <div className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        <Card className="w-full bg-black text-white">
                            <CardHeader>
                                <CardTitle>
                                    <Button className="text-white border-white  hover:bg-gray-800 hover:text-white">
                                        <PlusIcon className="mr-2 h-4 w-4" /> Nuevo módulo
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        {modules.map((module) => (
                            <Card key={module.id} className="w-full">
                                <CardHeader>
                                    <CardTitle>{module.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <Button variant="outline" className="flex items-center">
                                        <FileIcon className="mr-2 h-4 w-4" />
                                        Descargar PDF
                                    </Button>
                                    <Link href="/c/modulos/quiz">
                                        <Button className="flex items-center">
                                            <CheckCircleIcon className="mr-2 h-4 w-4" />
                                            Hacer test
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}