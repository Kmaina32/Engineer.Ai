
"use client";

import { useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, CircuitBoard, Loader2, Code, Building, DraftingCompass, Upload, FileImage } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { detectAnomalies, type DetectAnomaliesOutput } from "@/ai/flows/detect-anomalies";
import { generateMaintenanceRecommendations, type MaintenanceRecommendationsOutput } from "@/ai/flows/generate-maintenance-recommendations";
import { refactorCode, type RefactorCodeOutput } from "@/ai/flows/refactor-code";
import { estimateConstructionCost, type EstimateConstructionCostOutput } from "@/ai/flows/estimate-construction-cost";
import { analyzeDrawing, type AnalyzeDrawingOutput } from "@/ai/flows/analyze-drawing";
import { Badge } from "../ui/badge";

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

const costEstimatorSchema = z.object({
    projectDescription: z.string().min(20, "Please provide a more detailed project description."),
    location: z.string().min(2, "Please enter a valid location."),
    squareFootage: z.coerce.number().min(1, "Square footage must be greater than zero."),
});
type CostEstimatorFormValues = z.infer<typeof costEstimatorSchema>;

const drawingAnalysisSchema = z.object({
    analysisQuery: z.string().min(10, "Please provide a specific question for the analysis."),
    drawingFile: z.any().refine(files => files?.length === 1, "Please upload one image file."),
});
type DrawingAnalysisFormValues = z.infer<typeof drawingAnalysisSchema>;


