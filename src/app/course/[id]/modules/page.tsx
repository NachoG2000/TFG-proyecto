"use client"
import { useState, useEffect, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, FileIcon, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { createModuleTestActivity } from "@/utils/activity/activityActions";

interface Module {
    id: string;
    title: string;
    description: string;
    document_url?: string;
}

export default function ClassroomPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleStartTest = async (moduleId: string) => {
        try {
            // Obtener el usuario autenticado
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error('❌ Error al obtener usuario:', userError);
                throw new Error('No se pudo obtener el usuario autenticado');
            }

            // Obtener la participación del usuario en el curso
            const { data: participationData, error: participationError } = await supabase
                .from('participations')
                .select('id')
                .eq('course_id', params.id)
                .eq('user_id', user.id)
                .single();

            if (participationError || !participationData) {
                console.error('❌ Error al obtener participación:', participationError);
                throw new Error('No se pudo obtener la participación del estudiante en el curso');
            }

            const participationId = participationData.id;

            // Verificar si ya existe una actividad para el módulo y la participación
            const { data: activities, error: activitiesError } = await supabase
                .from('activities')
                .select('id')
                .eq('module_id', moduleId)
                .eq('participation_id', participationId);

            if (activitiesError) {
                console.error('❌ Error al buscar actividades:', activitiesError);
                toast({
                    title: 'Error',
                    description: `Error al buscar actividades: ${activitiesError.message}`,
                    variant: 'destructive',
                });
                return; // Salir de la función si hay un error
            }

            let activityId: string;

            if (activities && activities.length > 0) {
                // Usar la primera actividad encontrada
                activityId = activities[0].id;
            } else {
                // Crear nueva actividad
                activityId = await createModuleTestActivity(participationId, moduleId);
            }

            // Redirigir al test
            const testUrl = `/course/${params.id}/modules/${moduleId}/activities/${activityId}/test`;

            startTransition(() => {
                router.push(testUrl);
            });
        } catch (error) {
            console.error('❌ Error en handleStartTest:', error);
            toast({
                title: 'Error',
                description: 'No se pudo iniciar el test. Por favor, inténtalo de nuevo.',
                variant: 'destructive',
            });
        }
    };

    const handleDownload = async (documentPath: string) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('module-documents')
                .createSignedUrl(documentPath, 60); // URL válida por 60 segundos

            if (error) {
                throw error;
            }

            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            toast({
                title: "Error",
                description: "No se pudo descargar el documento",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        async function loadUserData() {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) return;

                const { data: participationData, error: participationError } = await supabase
                    .from('participations')
                    .select('role')
                    .eq('course_id', params.id)
                    .eq('user_id', user.id)
                    .single();

                if (!participationError && participationData) {
                    setUserRole(participationData.role);
                }
            } catch (error) {
                console.error('Error loading user role:', error);
            }
        }

        loadUserData();
    }, [params.id, supabase]);

    useEffect(() => {
        async function loadModules() {
            try {
                const { data } = await supabase.from('modules')
                    .select('*')
                    .eq('course_id', params.id)
                    .eq('is_diagnostic', false)
                    .order('created_at', { ascending: true });
                const typedData = (data || []) as Module[];
                setModules(typedData);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudieron cargar los módulos",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        loadModules();
    }, [params.id, toast]);

    return (
        <div>
            <div className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                        <Card className="w-full bg-black text-white p-2">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <div className="text-2xl font-bold">Módulos</div>
                                    <Link href={`/course/${params.id}/create-module`}>
                                        <Button className="text-white border-white hover:bg-gray-800 hover:text-white">
                                            <PlusIcon className="mr-2 h-4 w-4" /> Nuevo módulo
                                        </Button>
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        {loading ? (
                            <div>Cargando módulos...</div>
                        ) : (
                            modules.map((module) => (
                                <Card key={module.id} className="w-full">
                                    <CardHeader>
                                        <CardTitle>{module.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items-center">
                                        {module.document_url ? (
                                            <Button
                                                variant="outline"
                                                className="flex items-center"
                                                onClick={() => handleDownload(module.document_url!)}
                                            >
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                Descargar PDF
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="flex items-center" disabled>
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                Sin documento
                                            </Button>
                                        )}
                                        {userRole !== 'professor' && (
                                            <Button
                                                className="flex items-center"
                                                onClick={() => handleStartTest(module.id)}
                                                disabled={loading || isPending}
                                            >
                                                {(loading || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {!loading && !isPending && <CheckCircleIcon className="mr-2 h-4 w-4" />}
                                                Hacer test
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}