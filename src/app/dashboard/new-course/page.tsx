'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createCourse } from '@/utils/course/courseActions'
// import { createCourse } from '@/app/course/course-actions'
import { useRouter } from 'next/navigation'

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: number | null;
}

export default function NewCourse() {
  const router = useRouter()
  const [courseName, setCourseName] = useState('')
  const [description, setDescription] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [objectives, setObjectives] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])

  const handleAddQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      text: '', 
      options: [
        { id: Date.now() + 1, text: '' },
        { id: Date.now() + 2, text: '' },
      ],
      correctOptionId: null
    }])
  }

  const handleQuestionChange = (questionId: number, text: string) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, text } : q))
  }

  const handleOptionChange = (questionId: number, optionId: number, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map(o => o.id === optionId ? { ...o, text } : o) }
        : q
    ))
  }

  const handleAddOption = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId && q.options.length < 4
        ? { ...q, options: [...q.options, { id: Date.now(), text: '' }] }
        : q
    ))
  }

  const handleRemoveOption = (questionId: number, optionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId
        ? { ...q, options: q.options.filter(o => o.id !== optionId) }
        : q
    ))
  }

  const handleCorrectOptionChange = (questionId: number, optionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, correctOptionId: optionId } : q
    ))
  }

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Agregar las preguntas
    const courseData = {
      name: courseName,
      description,
      educational_level: educationLevel,
      objective: objectives,
    }

    try {
      const { course } = await createCourse(courseData)
      // TODO: Insert associated questions if any

      // Redirect to the course page if there was no error
      if (course && course.id) {
        router.push(`/course/${course.id}`)
      }
    } catch (error) {
      console.error('Error creating course:', error)
      // Handle the error (e.g., show an error message to the user)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Curso</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="courseName">Nombre del Curso</Label>
          <Input
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel">Nivel Educativo</Label>
          <Select value={educationLevel} onValueChange={setEducationLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el nivel educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primaria">Primaria</SelectItem>
              <SelectItem value="secundaria">Secundaria</SelectItem>
              <SelectItem value="universidad">Universidad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Objetivos</Label>
          <Textarea
            id="objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            required
          />
        </div>

        {/* <Card>
          <CardHeader>
            <CardTitle>Preguntas Iniciales (Opción Múltiple)</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.map((question, qIndex) => (
              <div key={question.id} className="mb-6 p-4 border rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                    placeholder={`Pregunta ${qIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <RadioGroup 
                  value={question.correctOptionId?.toString()} 
                  onValueChange={(value) => handleCorrectOptionChange(question.id, parseInt(value))}
                >
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option.id.toString()} id={`q${question.id}-o${option.id}`} />
                      <Input
                        value={option.text}
                        onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                        placeholder={`Opción ${oIndex + 1}`}
                        className="flex-grow"
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveOption(question.id, option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                {question.options.length < 4 && (
                  <Button type="button" variant="outline" onClick={() => handleAddOption(question.id)} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Opción
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddQuestion} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Pregunta
            </Button>
          </CardContent>
        </Card> */}

        <Button type="submit" className="w-full">Crear Curso</Button>
      </form>
    </div>
  )
}