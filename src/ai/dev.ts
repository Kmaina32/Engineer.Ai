import { config } from 'dotenv';
config();

import '@/ai/flows/detect-anomalies.ts';
import '@/ai/flows/generate-maintenance-recommendations.ts';
import '@/ai/flows/general-chat.ts';
import '@/ai/flows/refactor-code.ts';
import '@/ai/flows/estimate-construction-cost.ts';
import '@/ai/flows/analyze-drawing.ts';
