import AssetList from "@/components/dashboard/asset-list";
import AiTools from "@/components/dashboard/ai-tools";
import Header from "@/components/dashboard/header";
import OverviewCards from "@/components/dashboard/overview-cards";
import Sidebar from "@/components/dashboard/sidebar";
import SensorChart from "@/components/dashboard/sensor-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            </TabsList>
            <TabsContent value="overview">
               <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
                  <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <OverviewCards />
                    <SensorChart />
                    <AssetList />
                  </div>
                  <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 xl:col-span-1">
                     {/* Placeholder for other content */}
                  </div>
               </div>
            </TabsContent>
            <TabsContent value="ai-tools">
                <AiTools />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
