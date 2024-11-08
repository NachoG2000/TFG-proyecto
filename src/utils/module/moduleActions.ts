import { createClient } from '@/utils/supabase/client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
  
  try {
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

    if (moduleError) {
      console.error('Error creating module record:', moduleError);
      throw new Error(`Failed to create module record: ${moduleError.message}`);
    }

    if (!moduleData) {
      throw new Error('No module data returned after creation');
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
        console.error('Error uploading document:', uploadError);
        throw new Error(`Failed to upload document: ${uploadError.message}`);
      }

      // Update module with document path
      const { error: updateError } = await supabase
        .from('modules')
        .update({ document_url: filePath })
        .eq('id', moduleData.id);

      if (updateError) {
        console.error('Error updating module with document:', updateError);
        throw new Error(`Failed to update module with document: ${updateError.message}`);
      }

      // Call the API route to generate embeddings
      try {
        console.log('Calling embeddings API...');
        const apiUrl = '/api/generate-embeddings';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleId: moduleData.id,
            documentUrl: filePath,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to generate embeddings: ${response.status}`);
        }

        const data = await response.json();
        console.log('Embeddings generation success:', data);

      } catch (error) {
        console.error('Error generating embeddings:', error);
        throw new Error('Failed to generate embeddings for module document');
      }
    }

    return moduleData;
  } catch (error) {
    console.error('Error in createModule:', error);
    throw error;
  }
}
