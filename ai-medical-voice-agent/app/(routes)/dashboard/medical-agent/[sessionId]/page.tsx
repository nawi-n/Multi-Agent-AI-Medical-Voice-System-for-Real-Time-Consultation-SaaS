"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DoctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff, Slice } from "lucide-react";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type sessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: DoctorAgent;
  createdOn: string;
  chiefComplaint?: string;
  sessionSummary?: string;
  symptoms?: string[];
  duration?: string;
  severity?: string;
  conversation?: any;
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const two = (n: number) => n.toString().padStart(2, "0");
    return hrs > 0
      ? `${two(hrs)}:${two(mins)}:${two(secs)}`
      : `${two(mins)}:${two(secs)}`;
  };

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    if (callStarted) {
      setElapsedSeconds(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callStarted]);
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

  const endCall = async () => {
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
    toast.success("Your report generated.");
    router.replace("/dashboard");
  };

  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      sessionId: sessionId,
      messages: messages,
      sessionDetail: sessionDetail,
    });
    console.log("Report generated:", result.data);
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
        {/*
        <h2 className="font-bold text-xl text-gray-400">
          {formatTime(elapsedSeconds)}
        </h2>
        */}
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

          {/* ---------- Call Visual Indicator (no transcript) ---------- */}
          <div className="mt-12 mb-5 w-full flex flex-col items-center">
            {/* floating status card */}
            <div
              className={`w-full max-w-lg rounded-xl px-6 py-6 shadow-sm bg-white/60 backdrop-blur-sm border ${
                callStarted ? "border-green-100" : "border-gray-100"
              } transition-transform duration-300`}
            >
              {/* Row: small dot + call state text */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-block h-3 w-3 rounded-full ${
                      callStarted ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {callStarted ? "Call in progress" : "Not connected"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {callStarted
                        ? "Your AI assistant is online."
                        : "Press Start Call to connect."}
                    </div>
                  </div>
                </div>

                {/* call progress timer */}
                <div className="text-sm font-medium text-gray-400">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              {/* speaking indicator — moves slightly when assistant speaks */}
              <div
                className={`mt-5 flex items-center justify-center gap-3 transition-transform duration-300 ${
                  currentRole === "assistant"
                    ? "translate-y-3"
                    : "translate-y-0"
                }`}
              >
                {currentRole === "assistant" ? (
                  // assistant speaking: animated bars + label
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1">
                      <div
                        className="h-3 w-1 rounded bg-[#0b62c8] animate-pulse"
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className="h-4 w-1 rounded bg-[#0b62c8] animate-pulse"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <div
                        className="h-2 w-1 rounded bg-[#0b62c8] animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                    <div className="text-sm font-medium text-[#0b62c8]">
                      Assistant speaking...
                    </div>
                  </div>
                ) : (
                  // listening state: small pulsing dot + label
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                    <div className="text-sm text-gray-500">Listening…</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <PhoneCall />}{" "}
              Start Call
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={endCall}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />}{" "}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
