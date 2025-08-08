
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Code, GitMerge, AlertTriangle, Bug, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";


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
            <Card className="flex flex-col items-center justify-center py-12">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                      <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">Advanced AI Engineering Tools</CardTitle>
                    <CardDescription>Use our dedicated AI tools for anomaly detection, maintenance recommendations, and code refactoring.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/ai-tools">
                        <Button variant="accent">Go to AI Tools</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
