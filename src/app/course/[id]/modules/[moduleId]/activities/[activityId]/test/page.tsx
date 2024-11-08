'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

export default function ModuleTest() {
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();
    const { id, moduleId, activityId } = useParams();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [participationId, setParticipationId] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);

            // Obtener el usuario actual
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error('Error al obtener el usuario:', userError);
                setErrorMessage('No se pudo obtener el usuario.');
                setLoading(false);
                return;
            }

            // Obtener la participación del usuario en el curso
            const { data: participation, error: participationError } = await supabase
                .from('participations')
                .select('id')
                .eq('course_id', id)
                .eq('user_id', user.id)
                .single();

            if (participationError || !participation) {
                console.error('Error al obtener la participación:', participationError);
                setErrorMessage('No se pudo obtener la participación.');
                setLoading(false);
                return;
            }

            setParticipationId(participation.id);

            // Obtener la actividad con el activityId proporcionado
            const { data: activityData, error: activityError } = await supabase
                .from('activities')
                .select('id, questions')
                .eq('id', activityId)
                .single();

            if (activityError || !activityData) {
                console.error('Error al obtener la actividad:', activityError);
                setErrorMessage('No se pudo obtener la actividad.');
                setLoading(false);
                return;
            }

            // Establecer las preguntas
            if (activityData.questions && typeof activityData.questions === 'object') {
                setQuestions((activityData.questions as any).questions || []);
            } else {
                setQuestions([]);
            }

            setLoading(false);
        };

        fetchQuestions();
    }, [id, moduleId, activityId]);

    const handleAnswerSelect = (value: string) => {
        setSelectedAnswer(value);
    };

    const handleNextQuestion = async () => {
        // Guardar la respuesta del usuario
        const selectedOptionIndex = questions[currentQuestion].options.findIndex(
            (option: Option) => option.answer === selectedAnswer
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
            (option: Option) => option.isCorrect
        );

        if (selectedOptionIndex === correctOptionIndex) {
            setScore(score + 1);
        }

        setSelectedAnswer('');

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            await handleQuizCompletion();
        }
    };

    const handleQuizCompletion = async () => { // TODO: Implementar la lógica para guardar las respuestas en la tabla 'performances'
        console.log("handleQuizCompletion", participationId, activityId, userAnswers, score)
        // // Guardar las respuestas en la tabla 'performances'
        // const { error: insertError } = await supabase
        //     .from('performances')
        //     .insert({
        //         participation_id: participationId,
        //         activity_id: activityId,
        //         responses: { responses: userAnswers },
        //         score: score,
        //         generated_at: new Date(),
        //     });

        // if (insertError) {
        //     console.error('Error al guardar las respuestas:', insertError);
        //     toast({
        //         title: 'Error',
        //         description: 'No se pudieron guardar las respuestas. Por favor, inténtalo de nuevo.',
        //         variant: 'destructive',
        //     });
        //     return;
        // }

        // // Mostrar la puntuación
        // setShowScore(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Cargando el test...</div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Error: {errorMessage}</div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>No hay preguntas disponibles para este test.</div>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <Card className="mt-10 w-full max-w-2xl border-0 rounded-lg p-4 shadow-md">
                <CardHeader>
                    <CardTitle>Evaluación del Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                    {showScore ? (
                        <div>
                            <h2 className="text-2xl font-bold my-4">Test Completado</h2>
                            <p className="text-xl">
                                Tu puntuación es {score} de {questions.length}
                            </p>
                            <Button className="mt-4" onClick={() => router.push(`/course/${id}/modules`)}>
                                Volver a los Módulos
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="mb-2">Pregunta {currentQuestion + 1} de {questions.length}</p>
                            <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />
                            <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>
                            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-2">
                                {questions[currentQuestion].options.map((option: Option, index: number) => (
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
