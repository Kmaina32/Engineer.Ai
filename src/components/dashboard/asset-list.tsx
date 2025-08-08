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

const assets: Asset[] = [
  { id: "PMP-001", name: "Main Coolant Pump", type: "Centrifugal Pump", location: "Sector A", status: "Operational", criticality: "High", warranty: "2025-12-31" },
  { id: "GEN-003", name: "Backup Generator", type: "Diesel Generator", location: "Sector B", status: "Warning", criticality: "High", warranty: "2026-06-30" },
  { id: "CMP-007", name: "Air Compressor", type: "Reciprocating Compressor", location: "Sector C", status: "Operational", criticality: "Medium", warranty: "2024-10-15" },
  { id: "FAN-012", name: "Exhaust Fan", type: "Axial Fan", location: "Sector A", status: "Critical", criticality: "Low", warranty: "2025-02-28" },
  { id: "TRN-002", name: "Power Transformer", type: "Transformer", location: "Substation 1", status: "Operational", criticality: "High", warranty: "2030-01-01" },
  { id: "VLV-089", name: "Main Water Valve", type: "Gate Valve", location: "Water Intake", status: "Maintenance", criticality: "Medium", warranty: "2027-07-20" },
];

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

export default function AssetList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Assets</CardTitle>
        <CardDescription>
          A centralized list of all tracked equipment and assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Criticality</span></TableHead>
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
      </CardContent>
    </Card>
  );
}
