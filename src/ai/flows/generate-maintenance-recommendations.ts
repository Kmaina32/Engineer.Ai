// Implemented generateMaintenanceRecommendations flow to provide actionable maintenance recommendations.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating maintenance recommendations based on sensor data.
 *
 * - generateMaintenanceRecommendations - A function that generates maintenance recommendations.
 * - MaintenanceRecommendationsInput - The input type for the generateMaintenanceRecommendations function.
 * - MaintenanceRecommendationsOutput - The output type for the generateMaintenanceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintenanceRecommendationsInputSchema = z.object({
  sensorData: z.string().describe('Sensor data from the equipment.'),
  equipmentType: z.string().describe('The type of equipment being monitored.'),
  pastMaintenance: z.string().optional().describe('A description of past maintenance for the equipment, if any.'),
});
export type MaintenanceRecommendationsInput = z.infer<typeof MaintenanceRecommendationsInputSchema>;

const MaintenanceRecommendationsOutputSchema = z.object({
  recommendation: z.string().describe('The recommended maintenance action.'),
  confidenceLevel: z.number().describe('The confidence level (0-1) for the recommendation.'),
  potentialImpact: z.string().describe('The potential impact of not performing the maintenance.'),
});
export type MaintenanceRecommendationsOutput = z.infer<typeof MaintenanceRecommendationsOutputSchema>;

export async function generateMaintenanceRecommendations(
  input: MaintenanceRecommendationsInput
): Promise<MaintenanceRecommendationsOutput> {
  return generateMaintenanceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMaintenanceRecommendationsPrompt',
  input: {schema: MaintenanceRecommendationsInputSchema},
  output: {schema: MaintenanceRecommendationsOutputSchema},
  prompt: `You are an AI assistant that generates maintenance recommendations for industrial equipment based on sensor data.

  Analyze the provided sensor data and suggest a maintenance action, along with a confidence level (0-1) and the potential impact if the maintenance is not performed.
  Include specific details for the maintenance engineer to act on.

  Equipment Type: {{{equipmentType}}}
  Sensor Data: {{{sensorData}}}
  Past Maintenance: {{#if pastMaintenance}}{{{pastMaintenance}}}{{else}}No past maintenance information available.{{/if}}
  `,
});

const generateMaintenanceRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateMaintenanceRecommendationsFlow',
    inputSchema: MaintenanceRecommendationsInputSchema,
    outputSchema: MaintenanceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
