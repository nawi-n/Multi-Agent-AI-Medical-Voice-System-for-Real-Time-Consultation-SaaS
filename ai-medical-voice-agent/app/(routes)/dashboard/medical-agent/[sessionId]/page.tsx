"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { DoctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff, Slice } from "lucide-react";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type sessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: DoctorAgent;
  createdOn: string;
};

type message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);
  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };

  const StartCall = () => {
    // Clean up any existing instance first
    if (vapiInstance) {
      try {
        vapiInstance.stop();
        vapiInstance.removeAllListeners();
      } catch (error) {
        console.log("Error cleaning up previous instance:", error);
      }
    }

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);

    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });

    vapi.on("error", (error) => {
      console.error("Vapi Error:", error);
      setCallStarted(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prevMessages: any) => [
            ...prevMessages,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });

    // Resolve dynamic assistant id based on selected specialist
    const dynamicAssistantId =
      sessionDetail?.selectedDoctor?.assistant_id ||
      sessionDetail?.selectedDoctor?.assistantId ||
      process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID ||
      process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ||
      "";

    if (!dynamicAssistantId) {
      console.warn(
        "No assistant id found: add assistant_id to doctor list or NEXT_PUBLIC_VAPI_ASSISTANT_ID env."
      );
      alert(
        "Missing assistant id for this specialist. Please configure assistant_id in the list or set NEXT_PUBLIC_VAPI_ASSISTANT_ID."
      );
      return;
    }

    console.log("Starting Vapi call with assistant id:", dynamicAssistantId);
    vapi.start(dynamicAssistantId);
  };

  const endCall = () => {
    if (!vapiInstance) return;

    try {
      vapiInstance.stop();
      vapiInstance.removeAllListeners();
      setCallStarted(false);
      setVapiInstance(null);
      setLiveTranscript("");
      setCurrentRole(null);
    } catch (error) {
      console.error("Error ending call:", error);
      setCallStarted(false);
      setVapiInstance(null);
    }
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={
              "h-4 w-4 rounded-full" +
              (callStarted ? " bg-green-500" : " bg-red-500")
            }
          />{" "}
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail?.selectedDoctor?.image || "/doctor1.png"}
            alt={sessionDetail?.selectedDoctor?.specialist ?? "Doctor"}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:28 lg:px-28 xl:px-72 ">
            {messages?.slice(-4).map((msg: message, index) => (
              <h2 className="text-gray-400 p-2" key={index}>
                {msg.role}: {msg.text} Msg
              </h2>
            ))}
            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole} {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall}>
              <PhoneCall /> Start Call
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={endCall}>
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
