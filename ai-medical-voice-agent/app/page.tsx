"use client";

import Link from "next/link";
import { motion } from "motion/react";
import AppHeader from "./(routes)/dashboard/_components/AppHeader";
import { Activity, Brain, Clock, Shield, Sparkles, Zap } from "lucide-react";

export default function HeroSectionOne() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <AppHeader />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <section className="pt-16 pb-12 md:pt-24 md:pb-20 lg:pt-32 lg:pb-24">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Healthcare Platform
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-8 max-w-5xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl"
            >
              Healthcare Consultation
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Powered by AI Voice
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl"
            >
              Experience the future of healthcare with our intelligent voice
              agents. Get instant medical consultations from specialized AI
              doctors, available 24/7 to address your health concerns.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/dashboard">
                <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Consultation
                    <Zap className="h-5 w-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="rounded-xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-md">
                  Learn More
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                24/7 Availability
              </h3>
              <p className="mt-2 text-gray-600">
                Access medical consultations anytime, anywhere. Our AI agents
                are always ready to help.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 p-3">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                10+ Specialists
              </h3>
              <p className="mt-2 text-gray-600">
                From general physicians to specialists, get expert advice
                tailored to your needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 p-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure & Private
              </h3>
              <p className="mt-2 text-gray-600">
                Your health data is encrypted and protected with
                industry-leading security standards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-green-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-100 to-green-200 p-3">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Real-time Responses
              </h3>
              <p className="mt-2 text-gray-600">
                Get instant feedback and medical advice through natural voice
                conversations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-pink-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 p-3">
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Smart Diagnostics
              </h3>
              <p className="mt-2 text-gray-600">
                Advanced AI analyzes your symptoms to provide accurate
                preliminary assessments.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 p-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Instant Reports
              </h3>
              <p className="mt-2 text-gray-600">
                Receive detailed consultation reports and recommendations after
                each session.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
