
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Zap, Waves, Thermometer, BatteryCharging } from "lucide-react";

const chartData = [
  { day: "Monday", kwh: 55 },
  { day: "Tuesday", kwh: 62 },
  { day: "Wednesday", kwh: 48 },
  { day: "Thursday", kwh: 71 },
  { day: "Friday", kwh: 68 },
  { day: "Saturday", kwh: 80 },
  { day: "Sunday", kwh: 75 },
];

const chartConfig = {
  kwh: {
    label: "kWh",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ElectricalEngineerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight my-4">Electrical Engineer Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power Consumption</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2,350 kWh</div>
                <p className="text-xs text-muted-foreground">Total consumption this month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Voltage Stability</CardTitle>
                <BatteryCharging className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">239.8 V</div>
                <p className="text-xs text-muted-foreground">Live main line voltage</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grid Frequency</CardTitle>
                <Waves className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">50.01 Hz</div>
                <p className="text-xs text-muted-foreground">Live grid frequency</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transformer Temp</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">68°C</div>
                <p className="text-xs text-muted-foreground">Core temperature reading</p>
            </CardContent>
        </Card>
      </div>
       <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Energy Usage</CardTitle>
                    <CardDescription>An overview of power consumption over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="kwh" fill="var(--color-kwh)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
