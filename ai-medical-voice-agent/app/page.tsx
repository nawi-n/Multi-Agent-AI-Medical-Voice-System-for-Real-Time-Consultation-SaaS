"use client";

import Link from "next/link";
import { motion } from "motion/react";
import AppHeader from "./(routes)/dashboard/_components/AppHeader";

export default function HeroSectionOne() {
  return (
    <div className="w-full bg-white">
      <AppHeader />

      {/* Use same horizontal padding as dashboard so edges align */}
      <div className="mx-auto max-w-7xl px-10 md:px-20 lg:px-40">
        {/* --- HERO --- */}
        <section className="py-12 md:py-20 lg:py-28">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight text-slate-800 md:text-5xl lg:text-6xl">
              {"🩺 Revolutionize Patient Care with AI-Powered Voice Agents"}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="mx-auto mt-6 max-w-xl text-center text-lg text-neutral-600"
            >
              Empower your healthcare services with cutting-edge AI voice
              technology, enhancing patient interactions and streamlining
              consultations.
            </motion.p>

            <div className="mt-8 flex justify-center">
              <Link href="/dashboard">
                <button className="w-48 rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-gray-800">
                  Explore Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
