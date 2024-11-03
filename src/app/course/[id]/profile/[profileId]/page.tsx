import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default async function StudentDetails({params} : {params: {profileId: string, id: string}}) {

    const supabase = createClient();

    console.log(params.profileId);

    const { data: studentData, error } = await supabase
        .from('participations')
        .select('*')
        .eq('id', params.profileId)
        .single();

    if (error) {
        console.error('Error fetching student data:', error);
        return <div>Error fetching student data</div>;
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', studentData?.user_id || '')
        .single();

    if (userError) {
        console.error('Error fetching user data:', userError);
        return <div>Error fetching user data</div>;
    }

    const { data: performanceData, error: performanceError } = await supabase
        .from('performances')
        .select('*')
        .eq('participation_id', params.profileId)
        .single();

    if (performanceError) {
        console.error('Error fetching performance data:', performanceError);
        return <div>Error fetching performance data</div>;
    }

    const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', studentData?.course_id || '')

    if (modulesError) {
        console.error('Error fetching modules data:', modulesError);
        return <div>Error fetching modules data</div>;
    }

    return (
      <div className="space-y-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userData?.avatar_url || ''} />
              <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userData?.name}</h2>
              <p className="text-muted-foreground">{userData?.email}</p>
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Rendimiento del diagnóstico</CardTitle>
            <Button variant="outline">
                <EditIcon className="h-4 w-4"/>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Nota: {performanceData?.score}%</h3>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Feedback de rendimiento generado por IA</h3>
              <p className="text-muted-foreground">{performanceData?.feedback}</p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Consejos de mejora generados por IA</h3>
              <p className="text-muted-foreground">{performanceData?.improvement_areas}</p>
            </div>
          </CardContent>
        </Card>
  
        <Card>
        <CardHeader className="flex flex-row justify-between">
            <CardTitle>Detalles de los Módulos</CardTitle>
            <Button variant="outline">
                <EditIcon className="h-4 w-4"/>
            </Button>
          </CardHeader>
          <CardContent>
            {modulesData?.map((module, index) => (
              <div key={module.id} className="mb-6">
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-muted-foreground mb-2">Nota: {performanceData?.score || 0}%</p>
                <p>{module.description}</p>
                {index < modulesData?.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }