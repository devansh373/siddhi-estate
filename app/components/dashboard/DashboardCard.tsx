import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => (
  <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 border border-orange-700">
    <h2 className="text-lg font-semibold text-red-700 mb-2">{title}</h2>
    <p className="text-3xl font-bold text-red-600 drop-shadow-sm">{value}</p>
  </div>
);

export default DashboardCard;
