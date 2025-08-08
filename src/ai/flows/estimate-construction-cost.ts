'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating construction costs.
 *
 * - estimateConstructionCost - A function that takes project details and returns a cost estimation.
 * - EstimateConstructionCostInput - The input type for the function.
 * - EstimateConstructionCostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimateConstructionCostInputSchema = z.object({
  projectDescription: z.string().describe('A detailed description of the construction project.'),
  location: z.string().describe('The city or region where the project is located, e.g., "San Francisco, CA".'),
  squareFootage: z.number().describe('The total square footage of the project area.'),
});
export type EstimateConstructionCostInput = z.infer<typeof EstimateConstructionCostInputSchema>;

const EstimateConstructionCostOutputSchema = z.object({
  estimatedCost: z.number().describe('The total estimated construction cost in USD.'),
  costBreakdown: z.string().describe('A markdown-formatted string detailing the cost breakdown (e.g., materials, labor, permits).'),
  assumptions: z.string().describe('A list of assumptions made during the cost estimation.'),
  confidence: z.number().min(0).max(1).describe('A confidence level (0-1) for the estimation accuracy.'),
});
export type EstimateConstructionCostOutput = z.infer<typeof EstimateConstructionCostOutputSchema>;

export async function estimateConstructionCost(input: EstimateConstructionCostInput): Promise<EstimateConstructionCostOutput> {
  return estimateConstructionCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateConstructionCostPrompt',
  input: { schema: EstimateConstructionCostInputSchema },
  output: { schema: EstimateConstructionCostOutputSchema },
  prompt: `You are an expert AI Quantity Surveyor. Your task is to provide a preliminary construction cost estimate based on the following project details.

  Your estimate should be as accurate as possible, considering standard rates for the specified location.

  Project Details:
  - Location: {{{location}}}
  - Square Footage: {{{squareFootage}}}
  - Description: {{{projectDescription}}}

  Provide a total estimated cost, a detailed cost breakdown in markdown, a list of assumptions you made, and a confidence score for your estimate.
  The cost breakdown should include major categories like site work, foundation, structure, facade, MEP (Mechanical, Electrical, Plumbing), and finishes.
  `,
});

const estimateConstructionCostFlow = ai.defineFlow(
  {
    name: 'estimateConstructionCostFlow',
    inputSchema: EstimateConstructionCostInputSchema,
    outputSchema: EstimateConstructionCostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
