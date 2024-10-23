import { createClient } from '@/utils/supabase/server'
import DashboardContent from './dashboardContent'
import { redirect } from 'next/navigation'

// Update the UserParticipation type
type UserParticipation = {
  id: string;
  user_id: string | null;
  course_id: string | null;
  role: string | null;
  created_at: string | null;
};

// Update the UserCourse type
type UserCourse = {
  id: string;
  name: string | null;
  description: string | null;
  created_at: string | null;
  created_by: string | null;
  educational_level: string | null;
  objective: string | null;
  unique_code: string | null;
  role: string | null;
};

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userParticipations, error } = await supabase
    .from('participations')
    .select('*')
    .eq('user_id', user.id)

  // Fetch course information for each participation
  const userCourses: (UserCourse | null)[] = await Promise.all(
    (userParticipations ?? []).map(async (participation: UserParticipation) => {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', participation.course_id as string)
        .single()

      if (courseError || !courseData) {
        console.error('Error fetching course:', courseError)
        return null
      }

      return {
        id: courseData.id,
        name: courseData.name,
        description: courseData.description,
        created_at: courseData.created_at,
        created_by: courseData.created_by,
        educational_level: courseData.educational_level,
        objective: courseData.objective,
        unique_code: courseData.unique_code,
        role: participation.role
      }
    })
  )

  // Filter out any null values (failed fetches)
  const validUserCourses = userCourses.filter((course): course is UserCourse => course !== null)

  // Pass the userCourses array to DashboardContent
  return <DashboardContent userCourses={validUserCourses} />
}
