import { notFound } from "next/navigation";
import CourseNavigation from "./CourseNavigation";
import { createClient } from "@/utils/supabase/server";

export default async function CourseLayout({children, params} : {children: React.ReactNode, params: {id: string}}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return notFound();
  }

  // Obtener la participación del usuario en el curso
  const { data: participation, error: participationError } = await supabase
    .from('participations')
    .select('has_completed_diagnostic')
    .eq('course_id', params.id)
    .eq('user_id', userId)
    .single();

  if (participationError || !participation) {
    console.error('Participación no encontrada o error:', participationError?.message);
    return notFound();
  }

  // Obtener el curso
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!course) {
    return notFound();
  }

  return (
    <div className="bg-background">
      {/* Renderizar condicionalmente CourseNavigation */}
      {participation.has_completed_diagnostic && <CourseNavigation courseId={params.id} />}
      {children}
    </div>
  );
}
