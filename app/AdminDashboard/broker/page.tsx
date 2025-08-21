"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

type Brokers = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  verified: boolean;
};

type Requirement = {
  _id?: string;
  title: string;
  details: string;
  location: string;
  type: "residential" | "commercial";
};

const Broker = () => {
  const [brokers, setBrokers] = useState<Brokers[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const brokersPerPage = 8;

  const totalPages = Math.ceil(brokers.length / brokersPerPage);

  const paginatedBrokers = brokers.slice(
    (currentPage - 1) * brokersPerPage,
    currentPage * brokersPerPage
  );
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [editingRequirement, setEditingRequirement] =
    useState<Requirement | null>(null);
  const [newRequirement, setNewRequirement] = useState<Requirement>({
    title: "",
    details: "",
    location: "",
    type: "residential",
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/brokers`)
      .then((res) => setBrokers(res.data))
      .catch(() => console.error("Failed to fetch brokers"));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property-requirements`)
      .then((res) => setRequirements(res.data.reverse()))
      .catch(() => console.error("Failed to fetch requirements"));
  }, []);

  const toggleVerified = async (id: string, current: boolean) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/brokers/${id}`,
        {
          verified: !current,
        }
      );
      setBrokers((prev) =>
        prev.map((b) => (b._id === id ? { ...b, verified: !current } : b))
      );
    } catch {
      alert("Failed to update verification status");
    }
  };

  const deleteBroker = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this broker?"))
        return;
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/brokers/${id}`);
      setBrokers((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Failed to delete broker");
    }
  };

  const handleRequirementSave = async () => {
    try {
      if (editingRequirement && editingRequirement._id) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/property-requirements/${editingRequirement._id}`,
          editingRequirement
        );
        setRequirements((prev) =>
          prev.map((r) => (r._id === res.data._id ? res.data : r))
        );
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/property-requirements`,
          newRequirement
        );
        setRequirements((prev) => [res.data, ...prev]);
        setNewRequirement({
          title: "",
          details: "",
          location: "",
          type: "residential",
        });
      }
      setEditingRequirement(null);
    } catch {
      alert("Failed to save requirement");
    }
  };

  const handleRequirementDelete = async (id: string) => {
    if (!window.confirm("Delete this requirement?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/property-requirements/${id}`
      );
      setRequirements((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold text-red-700 mb-6">
          Broker Management
        </h2>

        <div className="overflow-x-auto shadow rounded-lg border border-red-200">
          <table className="min-w-full text-left text-sm bg-white">
            <thead className="bg-red-100 text-red-800 font-semibold">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Verified</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrokers.map((broker) => (
                <tr key={broker._id} className="border-t">
                  <td className="px-4 py-2">{broker.name}</td>
                  <td className="px-4 py-2">{broker.email}</td>
                  <td className="px-4 py-2">{broker.phone}</td>
                  <td className="px-4 py-2">{broker.location}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        broker.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {broker.verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        toggleVerified(broker._id, broker.verified)
                      }
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      {broker.verified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => deleteBroker(broker._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="mt-12">
          <h3 className="text-xl font-bold text-red-700 mb-2">
            Property Requirements
          </h3>

          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={editingRequirement?.title ?? newRequirement.title}
                onChange={(e) =>
                  editingRequirement
                    ? setEditingRequirement({
                        ...editingRequirement,
                        title: e.target.value,
                      })
                    : setNewRequirement({
                        ...newRequirement,
                        title: e.target.value,
                      })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={editingRequirement?.location ?? newRequirement.location}
                onChange={(e) =>
                  editingRequirement
                    ? setEditingRequirement({
                        ...editingRequirement,
                        location: e.target.value,
                      })
                    : setNewRequirement({
                        ...newRequirement,
                        location: e.target.value,
                      })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Details"
                value={editingRequirement?.details ?? newRequirement.details}
                onChange={(e) =>
                  editingRequirement
                    ? setEditingRequirement({
                        ...editingRequirement,
                        details: e.target.value,
                      })
                    : setNewRequirement({
                        ...newRequirement,
                        details: e.target.value,
                      })
                }
                className="border p-2 rounded col-span-2"
              />
              <select
                value={editingRequirement?.type ?? newRequirement.type}
                onChange={(e) =>
                  editingRequirement
                    ? setEditingRequirement({
                        ...editingRequirement,
                        type: e.target.value as "residential" | "commercial",
                      })
                    : setNewRequirement({
                        ...newRequirement,
                        type: e.target.value as "residential" | "commercial",
                      })
                }
                className="border p-2 rounded"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <button
              onClick={handleRequirementSave}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingRequirement ? "Update" : "Add Requirement"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {requirements.map((r) => (
              <div
                key={r._id}
                className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow"
              >
                <h4 className="text-lg font-bold text-red-700">{r.title}</h4>
                <p className="text-sm text-gray-600">{r.details}</p>
                <p className="text-sm">📍 {r.location}</p>
                <p className="text-sm">🏠 {r.type}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setEditingRequirement(r)}
                    className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRequirementDelete(r._id!)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Broker;