'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound({
  error,
  reset,
}: {
  error?: Error
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">La página que estás buscando no existe o ha sido movida.</p>
        <div className="flex space-x-4">
          <Button 
            onClick={() => reset()} 
          >
            Intentar de nuevo
          </Button>
          <Button 
            onClick={() => router.push('/dashboard')} 
            variant="outline"
          >
            Volver al dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
