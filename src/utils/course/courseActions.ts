import { createClient } from '@/utils/supabase/client';
import { createProfessorParticipation, createStudentParticipation } from '@/utils/participation/participationActions';
import { createDiagnosticModule } from '@/utils/module/moduleActions';
import { Json } from '../../../database.types';

type CourseProps = {
  name: string;
  description: string;
  educational_level: string;
  objective: string;
  diagnostic_questions: Json;
};

export async function createCourse(courseDataProps: CourseProps) {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error getting user:', userError);
    throw new Error('Failed to get user information');
  }

  const professorId = userData?.user?.id;

  if (!professorId) {
    throw new Error('No se pudo obtener el ID del profesor');
  }

  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .insert([
      {
        name: courseDataProps.name,
        description: courseDataProps.description,
        educational_level: courseDataProps.educational_level,
        objective: courseDataProps.objective,
        unique_code: createCourseUniqueCode(),
        created_by: professorId,
        diagnostic_questions: courseDataProps.diagnostic_questions,
      },
    ])
    .select()
    .single();

  if (courseError || !courseData) {
    console.error('Error inserting course:', courseError);
    throw new Error(courseError?.message || 'Error creating course');
  }

  try {
    const professorParticipation = await createProfessorParticipation(courseData.id, professorId);
    const diagnosticModule = await createDiagnosticModule(courseData.id, professorId);
    return { course: courseData, diagnosticModule, professorParticipation };
  } catch (error) {
    console.error('Error in course creation process:', error);
    throw error;
  }
}

const createCourseUniqueCode = () => {
  return Math.random().toString(36).substring(2, 15);
};

export async function checkEnrollmentCode(enrollmentCode: string) {
  const supabase = createClient();

  // Llamar a la función RPC para obtener el ID del curso
  const { data: courseId, error: rpcError } = await supabase.rpc(
    'check_enrollment_code',
    { enrollment_code: enrollmentCode }
  );

  if (rpcError) {
    console.error('Error al verificar el código de inscripción:', rpcError);
    if (rpcError.message.includes('Código de inscripción inválido')) {
      throw new Error('Código de inscripción inválido');
    } else {
      throw new Error('No se pudo verificar el código de inscripción');
    }
  }

  console.log('courseId:', courseId);

  // Obtener el usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  // Verificar si el usuario ya está inscrito
  const { data: existingParticipation, error: participationError } = await supabase
    .from('participations')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single();

  if (participationError && participationError.code !== 'PGRST116') {
    // Si ocurre un error diferente a "no se encontraron filas"
    console.error('Error al verificar la participación existente:', participationError);
    throw new Error('No se pudo verificar la participación existente');
  }

  if (existingParticipation) {
    throw new Error('Ya estás inscrito en este curso');
  }

  // Crear la participación del estudiante
  try {
    const studentParticipation = await createStudentParticipation(courseId, user.id);
    return { courseId, studentParticipation };
  } catch (error) {
    console.error('Error al crear la participación del estudiante:', error);
    throw new Error('No se pudo inscribir en el curso');
  }
}