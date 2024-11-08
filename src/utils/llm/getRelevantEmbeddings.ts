// llm/getRelevantEmbeddings.ts

import { createClient } from '@/utils/supabase/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { Document } from 'langchain/document';

export async function getRelevantEmbeddings(moduleId: string, query: string, k: number = 5): Promise<string[]> {
  const supabase = createClient();

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: 'module_embeddings',
    queryName: 'match_module_embeddings',
  });

  // Filtro basado en metadata
  const filter = { module_id: moduleId };
  // Utilizar similaritySearch con filtro
  const docs = await vectorStore.similaritySearch(query, k, filter);
  const contents = docs.map((doc: Document) => doc.pageContent);

  return contents;
}
