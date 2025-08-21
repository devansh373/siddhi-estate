"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "../components/navabar/page";
import axios from "axios";
import { FaBuilding, FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

type RedevelopmentProject = {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  timeline: string;
  amenities: string[];
  status: string;
  units: number;
};

type CommercialProject = {
  id: string;
  name: string;
  image: string;
  location: string;
  type: string;
  completion: string;
};

export default function RedevelopmentCommercialPage() {
  const [redevelopmentProjects, setRedevelopmentProjects] = useState<
    RedevelopmentProject[]
  >([]);
  const [commercialProjects, setCommercialProjects] = useState<
    CommercialProject[]
  >([]);
  const [activeTab, setActiveTab] = useState<"redevelopment" | "commercial">(
    "redevelopment"
  );
  const [redevelopmentPage, setRedevelopmentPage] = useState(1);
  const [commercialPage, setCommercialPage] = useState(1);
  const ITEMS_PER_PAGE = 2;
  const ITEMS_PER_PAGE2 = 3;
  useEffect(() => {
    setRedevelopmentPage(1);
    setCommercialPage(1);
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [redevelopmentRes, commercialRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/redevelopment`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commercial`),
        ]);

        setRedevelopmentProjects(
          redevelopmentRes.data.map((item: RedevelopmentProject) => ({
            id: item.id,
            name: item.name,
            beforeImage: item.beforeImage,
            afterImage: item.afterImage,
            timeline: item.timeline,
            amenities: item.amenities,
            status: item.status,
            units: item.units,
          }))
        );

        setCommercialProjects(
          commercialRes.data.map((item: CommercialProject) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            location: item.location,
            type: item.type,
            completion: item.completion,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch project data", error);
      }
    };

    fetchData();
  }, []);
  const paginatedRedevelopment = redevelopmentProjects.slice(
    (redevelopmentPage - 1) * ITEMS_PER_PAGE,
    redevelopmentPage * ITEMS_PER_PAGE
  );

  const paginatedCommercial = commercialProjects.slice(
    (commercialPage - 1) * ITEMS_PER_PAGE2,
    commercialPage * ITEMS_PER_PAGE2
  );

  const totalRedevelopmentPages = Math.ceil(
    redevelopmentProjects.length / ITEMS_PER_PAGE
  );
  const totalCommercialPages = Math.ceil(
    commercialProjects.length / ITEMS_PER_PAGE2
  );

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6">
        <Navbar />

        <div className="relative h-96 w-full mb-20 bg-[#d6a243] flex items-center justify-center border-b border-[#d6a243]/20 mt-8">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Transforming Spaces, Building Futures
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Premium redevelopment solutions and commercial properties across
              Mumbai
            </p>
            <div className="mt-8 bg-[#f9f1dd]  text-[#d6a243]  px-8 py-3 rounded-lg font-medium transition-colors">
              <Link href={"/properties"}>Explore Projects</Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab("redevelopment")}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === "redevelopment"
                  ? "text-[#d6a243] border-b-2 border-[#d6a243]"
                  : "text-gray-600"
              }`}
            >
              Redevelopment Projects
            </button>
            <button
              onClick={() => setActiveTab("commercial")}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === "commercial"
                  ? "text-[#d6a243] border-b-2 border-[#d6a243]"
                  : "text-gray-600"
              }`}
            >
              Commercial Projects
            </button>
          </div>
        </div>

        {activeTab === "redevelopment" && (
          <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Redevelopment Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {paginatedRedevelopment.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="relative h-64">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 relative">
                        <Image
                          src={proj.beforeImage}
                          alt="Before"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-[#d6a243] text-white p-2 text-center font-medium">
                          Before
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <Image
                          src={proj.afterImage}
                          alt="After"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-[#d6a243] text-white p-2 text-center font-medium">
                          After
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {proj.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          proj.status === "Ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-[#faeebf] text-[#d6a243]"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaRegCalendarAlt className="mr-2 text-[#d6a243]" />
                      <span>Timeline: {proj.timeline}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FaBuilding className="mr-2 text-[#d6a243]" />
                      <span>{proj.units} Units</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Key Amenities:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {proj.amenities.map((am, idx) => (
                          <span
                            key={idx}
                            className="bg-[#faeebf] text-[#d6a243] px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-[#d6a243] text-white py-2 rounded-lg font-medium hover:bg-[#c19137] transition-colors">
                      Request More Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() =>
                  setRedevelopmentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={redevelopmentPage === 1}
                className="px-4 py-2 bg-[#f9f1dd] border border-[#d6a243] text-[#d6a243] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#d6a243] font-medium">
                Page {redevelopmentPage} of {totalRedevelopmentPages}
              </span>
              <button
                onClick={() =>
                  setRedevelopmentPage((prev) =>
                    prev < totalRedevelopmentPages ? prev + 1 : prev
                  )
                }
                disabled={redevelopmentPage === totalRedevelopmentPages}
                className="px-4 py-2 bg-[#d6a243] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {activeTab === "commercial" && (
          <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Premium Commercial Properties
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCommercial.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="relative h-56">
                    <Image
                      src={proj.image}
                      alt={proj.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#d6a243]/90 to-transparent p-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          proj.completion === "Ready to Move"
                            ? "bg-green-100 text-green-800"
                            : "bg-[#faeebf] text-[#d6a243]"
                        }`}
                      >
                        {proj.completion}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {proj.name}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-2 text-sm text-[#d6a243]" />
                      <span>{proj.location}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>Type: {proj.type}</span>
                    </div>

                    <button className="w-full mt-4 border border-[#d6a243] text-[#d6a243] py-2 rounded-lg font-medium hover:bg-[#d6a243] hover:text-white transition-colors">
                      Enquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() =>
                  setCommercialPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={commercialPage === 1}
                className="px-4 py-2 bg-[#f9f1dd] border border-[#d6a243] text-[#d6a243] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#d6a243] font-medium">
                Page {commercialPage} of {totalCommercialPages}
              </span>
              <button
                onClick={() =>
                  setCommercialPage((prev) =>
                    prev < totalCommercialPages ? prev + 1 : prev
                  )
                }
                disabled={commercialPage === totalCommercialPages}
                className="px-4 py-2 bg-[#d6a243] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        )}

        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Our Builder Partnerships
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We collaborate with Mumbai&apos;s most trusted builders to deliver
                exceptional quality and value
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[
                "builder1.png",
                "builder2.png",
                "builder3.png",
                "builder4.png",
              ].map((logo, index) => (
                <div key={index} className="p-4 flex justify-center">
                  <Image
                    src={`/builder${index + 1}.png`}
                    alt={`Builder ${index + 1}`}
                    width={160}
                    height={80}
                    className="object-contain h-16 opacity-80 hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="md:flex items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                  Legal Coordination Services
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our expert legal team ensures all documentation and approvals
                  are handled seamlessly, protecting your interests throughout
                  the process.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#d6a243] mr-2">✓</span>
                    <span>Title verification & due diligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6a243] mr-2">✓</span>
                    <span>Redevelopment agreement drafting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6a243] mr-2">✓</span>
                    <span>Municipal approval assistance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6a243] mr-2">✓</span>
                    <span>Dispute resolution support</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="https://blog.ipleaders.in/wp-content/uploads/2020/11/LEGAL_gavel-scale-book_10-5-2018-1.jpg"
                  alt="Legal Services"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md w-full border border-[#d6a243]/20"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-[#d6a243] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8">
              Whether it&apos;s society redevelopment or commercial space
              acquisition, our experts are here to guide you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/#contact">
              <button className="bg-white text-[#d6a243] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Get Free Consultation
              </button></Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}