export default function AiTools() {
  const [anomalyResult, setAnomalyResult] = useState<DetectAnomaliesOutput | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<MaintenanceRecommendationsOutput | null>(null);
  const [refactorResult, setRefactorResult] = useState<RefactorCodeOutput | null>(null);
  const [costResult, setCostResult] = useState<EstimateConstructionCostOutput | null>(null);
  const [drawingResult, setDrawingResult] = useState<AnalyzeDrawingOutput | null>(null);
  const [drawingPreview, setDrawingPreview] = useState<string | null>(null);

  const [isAnomalyLoading, setIsAnomalyLoading] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const costEstimatorForm = useForm<CostEstimatorFormValues>({
    resolver: zodResolver(costEstimatorSchema),
    defaultValues: {
        projectDescription: "A 3-story office building with a concrete frame, glass curtain wall, and standard interior finishes.",
        location: "New York, NY",
        squareFootage: 50000,
    }
  });

  const drawingAnalysisForm = useForm<DrawingAnalysisFormValues>({
    resolver: zodResolver(drawingAnalysisSchema),
    defaultValues: {
        analysisQuery: "Check this floor plan for accessibility compliance (e.g., door widths, ramp slopes) and suggest improvements.",
    }
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

  const onCostEstimatorSubmit: SubmitHandler<CostEstimatorFormValues> = async (data) => {
    setIsEstimating(true);
    setCostResult(null);
    try {
        const result = await estimateConstructionCost(data);
        setCostResult(result);
    } catch(error) {
        console.error("Cost estimation failed:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to estimate cost. Please try again.",
        });
    } finally {
        setIsEstimating(false);
    }
  };

  const onDrawingAnalysisSubmit: SubmitHandler<DrawingAnalysisFormValues> = async (data) => {
    setIsAnalyzing(true);
    setDrawingResult(null);

    const file = data.drawingFile[0];
    if (!file) {
        toast({ variant: "destructive", title: "Error", description: "No file selected."});
        setIsAnalyzing(false);
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const drawingDataUri = reader.result as string;
        try {
            const result = await analyzeDrawing({
                drawingDataUri,
                analysisQuery: data.analysisQuery,
            });
            setDrawingResult(result);
        } catch(error) {
            console.error("Drawing analysis failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to analyze drawing. Please try again.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };
     reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({ variant: 'destructive', title: 'File Error', description: 'Could not read the selected file.' });
        setIsAnalyzing(false);
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDrawingPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Architectural Drawing Analyzer</CardTitle>
                <CardDescription>Upload a drawing to get an AI-powered analysis for compliance, suggestions, and potential issues.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 lg:grid-cols-2">
                 <div>
                    <Form {...drawingAnalysisForm}>
                        <form onSubmit={drawingAnalysisForm.handleSubmit(onDrawingAnalysisSubmit)} className="space-y-4">
                            <FormField
                                control={drawingAnalysisForm.control}
                                name="drawingFile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Drawing File</FormLabel>
                                        <FormControl>
                                             <div
                                                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                                                onClick={() => fileInputRef.current?.click()}
                                                >
                                                {drawingPreview ? (
                                                    <Image src={drawingPreview} alt="Drawing preview" layout="fill" objectFit="contain" className="rounded-lg" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG, or other image formats</p>
                                                    </div>
                                                )}
                                                 <Input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        handleFileChange(e);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={drawingAnalysisForm.control}
                                name="analysisQuery"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Analysis Prompt</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="e.g., Check for ADA compliance and suggest improvements..." {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button variant="accent" type="submit" disabled={isAnalyzing}>
                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DraftingCompass className="mr-2 h-4 w-4" />}
                                Analyze Drawing
                            </Button>
                        </form>
                    </Form>
                 </div>
                 <div>
                     <h4 className="mb-4 font-semibold text-lg">Analysis Result</h4>
                     {isAnalyzing ? (
                         <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md">
                            <div className="text-center">
                                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                                <p className="mt-2 text-muted-foreground">Analyzing your drawing...</p>
                            </div>
                        </div>
                     ) : drawingResult ? (
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-4 max-h-[500px] overflow-y-auto">
                            <div>
                                <h5 className="font-semibold">Summary</h5>
                                <p className="text-sm text-muted-foreground">{drawingResult.summary}</p>
                            </div>
                             <div>
                                <h5 className="font-semibold">Potential Issues</h5>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {drawingResult.potentialIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-semibold">Suggestions</h5>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {drawingResult.suggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                                </ul>
                            </div>
                        </div>
                     ) : (
                        <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md">
                             <div className="text-center">
                                <FileImage className="w-10 h-10 mx-auto text-muted-foreground" />
                                <p className="mt-2 text-muted-foreground">Waiting for drawing submission...</p>
                            </div>
                        </div>
                     )}
                 </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>Construction Cost Estimator</CardTitle>
            <CardDescription>Enter project details to get an AI-powered cost estimation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 lg:grid-cols-2">
                <div>
                    <Form {...costEstimatorForm}>
                        <form onSubmit={costEstimatorForm.handleSubmit(onCostEstimatorSubmit)} className="space-y-4">
                        <FormField
                            control={costEstimatorForm.control}
                            name="projectDescription"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Description</FormLabel>
                                <FormControl>
                                <Textarea placeholder="e.g., A 10-story residential building..." {...field} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={costEstimatorForm.control}
                                name="location"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={costEstimatorForm.control}
                                name="squareFootage"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Square Footage</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g., 50000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <Button variant="accent" type="submit" disabled={isEstimating}>
                            {isEstimating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building className="mr-2 h-4 w-4" />}
                            Estimate Cost
                        </Button>
                        </form>
                    </Form>
                </div>
                 <div>
                    <h4 className="mb-4 font-semibold text-lg">Estimation Result</h4>
                    {isEstimating ? (
                         <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md">
                            <div className="text-center">
                                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                                <p className="mt-2 text-muted-foreground">Calculating your estimate...</p>
                            </div>
                        </div>
                    ) : costResult ? (
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
                                <p className="text-3xl font-bold text-accent">${costResult.estimatedCost.toLocaleString()}</p>
                                <Badge>Confidence: {(costResult.confidence * 100).toFixed(0)}%</Badge>
                            </div>
                            <div>
                                <h5 className="font-semibold">Cost Breakdown</h5>
                                <div className="text-sm text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: costResult.costBreakdown.replace(/\n/g, '<br />') }} />
                            </div>
                            <div>
                                <h5 className="font-semibold">Assumptions</h5>
                                <p className="text-sm text-muted-foreground">{costResult.assumptions}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md">
                            <p className="text-muted-foreground">Waiting for project details...</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
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
