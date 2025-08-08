"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, CircuitBoard, Loader2, Code } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { detectAnomalies, type DetectAnomaliesOutput } from "@/ai/flows/detect-anomalies";
import { generateMaintenanceRecommendations, type MaintenanceRecommendationsOutput } from "@/ai/flows/generate-maintenance-recommendations";
import { refactorCode, type RefactorCodeOutput } from "@/ai/flows/refactor-code";

const anomalySchema = z.object({
  sensorData: z.string().min(10, "Please enter more detailed sensor data."),
});
type AnomalyFormValues = z.infer<typeof anomalySchema>;

const recommendationSchema = z.object({
  sensorData: z.string().min(10, "Please enter more detailed sensor data."),
  equipmentType: z.string().min(3, "Please specify the equipment type."),
  pastMaintenance: z.string().optional(),
});
type RecommendationFormValues = z.infer<typeof recommendationSchema>;

const refactorSchema = z.object({
    code: z.string().min(20, "Please enter a code snippet of at least 20 characters."),
});
type RefactorFormValues = z.infer<typeof refactorSchema>;


export default function AiTools() {
  const [anomalyResult, setAnomalyResult] = useState<DetectAnomaliesOutput | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<MaintenanceRecommendationsOutput | null>(null);
  const [refactorResult, setRefactorResult] = useState<RefactorCodeOutput | null>(null);
  const [isAnomalyLoading, setIsAnomalyLoading] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const { toast } = useToast();

  const anomalyForm = useForm<AnomalyFormValues>({
    resolver: zodResolver(anomalySchema),
    defaultValues: {
      sensorData: "Vibration: 0.5 mm/s, Temperature: 75°C, Pressure: 150 psi, RPM: 3000",
    },
  });

  const recommendationForm = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      sensorData: "Vibration: 1.2 mm/s, Temperature: 95°C, Pressure: 140 psi, Noise: 85 dB",
      equipmentType: "Centrifugal Pump",
      pastMaintenance: "Last serviced 6 months ago. Replaced bearings.",
    },
  });

  const refactorForm = useForm<RefactorFormValues>({
    resolver: zodResolver(refactorSchema),
    defaultValues: {
      code: `function inefficientLoop(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i] % 2 === 0) {
      result.push(items[i] * 2);
    }
  }
  return result;
}`,
    },
  });


  const onAnomalySubmit: SubmitHandler<AnomalyFormValues> = async (data) => {
    setIsAnomalyLoading(true);
    setAnomalyResult(null);
    try {
      const result = await detectAnomalies(data);
      setAnomalyResult(result);
    } catch (error) {
      console.error("Anomaly detection failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to detect anomaly. Please try again.",
      });
    } finally {
      setIsAnomalyLoading(false);
    }
  };

  const onRecommendationSubmit: SubmitHandler<RecommendationFormValues> = async (data) => {
    setIsRecommendationLoading(true);
    setRecommendationResult(null);
    try {
      const result = await generateMaintenanceRecommendations(data);
      setRecommendationResult(result);
    } catch (error) {
      console.error("Recommendation generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
      });
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  const onRefactorSubmit: SubmitHandler<RefactorFormValues> = async (data) => {
    setIsRefactoring(true);
    setRefactorResult(null);
    try {
        const result = await refactorCode(data);
        setRefactorResult(result);
    } catch (error) {
        console.error("Code refactoring failed:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to refactor code. Please try again.",
        });
    } finally {
        setIsRefactoring(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle>Anomaly Detection</CardTitle>
            <CardDescription>Enter sensor data to detect operational anomalies.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...anomalyForm}>
                <form onSubmit={anomalyForm.handleSubmit(onAnomalySubmit)} className="space-y-4">
                <FormField
                    control={anomalyForm.control}
                    name="sensorData"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sensor Data</FormLabel>
                        <FormControl>
                        <Textarea placeholder="e.g., Vibration: 0.5, Temp: 60C..." {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button variant="accent" type="submit" disabled={isAnomalyLoading}>
                    {isAnomalyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Detect Anomaly
                </Button>
                </form>
            </Form>
            {anomalyResult && (
                <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-2 font-semibold">Detection Result:</h4>
                <p className={`font-bold ${anomalyResult.isAnomaly ? 'text-destructive' : 'text-green-500'}`}>
                    {anomalyResult.isAnomaly ? 'Anomaly Detected' : 'Normal Operation'}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{anomalyResult.explanation}</p>
                <p className="mt-2 text-sm">
                    Confidence: <span className="font-mono">{(anomalyResult.confidenceLevel * 100).toFixed(1)}%</span>
                </p>
                </div>
            )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Maintenance Recommendations</CardTitle>
            <CardDescription>Generate actionable maintenance recommendations from data.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...recommendationForm}>
                <form onSubmit={recommendationForm.handleSubmit(onRecommendationSubmit)} className="space-y-4">
                <FormField
                    control={recommendationForm.control}
                    name="equipmentType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Equipment Type</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Water Pump" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={recommendationForm.control}
                    name="sensorData"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sensor Data</FormLabel>
                        <FormControl>
                        <Textarea placeholder="e.g., Vibration: 1.2, Temp: 95C..." {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={recommendationForm.control}
                    name="pastMaintenance"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Past Maintenance (Optional)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="e.g., Replaced bearings 6 months ago" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button variant="accent" type="submit" disabled={isRecommendationLoading}>
                    {isRecommendationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get Recommendation
                </Button>
                </form>
            </Form>
            {recommendationResult && (
                <div className="mt-6 rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-2 font-semibold">AI Recommendation:</h4>
                <p className="font-semibold text-accent">{recommendationResult.recommendation}</p>
                <p className="mt-2 text-sm text-muted-foreground"><span className="font-semibold text-card-foreground">Potential Impact:</span> {recommendationResult.potentialImpact}</p>
                <p className="mt-2 text-sm">
                    Confidence: <span className="font-mono">{(recommendationResult.confidenceLevel * 100).toFixed(1)}%</span>
                </p>
                </div>
            )}
            </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                 <CardHeader>
                    <CardTitle>AI-Powered Code Refactoring</CardTitle>
                    <CardDescription>Paste a code snippet below to get AI suggestions for optimization and refactoring.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...refactorForm}>
                        <form onSubmit={refactorForm.handleSubmit(onRefactorSubmit)} className="space-y-4">
                            <FormField
                                control={refactorForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                         <FormLabel>Code to Refactor</FormLabel>
                                        <FormControl>
                                            <Textarea className="w-full h-48 font-mono text-xs" placeholder="function example(a, b) { ... }" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant="accent" type="submit" disabled={isRefactoring}>
                                {isRefactoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-4 w-4" />}
                                {isRefactoring ? 'Refactoring...' : 'Refactor Code'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Refactoring Suggestions</CardTitle>
                    <CardDescription>The AI's analysis and refactored code will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isRefactoring ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="text-center">
                                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                                <p className="mt-2 text-muted-foreground">Analyzing your code...</p>
                            </div>
                        </div>
                    ) : refactorResult ? (
                        <div>
                             <h4 className="mb-2 font-semibold">Explanation:</h4>
                             <p className="text-sm text-muted-foreground mb-4">{refactorResult.explanation}</p>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                                <code className="font-mono text-xs">{refactorResult.refactoredCode}</code>
                            </pre>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md">
                            <p className="text-muted-foreground">Waiting for code submission...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
