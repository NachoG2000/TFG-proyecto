"use client"
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, FileIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

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
    const supabase = createClient()

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
                                <h1 className="text-2xl font-bold">Módulos</h1>
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
                                        <Link href={`/course/${params.id}/modules/${module.id}/quiz`}>
                                            <Button className="flex items-center">
                                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                                Hacer test
                                            </Button>
                                        </Link>
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