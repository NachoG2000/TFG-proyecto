import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function GradesSection({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Get all modules for this course
    const { data: modules } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', params.id)
        .order('created_at');

    // Get all student participations for this course
    const { data: students, error: studentsError } = await supabase
        .from('participations')
        .select(`
            id,
            user_id,
            has_completed_diagnostic,
            users (
                id,
                name
            )
        `)
        .eq('course_id', params.id)
        .eq('role', 'student');

    if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return <div>Error fetching students</div>;
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', students?.[0]?.user_id || '')
        .single();

    if (userError) {
        console.error('Error fetching user:', userError);
        return <div>Error fetching user</div>;
    }

    return (
        <div className="mt-4">
            <Card>
                <CardContent className="p-0">
                    <div className="flex justify-between items-center p-4 border-b">
                        <Select defaultValue="name">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Por apellido</SelectItem>
                                <SelectItem value="grade">Por desempeño</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ScrollArea className="h-[calc(100dvh-40dvh)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Estudiante</TableHead>
                                    {modules?.map((module) => (
                                        <TableHead key={module.id} className="min-w-[150px]">
                                            <div className="text-black font-medium">{module.title}</div>

                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students?.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/course/${params.id}/profile/${student.id}`}>
                                                <div className="flex items-center">
                                                    <Avatar className="h-6 w-6 mr-2">
                                                        <AvatarFallback>
                                                            {userData?.name?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {userData?.name}
                                                </div>
                                            </Link>
                                        </TableCell>
                                        {modules?.map((module) => (
                                            <TableCell key={module.id}>
                                                <div>
                                                    {student.has_completed_diagnostic ? (
                                                        <div className="text-sm text-green-600">Completado</div>
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground">Pendiente</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}