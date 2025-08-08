
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, GitMerge, AlertTriangle, Bug } from "lucide-react";

export function SoftwareEngineerDashboard() {
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
       <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Code Refactoring</CardTitle>
                    <CardDescription>Paste your code snippet below to get AI suggestions for optimization and refactoring.</CardDescription>
                </CardHeader>
                <CardContent>
                    <textarea className="w-full h-48 p-2 border rounded-md bg-muted font-mono text-sm" placeholder="function example(a, b) { ... }"></textarea>
                    <Button variant="accent" className="mt-4">Refactor Code</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
