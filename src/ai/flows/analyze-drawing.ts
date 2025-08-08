
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing architectural drawings.
 *
 * - analyzeDrawing - A function that takes a drawing image and returns an analysis.
 * - AnalyzeDrawingInput - The input type for the function.
 * - AnalyzeDrawingOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDrawingInputSchema = z.object({
  drawingDataUri: z.string().describe("An architectural drawing image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  analysisQuery: z.string().describe('A specific question or prompt about what to analyze in the drawing.'),
});
export type AnalyzeDrawingInput = z.infer<typeof AnalyzeDrawingInputSchema>;

const AnalyzeDrawingOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the architectural drawing.'),
  potentialIssues: z.array(z.string()).describe('A list of potential issues identified in the drawing (e.g., structural, compliance, accessibility).'),
  suggestions: z.array(z.string()).describe('A list of suggestions for improving the design.'),
});
export type AnalyzeDrawingOutput = z.infer<typeof AnalyzeDrawingOutputSchema>;

export async function analyzeDrawing(input: AnalyzeDrawingInput): Promise<AnalyzeDrawingOutput> {
  return analyzeDrawingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDrawingPrompt',
  input: { schema: AnalyzeDrawingInputSchema },
  output: { schema: AnalyzeDrawingOutputSchema },
  prompt: `You are an expert AI architect. Your task is to analyze the provided architectural drawing based on the user's query.

  Drawing: {{media url=drawingDataUri}}

  User Query: {{{analysisQuery}}}

  Please provide a detailed analysis covering:
  1. A summary of the drawing.
  2. Any potential issues you can identify (related to structural integrity, code compliance, accessibility, etc.).
  3. Suggestions for improvement or alternative design considerations.

  Structure your response according to the output schema.
  `,
});

const analyzeDrawingFlow = ai.defineFlow(
  {
    name: 'analyzeDrawingFlow',
    inputSchema: AnalyzeDrawingInputSchema,
    outputSchema: AnalyzeDrawingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
