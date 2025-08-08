
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Bot, Building2, DraftingCompass, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const projectData = [
  { stage: "Concept", count: 2 },
  { stage: "Schematic", count: 4 },
  { stage: "Design Dev", count: 3 },
  { stage: "Construction Docs", count: 5 },
  { stage: "Bidding", count: 1 },
  { stage: "Construction", count: 2 },
];

const chartConfig = {
  count: {
    label: "Projects",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ArchitectDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight my-4">Architect Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">17</div>
                <p className="text-xs text-muted-foreground">Projects currently in progress</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drawings for Review</CardTitle>
                <DraftingCompass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Awaiting your approval</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Meetings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Analysis Ran</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Analyses performed this month</p>
            </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 mt-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Project Pipeline by Stage</CardTitle>
                    <CardDescription>An overview of current projects in different stages.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <BarChart accessibilityLayer data={projectData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="stage"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="flex flex-col items-center justify-center">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                      <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">AI Drawing Analysis</CardTitle>
                    <CardDescription>Use our dedicated AI tools for drawing analysis and other architectural tasks.</CardDescription>
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
