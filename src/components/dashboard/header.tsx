
"use client"

import Link from "next/link";
import {
  PanelLeft,
  Search,
  Home,
  CircuitBoard,
  Bell,
  Bot,
  Wrench,
  LifeBuoy,
  Settings,
  BrainCircuit,
  Check
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoIcon } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";


const notifications = [
    { title: "Critical Alert: Pump P-102", description: "Vibration levels exceeded threshold by 15%. Immediate inspection required.", time: "2 min ago" },
    { title: "Maintenance Reminder", description: "Scheduled maintenance for Conveyor C-3 is due tomorrow.", time: "1 hour ago" },
    { title: "New Feature Unlocked", description: "The AI-powered code refactoring tool is now available for all software engineers.", time: "1 day ago" },
]


export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-accent text-lg font-semibold text-accent-foreground md:text-base"
          >
            <LogoIcon className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">PredictAI</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/assets"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <CircuitBoard className="h-5 w-5" />
            Assets
          </Link>
          <Link
            href="/ai-tools"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BrainCircuit className="h-5 w-5" />
            AI Tools
          </Link>
          <Link
            href="/chatbot"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Bot className="h-5 w-5" />
            Chatbot
          </Link>
          <Link
            href="/maintenance"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Wrench className="h-5 w-5" />
            Maintenance
          </Link>
            <Link
              href="/support"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LifeBuoy className="h-5 w-5" />
              Support
            </Link>
             <Link
              href="/settings"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
             <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent/80"></span>
              </span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
           <Card className="border-0 shadow-none">
            <CardHeader className="flex-row items-center justify-between p-4 space-y-0">
                <CardTitle className="text-lg">Notifications</CardTitle>
                 <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    <Check className="h-4 w-4 mr-1"/>
                    Mark all as read
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-2">
                    {notifications.map((notification, index) => (
                         <div key={index} className="flex items-start gap-4 p-4 border-t hover:bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 animate-pulse"/>
                            <div className="grid gap-1">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
           </Card>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <span className="sr-only">Open user menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/support')}>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
