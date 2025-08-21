"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import Navbar from "../components/navabar/page";
import { useForm } from "react-hook-form";
import Footer from "../components/footer/page";
import api from "@/utils/api";

type Properties = {
  _id: string;
  title: string;
  location: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  area: string;
};

type QueryForm = {
  email: string;
  query: string;
};

export default function ServicesPage() {
  const [properties, setProperties] = useState<Properties[]>([]);
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [loanTenure, setLoanTenure] = useState<number | null>(null);
  const [emi, setEmi] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QueryForm>();

  const onSubmit = async (data: QueryForm) => {
    try {
      const payload = {
        email: data.email,
        projectDesc: data.query,
      };

      const response = await api.post("/send-email", payload);
      if (response.status === 200) {
        reset();
        setError(null);
      } else {
        setError("Failed to send message: " + (response.data.error || "Unknown error"));
      }
    } catch (err: unknown) {
      console.error("Error occurred while sending:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        const discounted: Properties[] = res.data
          .filter((prop: Properties) => prop.discountedPrice < prop.originalPrice)
          .slice(0, 3)
          .map((prop: Properties) => ({
            _id: prop._id,
            title: prop.title,
            location: prop.location,
            image: prop.image,
            originalPrice: prop.originalPrice,
            discountedPrice: prop.discountedPrice,
            area: `${prop.area} sq.ft.`,
          }));

        setProperties(discounted);
      } catch (error: unknown) {
        console.error("Failed to fetch properties:", error);
        setError("Failed to fetch properties. Please try again later.");
      }
    };

    fetchProperties();
  }, []);

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !loanTenure) {
      setEmi(null);
      return;
    }

    const principal = loanAmount;
    const annualInterestRate = interestRate / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    const totalMonths = loanTenure * 12;

    const emiCalc =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalMonths)) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

    setEmi(Number.isFinite(emiCalc) ? Math.round(emiCalc) : null);
  };

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        <Navbar />
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#d6a243] mb-6">
            Our Services
          </h1>
          <p className="text-gray-800 mb-8 text-base md:text-lg">
            Explore our range of real estate services, including discounted property listings and expert consultation.
          </p>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <div
                  key={prop._id}
                  className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-white overflow-hidden"
                >
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    width={400}
                    height={250}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {prop.title}
                    </h2>
                    <p className="text-sm text-gray-700 mb-1">
                      {prop.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Area: {prop.area}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-sm">
                        ₹{(prop.originalPrice / 100000).toFixed(2)}L
                      </span>
                      <span className="text-[#d6a243] font-bold">
                        ₹{(prop.discountedPrice / 100000).toFixed(2)}L
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <Loader className="animate-spin text-[#d6a243]" />
              <span className="ml-3 text-gray-600">Loading properties...</span>
            </div>
          )}

          <div className="mt-16 bg-white rounded-2xl shadow-md p-6 md:p-10">
            {error && (
              <p className="text-red-600 font-medium bg-red-100 border border-red-400 rounded p-3 mb-4">
                {error}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-[#d6a243] mb-4">
              Ask a Property Expert
            </h2>
            <p className="text-gray-700 mb-6 text-base">
              Have questions about buying property or planning investments?
              Reach out to our expert advisors.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Query
                </label>
                <textarea
                  {...register("query", {
                    required: "Please enter your query",
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                  placeholder="Enter your query here..."
                  rows={5}
                />
                {errors.query && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.query.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 px-6 py-2 bg-[#d6a243] text-white font-semibold rounded-xl shadow hover:bg-[#c2913a]"
              >
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-md p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#d6a243] mb-4">
              Home Loan Calculator
            </h2>
            <p className="text-gray-700 mb-6 text-base">
              Use this tool to get an estimated EMI (Equated Monthly
              Installment) based on your loan preferences.
            </p>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount ?? ""}
                  onChange={(e) =>
                    setLoanAmount(Number(e.target.value) || null)
                  }
                  placeholder="e.g., 3000000"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  value={interestRate ?? ""}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value) || null)
                  }
                  step="0.01"
                  placeholder="e.g., 8.5"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Tenure (Years)
                </label>
                <input
                  type="number"
                  value={loanTenure ?? ""}
                  onChange={(e) =>
                    setLoanTenure(Number(e.target.value) || null)
                  }
                  placeholder="e.g., 20"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a243]"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={calculateEMI}
                  className="mt-4 px-6 py-2 bg-[#d6a243] text-white font-semibold rounded-xl shadow hover:bg-[#c2913a]"
                >
                  Calculate EMI
                </button>
              </div>
            </form>

            {emi !== null && (
              <div className="mt-6 bg-[#fef7e7] border border-[#d6a243] text-gray-900 p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-lg">
                  Estimated Monthly EMI:{" "}
                  <span className="text-[#d6a243]">
                    ₹{emi.toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}