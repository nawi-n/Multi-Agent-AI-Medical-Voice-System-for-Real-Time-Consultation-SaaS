import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";
import { Stethoscope } from "lucide-react";

function DoctorsAgentList() {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5">
          <Stethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Available Medical Specialists
          </h2>
          <p className="text-sm text-gray-600">
            Choose from our team of AI-powered healthcare professionals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {AIDoctorAgents.map((doctor) => (
          <DoctorAgentCard key={doctor.id} doctorAgent={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
