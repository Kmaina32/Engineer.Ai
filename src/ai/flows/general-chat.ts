
'use server';

/**
 * @fileOverview This file defines a general-purpose Genkit chat flow.
 *
 * - generalChat - A function that takes a user query and their discipline and returns a tailored response.
 * - GeneralChatInput - The input type for the generalChat function.
 * - GeneralChatOutput - The return type for the generalChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralChatInputSchema = z.object({
  userQuery: z.string().describe('The user\'s message or question.'),
  userDiscipline: z.string().describe('The engineering discipline of the user.'),
});

export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});

export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  return generalChatFlow(input);
}

const generalChatPrompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  output: {schema: GeneralChatOutputSchema},
  prompt: `You are a helpful AI assistant for engineers. The user you are talking to is a {{userDiscipline}} engineer.
  Tailor your response to be helpful for their specific discipline.

  User query: {{{userQuery}}}

  Provide a helpful and concise response.
  `,
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    const {output} = await generalChatPrompt(input);
    return output!;
  }
);
