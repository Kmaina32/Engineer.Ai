
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AiTools from "@/components/dashboard/ai-tools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DefaultDashboard() {
  return (
    <div>
        <h1 className="text-2xl font-bold tracking-tight my-4">General Engineering Dashboard</h1>
        <Tabs defaultValue="overview">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Welcome!</CardTitle>
                    <CardDescription>This is your general dashboard. Use the AI tools tab for assistance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">More role-specific widgets and tools are coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="ai-tools">
            <AiTools />
        </TabsContent>
        </Tabs>
    </div>
  );
}
