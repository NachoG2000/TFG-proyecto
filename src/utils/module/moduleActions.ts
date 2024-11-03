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

export async function createModule(courseId: string, professorId: string, data: { title: string, description: string, document?: File }) {
  const supabase = createClient();
  
  // First create the module record
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .insert([
      {
        course_id: courseId,
        created_by: professorId,
        title: data.title,
        description: data.description,
        is_diagnostic: false,
      },
    ])
    .select()
    .single();

  if (moduleError || !moduleData) {
    throw new Error('Failed to create module');
  }

  // If there's a document, upload it to storage
  if (data.document) {
    const fileExt = data.document.name.split('.').pop();
    const fileName = `${moduleData.id}-${Date.now()}.${fileExt}`;
    const filePath = `modules/${courseId}/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('module-documents')
      .upload(filePath, data.document);

    if (uploadError) {
      throw new Error('Failed to upload document: ' + JSON.stringify(uploadError));
    }

    // Update module with document path
    const { error: updateError } = await supabase
      .from('modules')
      .update({ document_url: filePath })
      .eq('id', moduleData.id);

    if (updateError) {
      throw new Error('Failed to update module with document');
    }
  }

  return moduleData;
}
