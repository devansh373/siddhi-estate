"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/navabar/page";
import Footer from "../components/footer/page";
import api from "@/utils/api";

type Property = {
  _id: string; 
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

export default function PropertiesContent() {
  const searchParams = useSearchParams();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredData, setFilteredData] = useState<Property[]>([]);

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    max: searchParams.get("max") || "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        setAllProperties(response.data); 
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const result = allProperties.filter((prop) => {
      return (
        (!filters.city ||
          prop.location.toLowerCase() === filters.city.toLowerCase()) &&
        (!filters.type ||
          prop.type.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.bedrooms || prop.bedrooms === Number(filters.bedrooms)) &&
        (!filters.max || prop.discountedPrice <= Number(filters.max) * 100000)
      );
    });
    setFilteredData(result);
  }, [filters, allProperties]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderCitySection = (city: string) => {
    const cityProperties = allProperties
      .filter((p) => p.location.toLowerCase() === city.toLowerCase())
      .slice(0, 3);

    return (
      <div className="bg-white p-6 rounded-xl shadow mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[#d6a243]">
          Properties in {city}
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {cityProperties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white min-w-[300px] rounded-xl overflow-hidden shadow hover:shadow-lg transition relative"
            >
              <Image
                src={property.image}
                alt={property.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              {property.originalPrice > property.discountedPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  ₹
                  {(
                    (property.originalPrice - property.discountedPrice) /
                    100000
                  ).toFixed(1)}
                  L OFF
                </div>
              )}
              <div
                className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                  property.availability === "Ready to move"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {property.availability}
              </div>
              <div className="p-3">
                <h3 className="text-md font-semibold text-[#d6a243]">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-700">{property.area}</p>
                <p className="text-sm text-gray-700">
                  ₹{property.discountedPrice.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {property.bedrooms} BHK | {property.type}
                </p>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this property: ${property.title}\nLocation: ${
                    property.location
                  }\nPrice: ₹${property.discountedPrice.toLocaleString()}\nView more: https://yourwebsite.com/properties/${
                    property._id
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md"
                title="Share on WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 0 0-8.5 15.15L2 22l4.95-1.49A10 10 0 1 0 12 2zm0 18a8 8 0 1 1 5.29-14.06l.35.34a8 8 0 0 1-5.64 13.72zm1.93-5.13c-.26-.13-1.56-.77-1.8-.86s-.42-.13-.6.13c-.18.26-.69.86-.85 1.03s-.31.2-.57.07a6.61 6.61 0 0 1-1.94-1.2 7.34 7.34 0 0 1-1.36-1.67c-.14-.25-.01-.39.11-.52.12-.12.26-.31.4-.47.13-.15.18-.26.28-.43.09-.18.04-.33-.02-.46s-.6-1.45-.82-2a.5.5 0 0 0-.45-.3h-.36c-.13 0-.34.05-.52.26A8.03 8.03 0 0 0 12 20a8 8 0 0 0 1.93-15.87 8 8 0 0 1-1.94 13.74z" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        <Navbar />

        <div className="w-full h-[70vh] relative mb-20 mt-10 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/properties-banner.png"
            alt="Properties Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#d6a243]/60 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center">
              Explore Our Properties
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-12 bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#d6a243]">
            Smart Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="City"
              className="px-4 py-2 border rounded-lg w-full"
            />
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg w-full"
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg w-full"
            >
              <option value="">Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
            </select>
            <input
              name="max"
              value={filters.max}
              onChange={handleChange}
              type="number"
              placeholder="Max Price (Lacs)"
              className="px-4 py-2 border rounded-lg w-full"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {currentItems.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition relative"
            >
              <Image
                src={property.image}
                alt={property.title}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />

              {property.originalPrice > property.discountedPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  ₹
                  {(
                    (property.originalPrice - property.discountedPrice) /
                    100000
                  ).toFixed(1)}
                  L OFF
                </div>
              )}

              <div
                className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                  property.availability === "Ready to move"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {property.availability}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-[#d6a243]">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-700">{property.location}</p>
                <p className="text-sm text-gray-600">{property.area}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    ₹{property.discountedPrice.toLocaleString()}
                  </span>
                  {property.originalPrice > property.discountedPrice && (
                    <span className="line-through text-red-400 ml-2 text-sm">
                      ₹{property.originalPrice.toLocaleString()}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {property.bedrooms} BHK | {property.type}
                </p>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this property: ${property.title}\nLocation: ${
                    property.location
                  }\nPrice: ₹${property.discountedPrice.toLocaleString()}\nView more: https://yourwebsite.com/properties/${
                    property._id
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md"
                title="Share on WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 0 0-8.5 15.15L2 22l4.95-1.49A10 10 0 1 0 12 2zm0 18a8 8 0 1 1 5.29-14.06l.35.34a8 8 0 0 1-5.64 13.72zm1.93-5.13c-.26-.13-1.56-.77-1.8-.86s-.42-.13-.6.13c-.18.26-.69.86-.85 1.03s-.31.2-.57.07a6.61 6.61 0 0 1-1.94-1.2 7.34 7.34 0 0 1-1.36-1.67c-.14-.25-.01-.39.11-.52.12-.12.26-.31.4-.47.13-.15.18-.26.28-.43.09-.18.04-.33-.02-.46s-.6-1.45-.82-2a.5.5 0 0 0-.45-.3h-.36c-.13 0-.34.05-.52.26A8.03 8.03 0 0 0 12 20a8 8 0 0 0 1.93-15.87 8 8 0 0 1-1.94 13.74z" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#d6a243] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {renderCitySection("Bangalore")}
          {renderCitySection("Delhi")}
          {renderCitySection("Mumbai")}
        </div>
      </div>
      <Footer />
    </div>
  );
}
