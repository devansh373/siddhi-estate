"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserTie,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import Navbar from "../components/navabar/page";
import { useForm } from "react-hook-form";
import api from "@/utils/api";

interface Broker {
  _id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  verified: boolean;
}

interface Requirement {
  _id: string;
  title: string;
  details: string;
  location: string;
  type: "residential" | "commercial";
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  location: string;
}

export default function BrokerPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [connectMessage, setConnectMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const brokersPerPage = 3;

  const totalPages = Math.ceil(brokers.length / brokersPerPage);

  const paginatedBrokers = brokers.slice(
    (currentPage - 1) * brokersPerPage,
    currentPage * brokersPerPage
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await api.get("/brokers");
        const allBrokers = response.data as Broker[];
        const verifiedOnly = allBrokers.filter((b) => b.verified);
        setBrokers(verifiedOnly.reverse());
      } catch (error) {
        console.error("Failed to fetch brokers:", error);
      }
    };

    const fetchRequirements = async () => {
      try {
        const res = await api.get("/property-requirements");
        const data = res.data as Requirement[];
        setRequirements(data.slice(-3).reverse()); 
      } catch (err) {
        console.error("Failed to fetch property requirements:", err);
      }
    };

    fetchBrokers();
    fetchRequirements();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/brokers", data);
      setConnectMessage("Registration successful!");
      setBrokers((prev) => [...prev, response.data]);
      reset();
    } catch (err) {
      console.error(err);
      setConnectMessage("Registration failed. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        <Navbar />
        <div className="max-w-6xl mx-auto py-16 px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
            Verified Brokers – Virar to Churchgate
          </h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {paginatedBrokers.map((broker) => (
              <div
                key={broker._id}
                className="bg-white rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <div className="flex items-center mb-3">
                  <FaUserTie className="text-[#d6a243] text-xl mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {broker.name}
                  </h2>
                </div>
                <div className="space-y-1 text-gray-700">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    {broker.location}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2 text-gray-500" />
                    {broker.phone}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    {broker.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#d6a243] text-white"
                    : "bg-yellow-100 text-[#d6a243] hover:bg-yellow-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Property Requirements
          </h2>
          <div className="space-y-4 mb-16">
            {requirements.map((req) => {
              const Icon = req.type === "residential" ? FaHome : FaBuilding;
              return (
                <div
                  key={req._id}
                  className="bg-white p-5 rounded-lg shadow border-l-4 border-[#d6a243] hover:shadow-md transition"
                >
                  <div className="flex items-start mb-2">
                    <Icon className="text-[#d6a243] mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {req.title}
                      </h3>
                      <p className="text-gray-700 mb-1">{req.details}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {req.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Register as a Broker
          </h2>
          <section className="py-2 px-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {connectMessage && (
                      <p className="text-green-600 font-medium text-center">
                        {connectMessage}
                      </p>
                    )}

                    {[
                      {
                        label: "Name",
                        field: "name",
                        type: "text",
                        icon: FaUserTie,
                      },
                      {
                        label: "Phone",
                        field: "phone",
                        type: "tel",
                        icon: FaPhone,
                      },
                      {
                        label: "Email",
                        field: "email",
                        type: "email",
                        icon: FaEnvelope,
                      },
                      {
                        label: "Location",
                        field: "location",
                        type: "text",
                        icon: FaMapMarkerAlt,
                      },
                    ].map(({ label, field, type, icon: Icon }) => (
                      <div key={field}>
                        <label className="block font-medium text-gray-800 mb-1">
                          {label}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="text-gray-400" />
                          </div>
                          <input
                            type={type}
                            {...register(field as keyof FormData, {
                              required: `${label} is required`,
                              ...(field === "phone" && {
                                pattern: {
                                  value: /^[0-9\-+() ]{7,15}$/,
                                  message: "Invalid phone number",
                                },
                              }),
                            })}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                          />
                        </div>
                        {errors[field as keyof FormData] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[field as keyof FormData]?.message as string}
                          </p>
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#d6a243] text-white font-semibold py-3 rounded hover:bg-[#b48735] transition"
                    >
                      {isSubmitting ? "Submitting..." : "Register Broker"}
                    </button>
                  </form>
                </div>

                <div className="md:w-1/2">
                  <Image
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80"
                    alt="Broker Registration"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-md w-full border border-[#d6a243]/20 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};