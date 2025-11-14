"use client";
import React, { use, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });
  console.log("Paid User:", paidUser);

  const onStartConsultation = async () => {
    setLoading(true);
    //Save all info to database
    const result = await axios.post("/api/session-chat", {
      notes: "New Consultation",
      selectedDoctor: doctorAgent,
    });
    console.log(result.data);
    if (result.data?.sessionId) {
      console.log("Session Created with ID: ", result.data.sessionId);
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1">
      {/* Premium Badge */}
      {doctorAgent.subscriptionRequired && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            ⭐ Premium
          </Badge>
        </div>
      )}

      {/* Doctor Image with Gradient Overlay */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialist}
          width={200}
          height={300}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {doctorAgent.specialist}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {doctorAgent.description}
        </p>

        <Button
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500"
          onClick={onStartConsultation}
          disabled={!paidUser && doctorAgent.subscriptionRequired}
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              Start Consultation
              <IconArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default DoctorAgentCard;
