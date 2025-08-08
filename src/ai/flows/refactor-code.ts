'use server';

/**
 * @fileOverview This file defines a Genkit flow for refactoring code.
 *
 * - refactorCode - A function that takes a code snippet and returns a refactored version.
 * - RefactorCodeInput - The input type for the refactorCode function.
 * - RefactorCodeOutput - The return type for the refactorCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefactorCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to refactor.'),
});

export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

const RefactorCodeOutputSchema = z.object({
  refactoredCode: z.string().describe('The refactored code snippet.'),
  explanation: z.string().describe('An explanation of the changes made.'),
});

export type RefactorCodeOutput = z.infer<typeof RefactorCodeOutputSchema>;

export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  return refactorCodeFlow(input);
}

const refactorCodePrompt = ai.definePrompt({
  name: 'refactorCodePrompt',
  input: {schema: RefactorCodeInputSchema},
  output: {schema: RefactorCodeOutputSchema},
  prompt: `You are an expert software engineer specializing in code optimization and refactoring.
  Given the following code snippet, refactor it for better performance, readability, and maintainability.

  Code:
  \`\`\`
  {{{code}}}
  \`\`\`

  Provide the refactored code and a brief explanation of the key improvements you made.
  `,
});

const refactorCodeFlow = ai.defineFlow(
  {
    name: 'refactorCodeFlow',
    inputSchema: RefactorCodeInputSchema,
    outputSchema: RefactorCodeOutputSchema,
  },
  async input => {
    const {output} = await refactorCodePrompt(input);
    return output!;
  }
);
