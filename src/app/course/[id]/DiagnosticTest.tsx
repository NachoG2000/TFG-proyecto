'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function DiagnosticTest({ courseId }: { courseId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data: course, error } = await supabase
        .from('courses')
        .select('diagnostic_questions')
        .eq('id', courseId)
        .single();

      if (error || !course) {
        console.error('Error al obtener las preguntas:', error);
        return;
      }
      if (course.diagnostic_questions) {
        setQuestions((course.diagnostic_questions as { questions: any[] }).questions || []);
      } else {
        setQuestions([]);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [courseId]);

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = async () => {
    const correctOption = questions[currentQuestion].options.find((option: any) => option.isCorrect);

    if (selectedAnswer === correctOption.answer) {
      setScore(score + 1);
    }

    setSelectedAnswer('');

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
      await handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    // Actualizar la participación con has_completed_diagnostic = true
    const { error } = await supabase
      .from('participations')
      .update({ has_completed_diagnostic: true })
      .eq('course_id', courseId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

    if (error) {
      console.error('Error al actualizar la participación:', error);
      return;
    }
  };

  if (loading) {
    return <div>Cargando el test de diagnóstico...</div>;
  }

  return (
    <div className="flex justify-center">
      <Card className="mt-10 w-full max-w-2xl border-0 rounded-lg p-4 shadow-md">
        <CardHeader>
          <CardTitle>Test de Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent>
          {showScore ? (
            <div className="">
              <h2 className="text-2xl font-bold my-4">Quiz Completado</h2>
              <p className="text-xl">
                Tu puntuación es {score} de {questions.length}
              </p>
              <Button className="mt-4" onClick={() => router.refresh()}>
                Continuar al Curso
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-2">Pregunta {currentQuestion + 1} de {questions.length}</p>
              <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />
              <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-2">
                {questions[currentQuestion].options.map((option: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.answer} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option.answer}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button className="mt-4" onClick={handleNextQuestion} disabled={!selectedAnswer}>
                {currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
