"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/navabar/page";
import Footer from "../components/footer/page";

type Property = {
  _id: string;
  title: string;
  type: "flat" | "office" | "industrial" | "plot";
  location: string;
  originalPrice: number;
  area: number;
  bedrooms: number;
  image: string;
  availability: "ready" | "under-construction";
};

export default function SaleRentalsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<Property["type"]>("flat");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesType = property.type === activeTab;
    const matchesPrice =
      property.originalPrice >= priceRange[0] &&
      property.originalPrice <= priceRange[1];
    const matchesLocation = property.location
      .toLowerCase()
      .includes(locationFilter.toLowerCase());

    return matchesType && matchesPrice && matchesLocation;
  });

  const locations = Array.from(new Set(properties.map((p) => p.location)));

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        <Navbar />

        <div className="relative h-96 w-full mt-8">
          <Image
            src="/our-approach.png"
            alt="Hero Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#d6a243]/80 flex items-center justify-center text-center px-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Discover the Perfect Property
              </h1>
              <p className="text-lg md:text-xl text-white">
                Flats, offices, plots & more — curated for your needs
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "flat", label: "Flats" },
                    { value: "office", label: "Offices" },
                    { value: "industrial", label: "Industrial" },
                    { value: "plot", label: "Plots" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value as Property["type"])}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                        activeTab === tab.value
                          ? "bg-[#d6a243] text-white"
                          : "bg-[#faeebf] text-[#d6a243] hover:bg-[#f5e6b6]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  Price Range (in Cr.)
                </h2>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseFloat(e.target.value)])
                  }
                  className="w-full accent-[#d6a243]"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0 Cr</span>
                  <span>{priceRange[1]} Cr</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  Location
                </h2>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-full"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white text-[#d6a243] text-xs px-2 py-1 rounded font-medium shadow-sm">
                    {prop.availability === "ready"
                      ? "Ready to Move"
                      : "Under Construction"}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#d6a243] mb-1">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                    <Image
                      src="/location.png"
                      alt="Loc"
                      width={14}
                      height={14}
                      className="inline-block"
                    />
                    {prop.location}
                  </p>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>₹{prop.originalPrice} Cr</span>
                    <span>{prop.area}</span>
                  </div>
                  {prop.bedrooms > 0 && (
                    <p className="text-sm text-gray-600 mb-3">
                      {prop.bedrooms} BHK Flat
                    </p>
                  )}
                  <div className="mt-auto">
                    <Link
                      href={`/schedule-visit?property=${prop._id}`}
                      className="block w-full text-center bg-[#d6a243] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#bb8d2f] transition"
                    >
                      Schedule Visit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600">Try changing your filters above.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
