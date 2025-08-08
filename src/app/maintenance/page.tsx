
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <h1 className="text-2xl font-bold tracking-tight my-4">Maintenance Schedule</h1>
            <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No maintenance tasks scheduled.</p>
                <p className="text-sm text-muted-foreground">Check back later for updates.</p>
            </div>
        </main>
      </div>
    </div>
  );
}
