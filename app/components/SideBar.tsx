"use client";

import Link from "next/link";
import { navLinks } from "./data";
import { useState } from "react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={`transform top-0 left-0 w-64 bg-gradient-to-b from-blue-500 to-purple-600 text-white p-5 shadow-lg min-h-screen fixed z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-1/3"
      }`}
    >
      <h1 className="text-2xl font-bold mb-8">SideBar</h1>
      <button
        onClick={toggleSidebar}
        className="p-2 bg-blue-600 text-white rounded-md m-4 hover:bg-blue-500 transition-colors duration-300"
      >
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      {navLinks.map((link) => (
        <div
          className="grid p-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 ease-in-out"
          key={link.title}
        >
          <Link
            href={`/tickets?filter=${link.urlName}`}
            className="font-semibold text-lg"
          >
            {link.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
