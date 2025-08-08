"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { AreaChart, Coins, Percent, FileText, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const budgetData = [
    { month: "Jan", budget: 50000, actual: 45000 },
    { month: "Feb", budget: 52000, actual: 51000 },
    { month: "Mar", budget: 55000, actual: 58000 },
    { month: "Apr", budget: 53000, actual: 54000 },
    { month: "May", budget: 56000, actual: 55500 },
    { month: "Jun", budget: 60000, actual: 59000 },
];

const chartConfig = {
    budget: {
        label: "Budget ($)",
        color: "hsl(var(--chart-2))",
    },
    actual: {
        label: "Actual ($)",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;


export function QuantitySurveyorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight my-4">Quantity Surveyor Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Cost Variance</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-500">-2.5%</div>
                <p className="text-xs text-muted-foreground">Under budget this quarter</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Material Usage</CardTitle>
                <AreaChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">Efficiency vs. Takeoff</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contract Variations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+5</div>
                <p className="text-xs text-muted-foreground">New variation orders this month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estimated Cost</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <p className="text-xs text-muted-foreground">Current project total</p>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Budget vs. Actual Spending</CardTitle>
                <CardDescription>Monthly overview of project financial performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart data={budgetData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`}/>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
                        <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card className="flex flex-col items-center justify-center">
            <CardHeader className="text-center">
                <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">AI-Powered Cost Estimation</CardTitle>
                <CardDescription>Use our dedicated AI tools for quick and accurate construction cost estimates.</CardDescription>
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
