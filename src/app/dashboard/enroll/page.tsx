'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { checkEnrollmentCode } from '@/utils/course/courseActions'

export default function EnrollPage() {
  const [enrollmentCode, setEnrollmentCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { courseId, studentParticipation } = await checkEnrollmentCode(enrollmentCode);
      console.log("enroll page.tsx", { courseId, studentParticipation })
      // Redirect to the course page or show a success message
      router.push(`/course/${courseId}`)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'An error occurred while enrolling')
      } else {
        setError('An unexpected error occurred while enrolling')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Card className="bg-white rounded-lg shadow-md sm:min-w-96">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Unirse a curso existente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enrollmentCode">Código de inscripción</Label>
              <Input
                id="enrollmentCode"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                placeholder="Introduce el código de inscripción"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Unirse'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
