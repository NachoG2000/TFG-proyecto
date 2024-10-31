import { createClient } from '@/utils/supabase/client';
import { Json } from '../../../database.types';

export async function createDiagnosticActivity(moduleId: string, participationId: string, courseId: string) {
  const supabase = createClient();

  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('diagnostic_questions')
    .eq('id', courseId)
    .single();

  if (courseError || !courseData) {
    console.error('Error fetching diagnostic questions:', courseError);
    throw new Error('No se pudo obtener las preguntas diagnósticas');
  }

  console.log(courseData);

  const { error: activityError } = await supabase
    .from('activities')
    .insert([
      {
        module_id: moduleId,
        participation_id: participationId,
        name: 'Evaluación Diagnóstica',
        is_ai_generated: false,
        created_by: null,
        questions: courseData.diagnostic_questions,
      },
    ]);

  if (activityError) {
    console.error('Error creating diagnostic activity:', activityError);
    throw new Error('No se pudo crear la actividad de diagnóstico');
  }
}
