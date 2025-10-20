import React from "react";
import { DoctorAgent } from "./DoctorAgentCard";
import Image from "next/image";

type Props = {
  doctorAgent: DoctorAgent;
  setSelectedDoctor: any;
};

function SuggestedDoctorCard({ doctorAgent, setSelectedDoctor }: Props) {
  return (
    <div
      className="flex flex-col items-center border rounded-2xl shadow p-4 hover:border-blue-500 transition cursor-pointer"
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={70}
        height={70}
        className="w-[50px] h-[50px] rounded-4xl object-cover"
      />
      <h2 className="font-bold text-sm text-center">
        {doctorAgent.specialist}
      </h2>
      <p className="text-xs text-center line-clamp-2">
        {doctorAgent.description}
      </p>
    </div>
  );
}

export default SuggestedDoctorCard;
