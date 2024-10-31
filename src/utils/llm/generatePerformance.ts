import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

interface GeneratePerformanceInput {
    courseDetails: {
        name: string;
        description: string;
        objective: string;
    };
    diagnosticQuestions: Array<{
        question: string;
        options: Array<{
            answer: string;
            isCorrect: boolean;
        }>;
    }>;
    studentResponses: {
        responses: Array<{
            questionIndex: number;
            selectedOptionIndex: number;
        }>;
    };
}

interface PerformanceResult {
    score: number;
    feedback: string;
    improvementAreas: string;
}

export async function generatePerformance(input: GeneratePerformanceInput): Promise<PerformanceResult> {
    console.log('🚀 Starting generatePerformance with input:', JSON.stringify(input, null, 2));

    const analysisPrompt = PromptTemplate.fromTemplate(`
        Eres un asistente educativo que evalúa el desempeño de estudiantes en base a sus respuestas en un diagnóstico.
        
        Detalles del curso:
        - Nombre: {courseName}
        - Descripción: {courseDescription}
        - Objetivos: {courseObjectives}
        
        Preguntas del diagnóstico y respuestas del estudiante:
        {questionsAndResponses}
        
        Genera un objeto JSON con el siguiente formato exacto (sin markdown ni otros caracteres):
        {{
          "score": [número del 0 al 100],
          "feedback": [texto con retroalimentación detallada],
          "improvementAreas": [texto con áreas de mejora recomendadas]
        }}
        `);


    console.log('📝 Created prompt template');

    // Configure the model
    const model = new ChatOpenAI({
        modelName: 'gpt-4o-mini',
        temperature: 0.7,
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    console.log('🤖 Configured ChatOpenAI model');

    const chain = RunnableSequence.from([
        {
            courseName: () => {
                console.log('📚 Course Name:', input.courseDetails.name);
                return input.courseDetails.name;
            },
            courseDescription: () => {
                console.log('📝 Course Description:', input.courseDetails.description);
                return input.courseDetails.description;
            },
            courseObjectives: () => {
                console.log('🎯 Course Objectives:', input.courseDetails.objective);
                return input.courseDetails.objective;
            },
            questionsAndResponses: () => {
                const formattedQA = input.diagnosticQuestions.map((q, index) => {
                    const studentResponse = input.studentResponses.responses.find(
                        r => r.questionIndex === index
                    );

                    if (!studentResponse) {
                        console.log(`⚠️ No response found for question ${index}`);
                        return `
                            Pregunta ${index + 1}: ${q.question}
                            Opciones:
                            ${q.options.map((o, i) => `  ${String.fromCharCode(97 + i)}) ${o.answer}`).join('\n')}
                            Respuesta correcta: ${String.fromCharCode(97 + q.options.findIndex(o => o.isCorrect))}
                            Respuesta del estudiante: No respondida
                            `;
                    }

                    return `
                        Pregunta ${index + 1}: ${q.question}
                        Opciones:
                        ${q.options.map((o, i) => `  ${String.fromCharCode(97 + i)}) ${o.answer}`).join('\n')}
                        Respuesta correcta: ${String.fromCharCode(97 + q.options.findIndex(o => o.isCorrect))}
                        Respuesta del estudiante: ${String.fromCharCode(97 + studentResponse.selectedOptionIndex)}
                        `;
                }).join('\n');

                console.log('❓ Formatted Questions and Responses:', formattedQA);
                return formattedQA;
            },
        },
        analysisPrompt,
        model,
        new StringOutputParser(),
    ]);

    console.log('⛓️ Created RunnableSequence chain');

    try {
        console.log('🏃 Executing chain...');
        const result = await chain.invoke({});
        console.log('✅ Chain execution completed. Raw result:', result);

        // Clean the result string before parsing
        const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();
        console.log('🧹 Cleaned result:', cleanResult);

        const parsedResult = JSON.parse(cleanResult) as PerformanceResult;
        console.log('📊 Parsed Performance Result:', parsedResult);

        return parsedResult;
    } catch (error) {
        console.error('❌ Error in generatePerformance:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw new Error('Failed to generate performance analysis');
    }
}
