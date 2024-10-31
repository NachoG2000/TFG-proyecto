"use client"

import React, { useState } from 'react'
import { Send, Plus, MessageSquare, PenTool, Book, Grid, Settings, Menu, X, ChevronDown, Image, FileText, Edit, Sparkles } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ChatbotResponsive() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: '¿En qué puedo ayudarte?' }
  ])
  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
    }
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <Button className="mb-4 text-white border-white hover:bg-gray-800">
        <Plus className="mr-2 h-4 w-4" /> Nueva conversación
      </Button>
      <ScrollArea className="flex-grow">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-white">
            <MessageSquare className="mr-2 h-4 w-4" /> ChatGPT
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-white">
            <PenTool className="mr-2 h-4 w-4" /> Escribir para mí
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-white">
            <Book className="mr-2 h-4 w-4" /> Tutor virtual
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-white">
            <Grid className="mr-2 h-4 w-4" /> Explorar GPT
          </Button>
        </div>
      </ScrollArea>
      <Separator className="my-4 bg-gray-600" />
      <Button variant="ghost" className="justify-start text-white hover:bg-gray-800">
        <Settings className="mr-2 h-4 w-4" /> Configuración
      </Button>
    </div>
  )

  return (
    <div className="flex h-[calc(100dvh-26dvh)] border-2 border-gray-100 overflow-hidden rounded-xl">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 bg-black text-white p-4 overflow-hidden">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-black text-white p-4 flex justify-between items-center md:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-black text-white p-4">
              <Button variant="ghost" size="icon" className="absolute right-4 top-4 text-white" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            ChatGPT 4o <ChevronDown className="ml-2 h-4 w-4" />
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <PenTool className="h-6 w-6" />
          </Button>
        </header>

        {/* Chat area */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          <div className="max-w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick actions */}
        <div className="p-4 w-full">
          <div className="grid grid-cols-2 gap-2 mb-4 max-w-full">
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-200 whitespace-nowrap">
              <Image className="mr-2 h-4 w-4" /> Crear una imagen
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-200 whitespace-nowrap">
              <FileText className="mr-2 h-4 w-4" /> Resumir texto
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-200 whitespace-nowrap">
              <Edit className="mr-2 h-4 w-4" /> Ayúdame a escribir
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-200 whitespace-nowrap">
              <Sparkles className="mr-2 h-4 w-4" /> Sorpréndeme
            </Button>
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 w-full">
          <div className="flex space-x-2 max-w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Envía un mensaje a ChatGPT"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow"
            />
            <Button onClick={handleSend} className="bg-black hover:bg-gray-800 text-white whitespace-nowrap">
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            ChatGPT puede cometer errores. Considera verificar la información importante.
          </p>
        </div>
      </div>
    </div>
  )
}