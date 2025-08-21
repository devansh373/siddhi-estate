"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Home,
  Landmark,
  Hammer,
  FileText,
  Phone,
  Calculator,
  CircleDotDashed,
} from "lucide-react";
import Navbar from "../components/navabar/page";
import axios from "axios";

export default function LoansLegalPage() {
  const [emi, setEmi] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [legalIssue, setLegalIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (!P || !R || !N) return;
    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    setEmi(Math.round(emiValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 

    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/send-email`, {
        fullName,
        email: "not_provided@example.com",
        phone,
        businessName: "N/A",
        businessDesc: "N/A",
        websiteType: "N/A",
        service: "Legal Callback Request",
        existingWebsite: "N/A",
        existingDesc: "N/A",
        projectDesc: legalIssue,
      });

      setFormSubmitted(true);
    } catch (error: unknown) {
      console.error("Email sending error:", error);
      alert("Failed to send request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f1dd] text-gray-900">
      <div className="bg-[#f9f1dd] py-4 px-4 sm:px-6 text-gray-900">
        <Navbar />
        <main className="bg-gradient-to-b from-amber-50 to-amber-100 text-amber-900">
          <section className="text-center py-20 px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
                Loans & Legal Assistance
              </h1>
              <p className="text-xl text-amber-700 max-w-2xl mx-auto">
                Navigate your property journey with expert loan advice and legal
                clarity.
              </p>
            </motion.div>
          </section>
          <section className="py-16 px-6 md:px-20 bg-white shadow-sm">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                  <Banknote className="text-amber-600" size={28} />
                  Loan Options
                </h2>
                <motion.div
                  className="mb-16 p-6 bg-amber-50 rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Home className="text-amber-600" /> Home Loans
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-amber-800 mb-2">
                            Required Documents:
                          </h4>
                          <ul className="list-disc pl-6 space-y-1 text-amber-700">
                            <li>Identity & Address Proof</li>
                            <li>Income Documents (ITR / Salary Slips)</li>
                            <li>Bank Statements (6–12 months)</li>
                            <li>Property Sale Agreement</li>
                            <li>
                              Occupancy Certificate (for ready properties)
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-amber-200">
                          <p className="font-medium text-amber-800">
                            Typical Interest Rates:{" "}
                            <span className="text-amber-900 font-bold">
                              8.25% – 9.5% (annual)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Calculator className="text-amber-600" /> EMI
                          Calculator
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-amber-800 mb-1">
                              Loan Amount (₹)
                            </label>
                            <input
                              type="number"
                              placeholder="10,00,000"
                              className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-amber-800 mb-1">
                                Interest Rate (%)
                              </label>
                              <input
                                type="number"
                                placeholder="8.5"
                                className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                value={interestRate}
                                onChange={(e) =>
                                  setInterestRate(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-amber-800 mb-1">
                                Tenure (years)
                              </label>
                              <input
                                type="number"
                                placeholder="20"
                                className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                              />
                            </div>
                          </div>
                          <button
                            onClick={calculateEMI}
                            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition flex items-center justify-center gap-2"
                          >
                            Calculate EMI
                          </button>
                          {emi && (
                            <div className="mt-4 p-3 bg-amber-100 rounded-lg text-center">
                              <p className="text-sm text-amber-800">
                                Estimated Monthly Payment
                              </p>
                              <p className="text-2xl font-bold text-amber-900">
                                ₹{emi.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="mb-16 p-6 bg-amber-50 rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Landmark className="text-amber-600" /> Mortgage Loans
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-amber-700 mb-4">
                        Use your existing property as collateral to access large
                        loans. Ideal for:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-amber-700">
                        <li>Business expansion</li>
                        <li>Personal obligations</li>
                        <li>Debt consolidation</li>
                        <li>Education expenses</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">
                        Requirements:
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-amber-700 text-sm">
                        <li>Updated property documents</li>
                        <li>Professional property valuation</li>
                        <li>Clear title deed</li>
                        <li>Income proof for repayment capacity</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="p-6 bg-amber-50 rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Home className="text-amber-600" /> Builder-Linked Financing
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-amber-700 mb-4">
                        Special loans for under-construction properties in
                        RERA-approved projects with benefits like:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-amber-700">
                        <li>Interest subsidy under PMAY scheme</li>
                        <li>Flexible payment plans</li>
                        <li>Construction-linked disbursement</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">
                        Key Considerations:
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-amber-700 text-sm">
                        <li>Verify builder RERA registration</li>
                        <li>Check project completion timeline</li>
                        <li>Understand disbursement schedule</li>
                        <li>Legal due diligence is essential</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
          <section className="py-16 px-6 md:px-20 bg-amber-50">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
                  <Hammer className="text-amber-600" size={28} />
                  Legal Guidance
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <FileText className="text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-amber-900">
                      Sale Agreement Guidance
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Draft and review agreements with proper clauses for a
                      legally binding transaction.
                    </p>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Payment terms
                        & schedules
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Penalties for
                        delays
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Handover
                        timelines
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Dispute
                        resolution
                      </li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Landmark className="text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-amber-900">
                      Purchase Registration
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Step-by-step assistance from agreement to stamp duty
                      payment and registration.
                    </p>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Title
                        verification
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Stamp duty
                        calculation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Sub-registrar
                        process
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Document
                        preparation
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Home className="text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-amber-900">
                      Builder Coordination
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Legal support for construction-related issues and
                      disputes.
                    </p>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Delayed
                        possession
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Occupancy
                        certificate
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Flat size
                        disputes
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600">✓</span> Amenities
                        promises
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
          <section className="bg-amber-600 text-white py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Connect with Our Legal Experts
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Got legal questions about loans, registration, or disputes?
                  Our experts will call you back.
                </p>

                {formSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white text-amber-800 p-8 rounded-xl shadow-lg max-w-md mx-auto"
                  >
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold text-lg">
                        Request Received!
                      </h3>
                    </div>
                    <p className="mb-4">
                      Our legal team will contact you within 24 hours.
                    </p>
                    <p className="text-sm">
                      For urgent matters, call our helpline:{" "}
                      <span className="font-bold">1800-123-4567</span>
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white text-amber-900 p-8 rounded-xl shadow-lg max-w-md mx-auto text-left space-y-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 10) {
                            setPhone(value);
                          }
                        }}
                        className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Legal Issue
                      </label>
                      <textarea
                        value={legalIssue}
                        onChange={(e) => setLegalIssue(e.target.value)}
                        className="w-full p-3 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        rows={4}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 mt-4 ${
                        isSubmitting
                          ? "bg-amber-400 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <CircleDotDashed className="animate-spin" size={18} />
                          Request in Process...
                        </>
                      ) : (
                        <>
                          <Phone size={18} />
                          Request Callback
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}