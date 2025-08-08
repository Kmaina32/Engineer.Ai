import AssetList from "@/components/dashboard/asset-list";
import AiTools from "@/components/dashboard/ai-tools";
import Header from "@/components/dashboard/header";
import OverviewCards from "@/components/dashboard/overview-cards";
import Sidebar from "@/components/dashboard/sidebar";
import SensorChart from "@/components/dashboard/sensor-chart";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <OverviewCards />
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <AssetList />
            </div>
            <SensorChart />
          </div>
          <AiTools />
        </main>
      </div>
    </div>
  );
}
