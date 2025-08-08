export type Asset = {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "Operational" | "Warning" | "Critical" | "Maintenance";
  criticality: "High" | "Medium" | "Low";
  warranty: string;
};
