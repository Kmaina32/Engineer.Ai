
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Wrench, Zap, Thermometer, Wind, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const performanceData = [
  { hour: '00:00', pressure: 140, flowRate: 2200, efficiency: 85 },
  { hour: '02:00', pressure: 142, flowRate: 2300, efficiency: 84 },
  { hour: '04:00', pressure: 145, flowRate: 2250, efficiency: 83 },
  { hour: '06:00', pressure: 140, flowRate: 2100, efficiency: 86 },
  { hour: '08:00', pressure: 138, flowRate: 2050, efficiency: 87 },
  { hour: '10:00', pressure: 148, flowRate: 2400, efficiency: 82 },
  { hour: '12:00', pressure: 150, flowRate: 2500, efficiency: 80 },
  { hour: '14:00', pressure: 147, flowRate: 2450, efficiency: 81 },
];

const chartConfig = {
  pressure: {
    label: 'Pressure (psi)',
    color: 'hsl(var(--chart-1))',
  },
  flowRate: {
    label: 'Flow Rate (gpm)',
    color: 'hsl(var(--chart-2))',
  },
  efficiency: {
    label: 'Efficiency (%)',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function MechanicalEngineerDashboard() {
  return (
    <div>
        <h1 className="text-2xl font-bold tracking-tight my-4">Mechanical Engineer Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vibration Analysis</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0.12 mm/s</div>
                    <p className="text-xs text-muted-foreground">Real-time pump vibration</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Torque Monitoring</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">450 Nm</div>
                    <p className="text-xs text-muted-foreground">Active motor torque</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Heat Exchanger Temp</CardTitle>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">85°C</div>
                    <p className="text-xs text-muted-foreground">Outlet fluid temperature</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fluid Dynamics</CardTitle>
                    <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.5 m/s</div>
                    <p className="text-xs text-muted-foreground">Coolant flow rate</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 mt-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Pump Performance Analysis</CardTitle>
                    <CardDescription>Real-time performance metrics for Centrifugal Pump P-101.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend />
                            <Line type="monotone" dataKey="pressure" stroke="var(--color-pressure)" strokeWidth={2} dot={false}/>
                            <Line type="monotone" dataKey="flowRate" stroke="var(--color-flowRate)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="flex flex-col items-center justify-center">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-muted rounded-full p-3 w-fit">
                      <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mt-4">Need AI Assistance?</CardTitle>
                    <CardDescription>Use our dedicated AI tools for anomaly detection and maintenance recommendations.</CardDescription>
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
