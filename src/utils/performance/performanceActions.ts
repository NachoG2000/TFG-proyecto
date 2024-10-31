import { generatePerformance } from '@/utils/llm/generatePerformance';
import { createClient } from '@/utils/supabase/client';

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

export async function createDiagnosticPerformance(participationId: string, activityId: string): Promise<void> {
    const supabase = createClient();

    // Obtener la participación
    const { data: participation, error: participationError } = await supabase
        .from('participations')
        .select('user_id, course_id')
        .eq('id', participationId)
        .single();

    if (participationError || !participation) {
        throw new Error('No se pudo obtener la participación');
    }

    // Obtener la actividad de diagnóstico asociada a la participación
    const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('id, questions')
        .eq('participation_id', participationId)
        .eq('name', 'Evaluación Diagnóstica')
        .single();

    if (activityError || !activityData) {
        console.error('Error al obtener la actividad:', activityError);
        throw new Error('No se pudo obtener la actividad de diagnóstico.');
    }

    // Obtener el curso
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('name, description, objective')
        .eq('id', participation.course_id as string)
        .single();

    if (courseError || !course) {
        throw new Error('No se pudo obtener el curso');
    }

    // Obtener las respuestas del estudiante
    const { data: performance, error: performanceError } = await supabase
        .from('performances')
        .select('responses')
        .eq('participation_id', participationId)
        .eq('activity_id', activityId)
        .single();

    if (performanceError || !performance) {
        throw new Error('No se pudo obtener las respuestas del estudiante');
    }

    const activity = activityData as Activity;

    // Preparar los datos para el LLM
    const input = {
        courseDetails: course,
        diagnosticQuestions: activity.questions.questions, // Ajusta según tu estructura
        studentResponses: performance.responses,
    };

    // Generar la evaluación
    //
    // CORREGIR CORREGIR CORREGIR CORREGIR CORREGIR CORREGIR CORREGIR (NO ES ANY)
    //
    const performanceResult = await generatePerformance(input as any);

    // Actualizar la tabla performances con el resultado
    const { error: updateError } = await supabase
        .from('performances')
        .update({
            score: performanceResult.score,
            feedback: performanceResult.feedback,
            improvement_areas: performanceResult.improvementAreas,
        })
        .eq('participation_id', participationId)
        .eq('activity_id', activityId);

    if (updateError) {
        throw new Error('No se pudo actualizar la performance: ' + updateError.message);
    }
}
