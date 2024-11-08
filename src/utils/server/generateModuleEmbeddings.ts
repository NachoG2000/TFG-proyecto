import { createClient } from '@/utils/supabase/server';
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import mammoth from 'mammoth';

import path from 'path';

export async function generateModuleEmbeddings(moduleId: string, documentUrl: string) {
  try {
    const supabase = createClient();

    // Descargar el documento desde Supabase Storage
    const { data: downloadData, error: downloadError } = await supabase
      .storage
      .from('module-documents')
      .download(documentUrl);

    if (downloadError || !downloadData) {
      throw new Error('Failed to download document: ' + JSON.stringify(downloadError));
    }

    // Leer los datos del archivo
    const fileExt = path.extname(documentUrl).toLowerCase();
    const arrayBuffer = await downloadData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extraer texto del documento
    let extractedText = '';

    if (fileExt === '.pdf') {
      // Inicializar PDFLoader con el buffer convertido a Blob
      const blob = new Blob([buffer]);
      const loader = new PDFLoader(blob);

      // Cargar el documento
      const docs = await loader.load();

      // Concatenar el contenido de las páginas
      extractedText = docs.map(doc => doc.pageContent).join('\n');

    } else if (fileExt === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      throw new Error('Unsupported file type: ' + fileExt);
    }

    // Dividir el texto en fragmentos
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.createDocuments([extractedText]);

    // Crear embeddings
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    });

    // Almacenar embeddings en Supabase
    await SupabaseVectorStore.fromDocuments(
      docs.map((doc: Document) => {
        return new Document({
          pageContent: doc.pageContent,
          metadata: { module_id: moduleId },
        });
      }),
      embeddings,
      {
        client: supabase,
        tableName: 'module_embeddings',
        queryName: 'match_module_embeddings',
      }
    );

  } catch (error) {
    console.error('❌ Error in generateModuleEmbeddings:', {
      moduleId,
      documentUrl,
      error: error instanceof Error ? error.message : error
    });
    throw error;
  }
}
