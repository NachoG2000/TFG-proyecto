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
      },
    ])

  if (professorParticipationError) {
    throw new Error(professorParticipationError.message);
  }

  return professorParticipation;
}
