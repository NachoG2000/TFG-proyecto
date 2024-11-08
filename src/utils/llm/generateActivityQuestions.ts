// generateModuleQuestions.ts
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
// import { getRelevantEmbeddings } from './getRelevantEmbeddings';
import { createClient } from '@/utils/supabase/server';

interface GenerateActivityQuestionsInput {
  moduleId: string;
  studentPerformances: Array<{
    activityId: string;
    score: number;
    feedback: string;
    improvementAreas: string;
  }>;
  relevantContents: string[];
}

interface QuestionOption {
  answer: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: QuestionOption[];
}

export async function generateActivityQuestions(input: GenerateActivityQuestionsInput): Promise<Question[]> {
  const supabase = createClient();

  const context = input.relevantContents.join('\n');

  // Obtener información del módulo
  const { data: moduleData, error: moduleError } = await supabase
  .from('modules')
  .select('title, description')
  .eq('id', input.moduleId)
  .single();

  if (moduleError || !moduleData) {
  console.error('Error al obtener el módulo:', moduleError);
  throw new Error('No se pudo obtener la información del módulo');
  }

  // Add to prompt
  const moduleInfo = `
    Título del módulo: ${moduleData.title}
    Descripción del módulo: ${moduleData.description}
  `;

  const questionsPrompt = PromptTemplate.fromTemplate(`
    Eres un asistente educativo que crea preguntas de evaluación para estudiantes.

    Información del módulo:
    ${moduleInfo}

    Basándote en el siguiente contenido:

    {context}

    Y teniendo en cuenta el desempeño previo del estudiante:

    {studentPerformances}

    Genera un array JSON con 5 preguntas de opción múltiple con el siguiente formato exacto (sin markdown ni otros caracteres):

    [
      {{
        "question": "Texto de la pregunta",
        "options": [
          {{ "answer": "Opción A", "isCorrect": true }},
          {{ "answer": "Opción B", "isCorrect": false }},
          {{ "answer": "Opción C", "isCorrect": false }},
          {{ "answer": "Opción D", "isCorrect": false }}
        ]
      }},
      ...
    ]
`);

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const chain = RunnableSequence.from([
    {
      context: () => context,
      studentPerformances: () => {
        const formattedPerformances = input.studentPerformances.map(perf => `
          Actividad ${perf.activityId}:
          - Puntuación: ${perf.score}
          - Retroalimentación: ${perf.feedback}
          - Áreas de mejora: ${perf.improvementAreas}
          `).join('\n');
        return formattedPerformances;
      },
    },
    questionsPrompt,
    model,
    new StringOutputParser(),
  ]);

  try {
    const result = await chain.invoke({});
    const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();
    const parsedQuestions = JSON.parse(cleanResult) as Question[];

    return parsedQuestions;
  } catch (error) {
    console.error('❌ Error in generateActivityQuestions:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to generate module questions');
  }
}

