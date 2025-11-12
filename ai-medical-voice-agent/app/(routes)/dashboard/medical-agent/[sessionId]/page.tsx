"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { DoctorAgent } from "../../_components/DoctorAgentCard";
import { Circle } from "lucide-react";
import { eq } from "drizzle-orm";

type sessionDetail = {
  id: number;
  note: string;
  session_id: string;
  report: JSON;
  selected_doctors: DoctorAgent;
  created_on: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<sessionDetail>();

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);
  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
      </div>
      <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      {sessionDetail && sessionDetail?.selected_doctors?.image && (
        <div>
          <Image
            src={sessionDetail.selected_doctors.image}
            alt={sessionDetail?.selected_doctors?.specialist ?? ""}
            width={80}
            height={80}
          />
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
