

"use client";

import type { Asset } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";


const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Operational": "default",
  "Warning": "secondary",
  "Critical": "destructive",
  "Maintenance": "outline",
};

const criticalityVariantMap: Record<string, "default" | "secondary" | "destructive"> = {
    "High": "destructive",
    "Medium": "secondary",
    "Low": "default",
}

const sampleAssets: Asset[] = [
    {
      id: "PMP-001",
      name: "Centrifugal Pump",
      type: "Pump",
      location: "Sector A, Bay 1",
      status: "Operational",
      criticality: "High",
      warranty: "2025-12-31",
    },
    {
      id: "MOT-002",
      name: "Induction Motor",
      type: "Motor",
      location: "Sector B, Bay 3",
      status: "Warning",
      criticality: "Medium",
      warranty: "2024-10-15",
    },
    {
      id: "CMP-003",
      name: "Air Compressor",
      type: "Compressor",
      location: "Sector A, Bay 2",
      status: "Critical",
      criticality: "High",
      warranty: "2026-01-20",
    },
    {
      id: "FAN-004",
      name: "Ventilation Fan",
      type: "Fan",
      location: "Rooftop Unit 1",
      status: "Maintenance",
      criticality: "Low",
      warranty: "2024-08-01",
    },
    {
      id: "TBN-005",
      name: "Steam Turbine",
      type: "Turbine",
      location: "Powerhouse",
      status: "Operational",
      criticality: "High",
      warranty: "2030-05-10",
    },
];

const assetSchema = z.object({
    id: z.string().min(1, "Asset ID is required"),
    name: z.string().min(1, "Asset name is required"),
    type: z.string().min(1, "Asset type is required"),
    location: z.string().min(1, "Location is required"),
    status: z.enum(["Operational", "Warning", "Critical", "Maintenance"]),
    criticality: z.enum(["High", "Medium", "Low"]),
    warranty: z.string().min(1, "Warranty date is required"),
});

type AssetFormValues = z.infer<typeof assetSchema>;


export default function AssetList() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            id: "",
            name: "",
            type: "",
            location: "",
            status: "Operational",
            criticality: "Medium",
            warranty: "",
        },
    });

    useEffect(() => {
        // In a real application, you would fetch this data from an API.
        setAssets(sampleAssets);
    }, []);

    const onSubmit: SubmitHandler<AssetFormValues> = (data) => {
        setAssets(prev => [...prev, data]);
        form.reset();
        setIsDialogOpen(false);
    };

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Equipment Assets</CardTitle>
            <CardDescription>
            A centralized list of all tracked equipment and assets.
            </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1" variant="accent">
                    <PlusCircle className="h-4 w-4" />
                    Add Asset
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                        <DialogTitle>Add New Asset</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new asset below.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField control={form.control} name="id" render={({ field }) => (
                                <FormItem><FormLabel>Asset ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Asset Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Operational">Operational</SelectItem>
                                            <SelectItem value="Warning">Warning</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="criticality" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Criticality</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select criticality" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="warranty" render={({ field }) => (
                                <FormItem><FormLabel>Warranty Expiry</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" variant="accent">Add Asset</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No assets found.</p>
                <p className="text-sm text-muted-foreground">Add new assets to get started.</p>
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead className="hidden md:table-cell text-right">Warranty</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assets.map((asset) => (
                <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{asset.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{asset.location}</TableCell>
                    <TableCell>
                    <Badge variant={statusVariantMap[asset.status]} className={asset.status === 'Operational' ? 'bg-green-600/80 text-white' : ''}>
                        {asset.status}
                    </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={criticalityVariantMap[asset.criticality]} className="capitalize">
                            {asset.criticality}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">{asset.warranty}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </CardContent>
       <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{assets.length}</strong> of <strong>{assets.length}</strong> assets
        </div>
      </CardFooter>
    </Card>
    </>
  );
}

    