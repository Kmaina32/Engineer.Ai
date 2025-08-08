'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting anomalies in sensor data.
 *
 * - detectAnomalies - A function that takes sensor data as input and returns anomaly detection results.
 * - DetectAnomaliesInput - The input type for the detectAnomalies function.
 * - DetectAnomaliesOutput - The return type for the detectAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  sensorData: z.string().describe('A string containing sensor data.')
});

export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const DetectAnomaliesOutputSchema = z.object({
  isAnomaly: z.boolean().describe('Whether an anomaly is detected in the sensor data.'),
  explanation: z.string().describe('An explanation of why the anomaly was detected, if any.'),
  confidenceLevel: z.number().describe('A confidence level (0-1) for the anomaly detection.'),
});

export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const detectAnomaliesPrompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `You are an expert in analyzing sensor data for industrial equipment.
  Given the following sensor data, determine if there is an anomaly.

  Sensor Data: {{{sensorData}}}

  Respond with whether an anomaly is present, explain why or why not, and provide a confidence level (0-1) for your assessment.
  Consider factors such as deviations from historical patterns, unusual spikes or drops, and correlations between different sensors.
  The confidence level must be between 0 and 1 inclusive.
  `,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await detectAnomaliesPrompt(input);
    return output!;
  }
);
