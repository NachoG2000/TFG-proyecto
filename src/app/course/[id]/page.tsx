import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVerticalIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DiagnosticTest from "./DiagnosticTest";

export default async function CoursePage({params} : {params: {id: string}}) {
    const supabase = createClient();

    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
  
    if (!userId) {
      // Manejar el caso donde no hay usuario autenticado
      return notFound();
    }
  
    // Obtener la participación del alumno en el curso
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
  
    // Verificar si el alumno ha completado el test de diagnóstico
    if (!participation.has_completed_diagnostic) {
      // Mostrar el componente del test de diagnóstico
      return (
        <DiagnosticTest courseId={params.id} />
      );
    }
  
    // Obtener los datos del curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();
  
    if (courseError || !course) {
      console.log('Curso no encontrado o error:', courseError?.message);
      return notFound();
    }

    return (
        <div>
            <div className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">

                        <Card className="w-full bg-pink-600 text-white overflow-hidden">
                            <CardHeader className="relative pb-0">
                                <CardTitle className="text-2xl">{course.name}</CardTitle>
                                <CardDescription className="text-pink-100">Código único: {course.unique_code}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{course.description}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback>I</AvatarFallback>
                                    </Avatar>
                                    <Input placeholder="Anuncia algo a la clase" className="flex-1" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">27 jun 2024</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p>Profe, disculpe las molestias, en la sección de matemática solo me aparece la calificación del Módulo 2 como provisional, pero no se refleja en mi historial académico. Quisiera saber si aún no han subido los resultados finales de la evaluación o si hay algún problema con mi registro.
                                </p>
                                <Input placeholder="Agregar un comentario de clase" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">26 jun 2024</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p>Profe, en la sección de matemática me sale como si hubiera quedado regular en el Módulo 3, pero yo completé todas las tareas y exámenes, e incluso usted me confirmó que había aprobado. ¿Podría revisar si hay algún error?</p>
                                <Input placeholder="Agregar un comentario de clase" />
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
