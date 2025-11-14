"use client";

import React from "react";
import { UserProfile } from "@clerk/nextjs";

export default function UserPage() {
  // Renders Clerk's profile UI at /user
  return (
    <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
      <div className="w-full max-w-3xl">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
