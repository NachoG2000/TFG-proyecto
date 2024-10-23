import { createClient } from "@/utils/supabase/client";

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

  if (professorParticipationError) {
    throw new Error(professorParticipationError.message);
  }

  return professorParticipation;
}

export async function createStudentParticipation(courseId: string, studentId: string) {
  const supabase = createClient();

  // Check if participation already exists
  const { data: existingParticipation, error: checkError } = await supabase
    .from('participations')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', studentId)
    .single();

  if (existingParticipation) {
    throw new Error('You are already enrolled in this course');
  }

  const { data: studentParticipation, error: studentParticipationError } = await supabase
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

  if (studentParticipationError) {
    throw new Error(studentParticipationError.message);
  }

  return studentParticipation;
}
