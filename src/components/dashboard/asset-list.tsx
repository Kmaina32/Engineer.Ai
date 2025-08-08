

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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

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

export default function AssetList() {
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        // In a real application, you would fetch this data from an API.
        setAssets(sampleAssets);
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Assets</CardTitle>
        <CardDescription>
          A centralized list of all tracked equipment and assets.
        </CardDescription>
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
                <TableHead className="text-right">Criticality</TableHead>
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
                    <TableCell className="text-right">
                        <Badge variant={criticalityVariantMap[asset.criticality]} className="capitalize">
                            {asset.criticality}
                        </Badge>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
}
