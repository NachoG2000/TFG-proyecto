import { notFound } from "next/navigation";
import CourseNavigation from "./CourseNavigation";
import { createClient } from "@/utils/supabase/server";
import DiagnosticTest from "./DiagnosticTest";

export default async function CourseLayout({children, params} : {children: React.ReactNode, params: {id: string}}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return notFound();
  }

  // Get user's participation and diagnostic activity status
  const { data: participation, error: participationError } = await supabase
    .from('participations')
    .select(`
      *,
      activities:activities(
        id,
        module:modules(
          is_diagnostic
        )
      )
    `)
    .eq('course_id', params.id)
    .eq('user_id', userId)
    .single();

  if (participationError || !participation) {
    console.error('Participación no encontrada o error (en layout.tsx):', participationError?.message);
    return notFound();
  }

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!course) {
    return notFound();
  }

  const hasDiagnosticActivity = participation.activities?.some(
    activity => activity.module?.is_diagnostic
  );

  return (
    <div className="bg-background">
      {participation.has_completed_diagnostic && <CourseNavigation courseId={params.id} participationId={participation.id} role={participation?.role || ''} />}
      {!participation.has_completed_diagnostic && hasDiagnosticActivity ? (
        <DiagnosticTest courseId={params.id} />
      ) : (
        children
      )}
    </div>
  );
}
