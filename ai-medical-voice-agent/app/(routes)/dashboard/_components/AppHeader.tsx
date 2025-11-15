"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const menuOptions = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "Dashboard", path: "/dashboard" },
  { id: 3, name: "History", path: "/dashboard/history" },
  { id: 4, name: "Billing", path: "/dashboard/billing" },
  { id: 5, name: "Profile", path: "/dashboard/user" },
];

function AppHeader() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-10 lg:px-16">
        {/* Logo (smaller) */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="DocNow logo"
            width={112}
            height={56}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuOptions.map((option) => {
            const isActive = pathname === option.path;
            return (
              <Link key={option.id} href={option.path}>
                <span
                  className={`relative cursor-pointer text-base font-semibold transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {option.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/sign-in">
              <button className="hidden md:inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:shadow-lg">
                Sign In
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-11 h-11 rounded-full border-2 border-white shadow-sm",
                  },
                }}
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
          <nav className="flex flex-col gap-2">
            {menuOptions.map((option) => {
              const isActive = pathname === option.path;
              return (
                <Link
                  key={option.id}
                  href={option.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`block rounded-md px-3 py-2.5 text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default AppHeader;
