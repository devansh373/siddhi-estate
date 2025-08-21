"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";

interface RedevelopmentProject {
  _id?: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  timeline: string;
  amenities: string[];
  status: string;
  units: number;
}

interface CommercialProject {
  _id?: string;
  name: string;
  image: string;
  location: string;
  type: string;
  completion: string;
}

export default function Redevelopment() {
  const [redevelopmentProjects, setRedevelopmentProjects] = useState<RedevelopmentProject[]>([]);
  const [commercialProjects, setCommercialProjects] = useState<CommercialProject[]>([]);
  const [activeTab, setActiveTab] = useState<"redevelopment" | "commercial">("redevelopment");
  const [editingProject, setEditingProject] = useState<RedevelopmentProject | CommercialProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const emptyRedevelopment: RedevelopmentProject = {
    name: "",
    beforeImage: "",
    afterImage: "",
    timeline: "",
    amenities: [],
    status: "Ongoing",
    units: 0
  };

  const emptyCommercial: CommercialProject = {
    name: "",
    image: "",
    location: "",
    type: "",
    completion: "Ready to Move"
  };

  const fetchData = async () => {
    try {
      const [redevelopmentRes, commercialRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/redevelopment`),
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commercial`),
      ]);

      setRedevelopmentProjects(redevelopmentRes.data);
      setCommercialProjects(commercialRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type: "redevelopment" | "commercial", id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this project?")) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property/${type}/${id}`);
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleEdit = (project: RedevelopmentProject | CommercialProject) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingProject(activeTab === "redevelopment" ? emptyRedevelopment : emptyCommercial);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        if (editingProject) {
          setEditingProject({
            ...editingProject,
            [field]: base64
          });
        }
      } catch (err) {
        console.error("Error converting image:", err);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [name]: name === "amenities" ? value.split(",") : value
      });
    }
  };

  const handleSubmit = async () => {
    if (!editingProject) return;

    try {
      if (isEditing && editingProject._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/property/${activeTab}/${editingProject._id}`,
          editingProject
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/property/${activeTab}`,
          editingProject
        );
      }
      fetchData();
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  return (
    <div className="p-6  rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("redevelopment")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "redevelopment"
                ? "bg-[#d6a243] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Redevelopment Projects
          </button>
          <button
            onClick={() => setActiveTab("commercial")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "commercial"
                ? "bg-[#d6a243] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Commercial Projects
          </button>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
        >
          Add New Project
        </button>
      </div>

      {editingProject && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-[#d6a243]">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                name="name"
                value={editingProject.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {activeTab === "redevelopment" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={(editingProject as RedevelopmentProject).status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Timeline</label>
                  <input
                    type="text"
                    name="timeline"
                    value={(editingProject as RedevelopmentProject).timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Units</label>
                  <input
                    type="number"
                    name="units"
                    value={(editingProject as RedevelopmentProject).units}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    value={(editingProject as RedevelopmentProject).amenities.join(",")}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Before Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "beforeImage")}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {(editingProject as RedevelopmentProject).beforeImage && (
                    <div className="mt-2">
                      <Image
                        src={(editingProject as RedevelopmentProject).beforeImage}
                        alt="Before Preview"
                        width={150}
                        height={100}
                        className="object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">After Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "afterImage")}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {(editingProject as RedevelopmentProject).afterImage && (
                    <div className="mt-2">
                      <Image
                        src={(editingProject as RedevelopmentProject).afterImage}
                        alt="After Preview"
                        width={150}
                        height={100}
                        className="object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={(editingProject as CommercialProject).location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={(editingProject as CommercialProject).type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Completion Status</label>
                  <select
                    name="completion"
                    value={(editingProject as CommercialProject).completion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Pre-Launch">Pre-Launch</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {(editingProject as CommercialProject).image && (
                    <div className="mt-2">
                      <Image
                        src={(editingProject as CommercialProject).image}
                        alt="Project Preview"
                        width={300}
                        height={150}
                        className="object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#d6a243] text-white rounded-lg hover:bg-[#c19137]"
            >
              {isEditing ? "Update Project" : "Add Project"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "redevelopment" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {redevelopmentProjects.map((proj) => (
            <div key={proj._id} className="bg-[#f9f4de] text-[#d6a243]  border border-red-200 rounded-xl p-4 shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{proj.name}</h3>
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Before</p>
                  <Image
                    src={proj.beforeImage}
                    alt="Before"
                    width={200}
                    height={120}
                    className="object-cover rounded border w-full h-24"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">After</p>
                  <Image
                    src={proj.afterImage}
                    alt="After"
                    width={200}
                    height={120}
                    className="object-cover rounded border w-full h-24"
                  />
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Timeline:</span> {proj.timeline}</p>
                <p><span className="font-medium">Units:</span> {proj.units}</p>
                <p><span className="font-medium">Status:</span> {proj.status}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {proj.amenities.map((am, i) => (
                  <span
                    key={i}
                    className="bg-[#faeebf] text-[#d6a243] px-2 py-1 rounded-full text-xs"
                  >
                    {am}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("redevelopment", proj._id!)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commercialProjects.map((proj) => (
            <div key={proj._id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{proj.name}</h3>
              <div className="mb-3">
                <Image
                  src={proj.image}
                  alt={proj.name}
                  width={300}
                  height={180}
                  className="object-cover rounded border w-full h-40"
                />
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Location:</span> {proj.location}</p>
                <p><span className="font-medium">Type:</span> {proj.type}</p>
                <p><span className="font-medium">Status:</span> {proj.completion}</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete("commercial", proj._id!)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}