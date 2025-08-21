"use client"
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div >
      {/* Footer Section */}
      <footer className="bg-[#d6a243] py-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-center space-x-8">
          <Link href="/about" className="text-white font-medium hover:text-gray-200 transition-colors">
            About
          </Link>
          <Link href="/about" className="text-white font-medium hover:text-gray-200 transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-white font-medium hover:text-gray-200 transition-colors">
            Properties
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Footer
