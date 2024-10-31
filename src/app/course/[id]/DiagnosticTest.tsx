'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createDiagnosticPerformance } from '@/utils/performance/performanceActions';

type Option = {
  answer: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  options: Option[];
};

type ActivityQuestions = {
  questions: Question[];
};

type Activity = {
  id: string;
  questions: ActivityQuestions;
};

export default function DiagnosticTest({ courseId }: { courseId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [participationId, setParticipationId] = useState<string>('');
  const [activityId, setActivityId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);

      // Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error al obtener el usuario:', userError);
        setErrorMessage('No se pudo obtener el usuario.');
        return;
      }

      // Obtener la participación del usuario en el curso
      const { data: participation, error: participationError } = await supabase
        .from('participations')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (participationError || !participation) {
        console.error('Error al obtener la participación:', participationError);
        setErrorMessage('No se pudo obtener la participación.');
        return;
      }

      setParticipationId(participation.id);

      // Obtener la actividad de diagnóstico asociada a la participación
      const { data: activityData, error: activityError } = await supabase
      .from('activities')
      .select('id, questions')
      .eq('participation_id', participation.id)
      .eq('name', 'Evaluación Diagnóstica')
      .single();
    
    if (activityError || !activityData) {
      console.error('Error al obtener la actividad:', activityError);
      setErrorMessage('No se pudo obtener la actividad de diagnóstico.');
        return;
      }

      // Cast activityData to Activity type
      const activity = activityData as Activity;

      setActivityId(activity.id);

      // Establecer las preguntas
      if (activity.questions) {
        setQuestions(activity.questions.questions || []);
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
    // Guardar la respuesta del usuario
    const selectedOptionIndex = questions[currentQuestion].options.findIndex(
      (option: any) => option.answer === selectedAnswer
    );

    setUserAnswers([
      ...userAnswers,
      {
        questionIndex: currentQuestion,
        selectedOptionIndex,
      },
    ]);

    // Calcular el puntaje
    const correctOptionIndex = questions[currentQuestion].options.findIndex(
      (option: any) => option.isCorrect
    );

    if (selectedOptionIndex === correctOptionIndex) {
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

  const handleQuizCompletion = async () => { // TODO: REFACTORIZAR PARA QUE TODO SE HAGA EN PERFORMANCE ACTIONS
    // Guardar las respuestas en la tabla 'performances'
    const { error: insertError } = await supabase
      .from('performances')
      .insert({
        participation_id: participationId,
        activity_id: activityId,
        responses: { responses: userAnswers },
      });

    if (insertError) {
      console.error('Error al guardar las respuestas:', insertError);
      return;
    }

    // Generar la performance
    try {
      await createDiagnosticPerformance(participationId, activityId);
    } catch (error) {
      console.error('Error al generar la performance:', error);
    }

    // Redirigir o actualizar la interfaz
    router.refresh();
  };

  if (loading) {
    return <div>Cargando el test de diagnóstico...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  if (questions.length === 0) {
    return <div>No hay preguntas disponibles para este diagnóstico.</div>;
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
