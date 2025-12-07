"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DoctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
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
  conversation?: unknown;
};

type message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<typeof Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>();
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

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setMessages((prevMessages: message[]) => [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Call Status Header */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full ${
                callStarted
                  ? "bg-gradient-to-br from-green-100 to-emerald-100"
                  : "bg-gradient-to-br from-gray-100 to-gray-200"
              }`}
            >
              <Circle
                className={`h-5 w-5 ${
                  callStarted
                    ? "fill-green-500 text-green-500"
                    : "fill-gray-400 text-gray-400"
                }`}
              />
              {callStarted && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {callStarted ? "Connected" : "Not Connected"}
              </p>
              <p className="text-xs text-gray-500">
                {callStarted ? "Call in progress" : "Ready to connect"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-mono text-lg font-bold text-gray-900">
              {formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>

        {sessionDetail && (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg md:p-12">
            {/* Doctor Profile */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl opacity-30"></div>
                <Image
                  src={sessionDetail?.selectedDoctor?.image || "/doctor1.png"}
                  alt={sessionDetail?.selectedDoctor?.specialist ?? "Doctor"}
                  width={140}
                  height={140}
                  className="relative h-[140px] w-[140px] rounded-full border-4 border-white object-cover shadow-xl"
                />
                <div
                  className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white ${
                    callStarted ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                {sessionDetail?.selectedDoctor?.specialist}
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-600">
                AI Medical Voice Assistant
              </p>

              {/* Call Status Card */}
              <div className="mt-8 w-full max-w-2xl">
                <div
                  className={`relative overflow-hidden rounded-2xl border-2 ${
                    callStarted
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                  } p-6 shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          callStarted
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {callStarted ? "Call Active" : "Standby Mode"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {callStarted
                            ? "AI assistant is listening and responding"
                            : "Press the button below to start consultation"}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-1.5 shadow-sm">
                      <p className="font-mono text-sm font-bold text-gray-700">
                        {formatTime(elapsedSeconds)}
                      </p>
                    </div>
                  </div>

                  {/* Speaking Indicator */}
                  <div className="flex min-h-[60px] items-center justify-center">
                    {currentRole === "assistant" ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-end gap-1.5">
                          {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                            <div
                              key={i}
                              className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-indigo-600 animate-pulse"
                              style={{
                                height: `${20 + Math.random() * 20}px`,
                                animationDelay: `${delay}s`,
                                animationDuration: "0.6s",
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-600">
                            Assistant Speaking
                          </p>
                          <p className="text-xs text-blue-500">
                            Analyzing and responding...
                          </p>
                        </div>
                      </div>
                    ) : callStarted ? (
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-400 opacity-20"></div>
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Listening...
                          </p>
                          <p className="text-xs text-gray-500">
                            Speak naturally, I&apos;m here to help
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">
                          Start the call to begin your consultation
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                {!callStarted ? (
                  <Button
                    size="lg"
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={StartCall}
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <PhoneCall className="h-5 w-5" />
                          Start Consultation
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-xl px-8 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={endCall}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Ending...
                      </>
                    ) : (
                      <>
                        <PhoneOff className="mr-2 h-5 w-5" />
                        End Call
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
