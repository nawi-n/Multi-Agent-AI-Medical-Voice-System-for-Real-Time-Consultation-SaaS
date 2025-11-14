"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  // Vapi assistant id (snake case from list) or camelCase fallback
  assistant_id?: string;
  assistantId?: string; // allow either naming convention
  subscriptionRequired: boolean;
};

type Props = {
  doctorAgent: DoctorAgent;
};

function DoctorAgentCard({ doctorAgent }: Props) {
  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });
  console.log("Paid User:", paidUser);

  return (
    <div className="relative">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute m-2 right-0">Premium</Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-xl"
      />
      <h2 className="font-bold mt-1">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500 ">
        {doctorAgent.description}
      </p>
      <Button
        className="w-full mt-2"
        disabled={!paidUser && doctorAgent.subscriptionRequired}
      >
        Start Consultaation
        <IconArrowRight />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
