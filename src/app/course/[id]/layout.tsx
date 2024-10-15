import { notFound } from "next/navigation";
import CourseNavigation from "./CourseNavigation";
import { createClient } from "@/utils/supabase/server";

export default async function CourseLayout({children, params} : {children: React.ReactNode, params: {id: string}}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  if (!userId) {
    // Handle the case where there's no authenticated user
    // You might want to redirect to login or show an error
    return notFound()
  }

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!course) {
    notFound()
  }

  return (
    <div className="bg-background">
      <CourseNavigation />
      {children}
    </div>
  )
}
