export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { generateModuleEmbeddings } from '@/utils/server/generateModuleEmbeddings';

export async function POST(request: NextRequest) {
  try {
    // Log that we hit the endpoint
    console.log('API endpoint hit: /api/generate-embeddings');

    // Parse the request body
    const body = await request.json();
    console.log('Received body:', body);
    console.log('Generating embeddings for module:', body.moduleId, 'with document:', body.documentUrl);

    const { moduleId, documentUrl } = body;

    if (!moduleId || !documentUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate embeddings
    await generateModuleEmbeddings(moduleId, documentUrl);

    return NextResponse.json({ 
      success: true,
      message: 'Embeddings generados exitosamente' 
    });

  } catch (error) {
    console.error('Error in generate-embeddings API:', error);
    return NextResponse.json(
      { error: 'Error al generar embeddings' },
      { status: 500 }
    );
  }
}