import AiTools from "@/components/dashboard/ai-tools";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetList from "./asset-list";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
               <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
                  <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
                    <h1 className="text-2xl font-semibold">Welcome to your Dashboard</h1>
                    <p className="text-muted-foreground">This is your main dashboard. Use the tabs to navigate to different sections.</p>
                  </div>
               </div>
            </TabsContent>
            <TabsContent value="ai-tools">
                <AiTools />
            </TabsContent>
            <TabsContent value="assets">
                <AssetList />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
