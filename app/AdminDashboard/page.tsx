"use client";

import React, { useState } from "react";
import Property from "./property/page";
import Broker from "./broker/page";
import Redevelopment from "./redevelopment/page";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Properties");

  return (
    <div className="min-h-screen bg-[#faeebf] text-[#d6a243]  p-6">
      <nav className="flex gap-4 mb-6">
        {["Properties", "Brokers", "Redevelopment", "Orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Properties" && <Property></Property>}
      {activeTab === "Brokers" && <Broker></Broker>}
      {activeTab === "Redevelopment" && <Redevelopment></Redevelopment>}
    </div>
  );
};

export default AdminDashboard;