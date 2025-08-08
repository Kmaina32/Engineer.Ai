
"use client"

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Code, GitMerge, AlertTriangle, Bug, Loader2 } from "lucide-react";
import { refactorCode, type RefactorCodeOutput } from "@/ai/flows/refactor-code";
import { useToast } from "@/hooks/use-toast";

const refactorSchema = z.object({
    code: z.string().min(20, "Please enter a code snippet of at least 20 characters."),
});
type RefactorFormValues = z.infer<typeof refactorSchema>;


export function SoftwareEngineerDashboard() {
  const [refactorResult, setRefactorResult] = useState<RefactorCodeOutput | null>(null);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const { toast } = useToast();

  const form = useForm<RefactorFormValues>({
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

  const onSubmit: SubmitHandler<RefactorFormValues> = async (data) => {
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
    <div>
      <h1 className="text-2xl font-bold tracking-tight my-4">Software Engineer Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Code Analysis</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">742</div>
                <p className="text-xs text-muted-foreground">lines of code analyzed</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open PRs</CardTitle>
                <GitMerge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">awaiting review</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">production services affected</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bug Tracker</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">21</div>
                <p className="text-xs text-muted-foreground">new tickets this week</p>
            </CardContent>
        </Card>
      </div>
       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                 <CardHeader>
                    <CardTitle>AI-Powered Code Refactoring</CardTitle>
                    <CardDescription>Paste your code snippet below to get AI suggestions for optimization and refactoring.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
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
            {isRefactoring ? (
                <Card className="flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                        <p className="mt-2 text-muted-foreground">Analyzing your code...</p>
                    </div>
                </Card>
            ) : refactorResult && (
                <Card>
                    <CardHeader>
                        <CardTitle>Refactoring Suggestions</CardTitle>
                         <CardDescription>{refactorResult.explanation}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                            <code className="font-mono text-xs">{refactorResult.refactoredCode}</code>
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
