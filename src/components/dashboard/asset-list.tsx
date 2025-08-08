

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

export default function AssetList() {
    const [assets, setAssets] = useState<Asset[]>([]);

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
        )}
      </CardContent>
    </Card>
  );
}
