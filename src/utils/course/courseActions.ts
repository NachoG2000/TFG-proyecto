import { createClient } from '@/utils/supabase/client';
import { createProfessorParticipation } from '@/utils/participation/participationActions';

type CourseProps = {
    name: string;
    description: string;
    educational_level: string;
    objective: string;
}

export async function createCourse(courseDataProps: CourseProps) {
  console.log('courseDataProps', courseDataProps)
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log('User data:', userData.user?.id);
  if (userError) {
    console.error('Error getting user:', userError);
    throw new Error('Failed to get user information');
  }

  const professorId = userData?.user?.id;

  if (!professorId) {
    throw new Error('No se pudo obtener el ID del profesor');
  }
  
  const createCourseUniqueCode = () => {
      return Math.random().toString(36).substring(2, 15);
  }
    
  // Insert the new course into the 'courses' table
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .insert([
      {
        name: courseDataProps.name,
        description: courseDataProps.description,
        educational_level: courseDataProps.educational_level,
        objective: courseDataProps.objective,
        unique_code: createCourseUniqueCode(),
        created_by: professorId
      },
    ])
    .select();

  if (courseError) {
    console.error('Error inserting course:', courseError);
    throw new Error(courseError.message);
  }

  if (!courseData || courseData.length === 0) {
    throw new Error('No course data returned after insertion');
  }

  // Create the professor participation
  try {
    const professorParticipation = await createProfessorParticipation(courseData[0].id, professorId);
    return { course: courseData[0], professorParticipation };
  } catch (error) {
    console.error('Error creating professor participation:', error);
    throw error;
  }
}

