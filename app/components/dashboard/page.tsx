import React from "react";
import DashboardCard from "./DashboardCard";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <DashboardCard title="Revenue" value="$10,000" />
      <DashboardCard title="Users" value={250} />
      <DashboardCard title="Orders" value={120} />
      <DashboardCard title="Growth" value="15%" />
    </div>
  );
}
