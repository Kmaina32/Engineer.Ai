
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wrench, Zap, Thermometer, Wind } from "lucide-react";
import AiTools from "../dashboard/ai-tools";

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
        <div className="mt-8">
            <AiTools />
        </div>
    </div>
  );
}
