'use server';

import { createClient } from '@/utils/supabase/server';
import { generateActivityQuestions } from '../llm/generateActivityQuestions';
import { getRelevantEmbeddings } from '../llm/getRelevantEmbeddings';

import { verifyModuleEmbeddings } from '../llm/verifyModuleEmbeddings';

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

export async function createModuleTestActivity(participationId: string, moduleId: string): Promise<string> {
  const supabase = createClient();

  // Crear la actividad
  const { data: activityData, error: activityError } = await supabase
    .from('activities')
    .insert({
      module_id: moduleId,
      participation_id: participationId,
      name: 'Evaluación del Módulo',
      is_ai_generated: true,
    })
    .select()
    .single();

  if (activityError || !activityData) {
    console.error('Error al crear la actividad:', activityError);
    throw new Error('No se pudo crear la actividad');
  }

  const activityId = activityData.id;

  // Obtener las performances previas del estudiante
  const { data: performances, error: performancesError } = await supabase
    .from('performances')
    .select('*')
    .eq('participation_id', participationId)
    .order('generated_at', { ascending: true });

  if (performancesError) {
    console.error('Error al obtener las performances:', performancesError);
    throw new Error('No se pudieron obtener las performances del estudiante');
  }

  // Formatear las performances
  const studentPerformances = performances.map((perf: any) => ({
    activityId: perf.activity_id,
    score: perf.score,
    feedback: perf.feedback,
    improvementAreas: perf.improvement_areas,
  }));

  const improvementAreas = studentPerformances
    .map((perf: any) => perf.improvementAreas)
    .filter((area: any) => area)
    .join(' ');

  const hasEmbeddings = await verifyModuleEmbeddings(moduleId);
  console.log('Module has embeddings:', hasEmbeddings);

  if (!hasEmbeddings) {
    console.warn('No embeddings found for module:', moduleId);
  }

  const relevantContents = await getRelevantEmbeddings(
    moduleId,
    improvementAreas || 'Generar preguntas para el módulo',
    5 // HARDCODEADO, CAMBIAR SI NECESITO OTRO NUMERO DE EMBEDDINGS
  );

  // Generar las preguntas utilizando LangChain y RAG
  const questions = await generateActivityQuestions({
    moduleId,
    studentPerformances,
    relevantContents: relevantContents || [],
  });

  // Actualizar la actividad con las preguntas generadas
  const { error: updateError } = await supabase
    .from('activities')
    .update({ 
      questions: {
        questions: questions.map(q => ({
          question: q.question,
          options: q.options.map(o => ({
            answer: o.answer,
            isCorrect: o.isCorrect
          }))
        }))
      }
    })
    .eq('id', activityId);

  if (updateError) {
    console.error('Error al actualizar la actividad:', updateError);
    throw new Error('No se pudieron actualizar las preguntas de la actividad');
  }

  return activityId;
}
