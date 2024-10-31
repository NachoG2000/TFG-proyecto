import { createClient } from '@/utils/supabase/client';

export async function createDiagnosticModule(courseId: string, professorId: string) {
  const supabase = createClient();

  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .insert([
      {
        course_id: courseId,
        created_by: professorId,
        title: 'Diagnóstico Inicial',
        description: 'Módulo de evaluación diagnóstica inicial',
        is_diagnostic: true,
      },
    ])
    .select()
    .single();

  if (moduleError || !moduleData) {
    console.error('Error creating diagnostic module:', moduleError);
    throw new Error('Failed to create diagnostic module');
  }

  return moduleData;
}

export async function getDiagnosticModule(courseId: string) {
  const supabase = createClient();

  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)
    .eq('is_diagnostic', true)
    .single();

  if (moduleError || !moduleData) {
    console.error('Error fetching diagnostic module:', moduleError);
    throw new Error('No se pudo encontrar el módulo de diagnóstico');
  }

  return moduleData;
}
