"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "../components/navabar/page";
import Footer from "../components/footer/page";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const team: TeamMember[] = [
  { id: 1, name: "Eleanor Pena", role: "Founder", image: "https://res.cloudinary.com/dgvwhfdp0/image/upload/v1752122225/Home/team/zh9izzilkytvdhkfncxl.jpg" },
  {
    id: 2,
    name: "Vina Rao",
    role: "Co-Founder",
    image: "https://res.cloudinary.com/dgvwhfdp0/image/upload/v1752122225/Home/team/zh9izzilkytvdhkfncxl.jpg",
  },
  {
    id: 3,
    name: "Ganesh Kumar",
    role: "Sales Manager",
    image: "https://res.cloudinary.com/dgvwhfdp0/image/upload/v1752121911/Home/team/pjyga2pmlc24dxqbqk53.jpg",
  },
  {
    id: 4,
    name: "Jainendra Singh",
    role: "Sales Consultant",
    image: "https://res.cloudinary.com/dgvwhfdp0/image/upload/v1752121911/Home/team/pjyga2pmlc24dxqbqk53.jpg",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, ease: "easeOut", duration: 0.5 },
  }),
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        {/* Banner */}
        <Navbar></Navbar>
        <div className="w-full h-[70vh] relative mb-20 mt-10 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/about-banner.png"
            alt="Banner image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#d6a230]/60 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Our Story
            </h1>
          </div>
        </div>

        {/* Company Description */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
          <p className="text-lg text-gray-800">
            At <strong>Siddhi Estates</strong>, we believe in crafting homes
            that tell stories— from dreamers to dwellers. With years of
            experience in the real estate market, our mission is to guide your
            journey with integrity, passion, and excellence.
          </p>
          <p className="text-lg text-gray-800">
            From bustling urban apartments to luxurious villas, our portfolio
            caters to every lifestyle. We pride ourselves on personalized
            service, industry expertise, and a commitment to long-term
            relationships.
          </p>
        </div>

        {/* Team Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx}
              className="group relative overflow-hidden rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={300}
                height={300}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-700">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Our Approach
            </h2>
            <p className="text-lg text-gray-800 mb-4">
              We build relationships based on trust, transparency, and tailored
              solutions.
            </p>
            <p className="text-lg text-gray-800 mb-6">
              Each client is unique. We listen first—and then we act. Our team
              works tirelessly to find the best opportunities and ensure smooth
              transactions.
            </p>
          </div>
          <div className="relative w-full max-w-md sm:max-w-full h-auto rounded-lg shadow-lg overflow-hidden">

            <Image
              src="/our-approach.png"
              alt="Siddhi Estates building"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-[#d6a243]/60 flex items-center justify-center p-4">
              <div className="text-white text-center">
                <h3 className="text-2xl font-extrabold drop-shadow-lg">
                  Siddhi Estates
                </h3>
                <p className="text-lg mt-2 max-w-xs mx-auto drop-shadow-md">
                  Transforming spaces into meaningful homes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6a243] text-white py-16 text-center rounded-lg shadow-md">
          <h3 className="text-3xl font-extrabold mb-10">Our Achievements</h3>
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            <div className="bg-white text-[#d6a243] w-64 py-6 px-4 rounded-xl shadow-md">
              <h4 className="text-4xl font-extrabold">50+</h4>
              <p className="mt-2 text-lg font-medium">Projects Completed</p>
            </div>
            <div className="bg-white text-[#d6a243] w-64 py-6 px-4 rounded-xl shadow-md">
              <h4 className="text-4xl font-extrabold">2000+</h4>
              <p className="mt-2 text-lg font-medium">Trusted Customers</p>
            </div>
            <div className="bg-white text-[#d6a243] w-64 py-6 px-4 rounded-xl shadow-md">
              <h4 className="text-4xl font-extrabold">15+</h4>
              <p className="mt-2 text-lg font-medium">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}