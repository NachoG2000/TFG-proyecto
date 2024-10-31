import { createClient } from "@/utils/supabase/client";
import { getDiagnosticModule } from "@/utils/module/moduleActions";
import { createDiagnosticActivity } from "@/utils/activity/activityActions";

export async function createProfessorParticipation(courseId: string, professorId: string) {
  const supabase = createClient();

  const { data: professorParticipation, error: professorParticipationError } = await supabase
    .from('participations')
    .insert([
      {
        course_id: courseId,
        user_id: professorId,
        role: 'professor',
        has_completed_diagnostic: true,
      },
    ])
    .select()
    .single();

  if (professorParticipationError || !professorParticipation) {
    throw new Error(professorParticipationError?.message || 'Error creating professor participation');
  }

  return professorParticipation;
}

export async function createStudentParticipation(courseId: string, studentId: string) {
  const supabase = createClient();
  
  try {
    // Check if participation already exists
    const { data: existingParticipation, error: checkError } = await supabase
      .from('participations')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', studentId)
      .single();

    if (existingParticipation) {
      throw new Error('Ya estás inscrito en este curso');
    }

    // Create student participation
    const { data: studentParticipation, error: participationError } = await supabase
      .from('participations')
      .insert([
        {
          course_id: courseId,
          user_id: studentId,
          role: 'student',
        },
      ])
      .select()
      .single();
      
    // Get diagnostic module
    const diagnosticModule = await getDiagnosticModule(courseId);
      
    if (participationError || !studentParticipation) {
      console.error('Error creating participation:', participationError);
      throw new Error('No se pudo crear la participación');
    }

    // Create diagnostic activity
    await createDiagnosticActivity(diagnosticModule.id, studentParticipation.id, courseId);

    return studentParticipation;

  } catch (error) {
    console.error('Error in createStudentParticipation:', error);
    throw error;
  }
}
