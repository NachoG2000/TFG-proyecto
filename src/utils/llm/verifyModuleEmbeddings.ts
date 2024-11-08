import { createClient } from "@/utils/supabase/server";

export async function verifyModuleEmbeddings(moduleId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('module_embeddings')
        .select('id')
        .eq('module_id', moduleId);

    if (error) {
        console.error('Error checking embeddings:', error);
        return false;
    }

    console.log('Embeddings verification result:', { moduleId, found: data && data.length > 0, count: data?.length });
    return data && data.length > 0;
}
