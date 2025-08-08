"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { time: "00:00", vibration: 0.5, temperature: 75 },
  { time: "02:00", vibration: 0.6, temperature: 76 },
  { time: "04:00", vibration: 0.55, temperature: 75.5 },
  { time: "06:00", vibration: 0.7, temperature: 80 },
  { time: "08:00", vibration: 0.75, temperature: 82 },
  { time: "10:00", vibration: 0.65, temperature: 78 },
  { time: "12:00", vibration: 1.2, temperature: 95 },
  { time: "14:00", vibration: 1.1, temperature: 93 },
]

const chartConfig = {
  vibration: {
    label: "Vibration (mm/s)",
    color: "hsl(var(--chart-1))",
  },
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function SensorChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PMP-001 - Real-time Sensor Data</CardTitle>
        <CardDescription>Last 14 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
                yAxisId="left"
                stroke="hsl(var(--chart-1))"
            />
            <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--chart-2))"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="vibration"
              type="monotone"
              stroke="var(--color-vibration)"
              strokeWidth={2}
              dot={false}
              yAxisId="left"
              name="Vibration"
            />
            <Line
              dataKey="temperature"
              type="monotone"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
              yAxisId="right"
              name="Temperature"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Anomaly detected at 12:00 <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Vibration and temperature spike
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
