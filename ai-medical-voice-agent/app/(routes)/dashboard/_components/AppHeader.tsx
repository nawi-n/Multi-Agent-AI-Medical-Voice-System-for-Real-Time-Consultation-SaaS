"use client";

import React from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 3,
    name: "History",
    path: "/dashboard/history",
  },
  {
    id: 4,
    name: "Billing",
    path: "/dashboard/billing",
  },
  {
    id: 5,
    name: "Profile",
    path: "/dashboard/user",
  },
];

function AppHeader() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40">
      <Image src="/logo.png" alt="logo" width={110} height={70} />

      <div className="hidden md:flex gap-12 items-center">
        {menuOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <h2 className="hover:font-bold cursor-pointer">{option.name}</h2>
          </Link>
        ))}
      </div>

      <div className="flex items-center">
        {!user ? (
          <Link href="/sign-in">
            <button className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors">
              Login
            </button>
          </Link>
        ) : (
          <UserButton />
        )}
      </div>
    </div>
  );
}

export default AppHeader;
