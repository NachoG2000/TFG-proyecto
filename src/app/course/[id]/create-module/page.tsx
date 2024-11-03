"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createModule } from "@/utils/module/moduleActions";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation"; // Corregir la importación

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const moduleFormSchema = z.object({
  title: z.string().min(1, {
    message: "El título es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
  document: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `El tamaño máximo del archivo es 5MB.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Solo se aceptan archivos PDF o Word."
    )
    .optional(),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

const defaultValues: Partial<ModuleFormValues> = {
  title: "",
  description: "",
};

export default function CreateModuleForm() {
  const { toast } = useToast();
  const params = useParams();
  const courseId = params.id as string;
  const supabase = createClient();

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(formData: ModuleFormValues) {
    try {
      // Obtener el usuario autenticado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("No se pudo obtener el usuario autenticado");
      }

      const professorId = user.id;

      // Llamar a createModule
      await createModule(courseId, professorId, {
        title: formData.title,
        description: formData.description,
        document: formData.document,
      });

      toast({
        title: "Módulo creado",
        description: "El módulo ha sido creado exitosamente.",
      });

      // Redirect to modules page after successful creation
      window.location.href = `http://localhost:3000/course/${courseId}/modules`;

    } catch (error) {
      console.error("Error al crear el módulo:", error);
      toast({
        title: "Error",
        description:
          "Hubo un error al crear el módulo. Por favor intente nuevamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto p-6">
      <div className="space-y-4 bg-black p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold">Crear Nuevo Módulo</h1>
        <p className="text-muted-foreground">
          Complete los siguientes campos para crear un nuevo módulo.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introducción a..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  El título del módulo que verán los estudiantes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Este módulo cubre..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Una descripción detallada del contenido del módulo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Documento del Módulo</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      disabled={isSubmitting}
                      {...field}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  Suba un archivo PDF o Word (máx. 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear Módulo
          </Button>
        </form>
      </Form>
    </div>
  );
}