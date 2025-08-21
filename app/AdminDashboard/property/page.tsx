"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import DashboardCard from "../../components/dashboard/DashboardCard";

type Property = {
  _id?: string;
  title: string;
  location: string;
  originalPrice: number;
  discountedPrice: number;
  area: number;
  type: string;
  bedrooms: number;
  availability: string;
  image: string;
};

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/property/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this property?"))
        return;
      await axios.delete(`http://localhost:5000/api/property/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete property");
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
  };

  return (
    <div>
      <section>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <DashboardCard title="Total Properties" value={properties.length} />
          <DashboardCard
            title="Available"
            value={properties.filter((p) => p.availability === "Available").length}
          />
          <DashboardCard
            title="Sold"
            value={properties.filter((p) => p.availability === "Sold").length}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0 bg-gradient-to-r from-yellow-50 to-red-50 px-4 py-3 rounded-md shadow-sm border border-red-100 text-amber-600">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-red-700">
              Property Management
            </h2>
            <button
              onClick={() =>
                setEditingProperty({
                  title: "",
                  location: "",
                  originalPrice: 0,
                  discountedPrice: 0,
                  area: 0,
                  type: "",
                  bedrooms: 0,
                  availability: "Available",
                  image: "",
                })
              }
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-lg font-bold shadow-md"
            >
              +
            </button>
          </div>
          <input
            type="text"
            placeholder="Search properties..."
            className="px-4 py-2 border border-yellow-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {editingProperty && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-amber-700">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              {editingProperty._id ? "Edit Property" : "Add New Property"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, title: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={editingProperty.location}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, location: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={editingProperty.originalPrice}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      originalPrice: Number(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  value={editingProperty.discountedPrice}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      discountedPrice: Number(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Area (sq.ft)</label>
                <input
                  type="number"
                  value={editingProperty.area}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      area: Number(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  value={editingProperty.type}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, type: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={editingProperty.bedrooms}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      bedrooms: Number(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <select
                  value={editingProperty.availability}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      availability: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingProperty({
                          ...editingProperty,
                          image: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              {editingProperty.image && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Preview</label>
                  <Image
                    src={editingProperty.image}
                    alt="Preview"
                    width={160}
                    height={128}
                    className="object-cover rounded shadow border"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={async () => {
                  try {
                    if (editingProperty._id) {
                      await axios.put(
                        `http://localhost:5000/api/property/properties/${editingProperty._id}`,
                        editingProperty
                      );
                      setProperties((prev) =>
                        prev.map((p) =>
                          p._id === editingProperty._id ? editingProperty : p
                        )
                      );
                    } else {
                      const res = await axios.post(
                        "http://localhost:5000/api/property/properties",
                        editingProperty
                      );
                      setProperties((prev) => [...prev, res.data]);
                    }
                    setEditingProperty(null);
                  } catch {
                    alert("Save failed");
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProperty(null)}
                className="border border-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="bg-[#f9f4de] text-[#d6a243] border border-red-200 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <Image
                src={p.image}
                alt={p.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-bold text-red-700 mb-1">{p.title}</h3>
              <p className="text-sm text-gray-700">{p.location}</p>
              <p className="text-sm text-gray-700">
                {p.type} • {p.bedrooms} BHK • {p.area} sq.ft
              </p>
              <p className="text-sm font-semibold text-green-700">
                ₹{p.discountedPrice.toLocaleString()}{" "}
                <span className="line-through text-red-400 text-xs">
                  ₹{p.originalPrice.toLocaleString()}
                </span>
              </p>
              <p
                className={`mt-1 inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                  p.availability === "Available"
                    ? "bg-green-100 text-green-700"
                    : p.availability === "Sold"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {p.availability}
              </p>
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id!)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
