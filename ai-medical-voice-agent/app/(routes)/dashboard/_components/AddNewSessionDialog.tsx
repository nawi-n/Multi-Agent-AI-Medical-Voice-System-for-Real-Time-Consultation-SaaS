"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { DoctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { toast } from "sonner";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>();
  const [selectedDoctor, SetSelectedDoctor] = useState<DoctorAgent | null>(
    null
  );
  const router = useRouter();
  const [historyList, setHistoryList] = useState<sessionDetail[]>([]);

  // 👇 Auto-select if only one doctor
  useEffect(() => {
    if (suggestedDoctors && suggestedDoctors.length === 1) {
      SetSelectedDoctor(suggestedDoctors[0]);
    }
  }, [suggestedDoctors]);

  const { has } = useAuth();
  const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };

  const OnClickNext = async () => {
    setLoading(true);
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await axios.post("/api/suggest-doctors", {
          notes: note,
        });

        const doctors = Array.isArray(result.data?.doctors)
          ? result.data.doctors
          : Array.isArray(result.data)
          ? result.data
          : null;

        if (doctors) {
          setSuggestedDoctors(doctors);
          setLoading(false);
          return;
        } else {
          console.error("Invalid response format:", result.data);
          const errorMessage =
            result.data?.error ||
            "Failed to get doctor suggestions. Please try again.";
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error(
          `Error fetching doctors (attempt ${attempt + 1}):`,
          error
        );

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const serverMessage = error.response?.data?.error;

          // If rate limited and we have retries left, wait and retry
          if (status === 429 && attempt < maxRetries) {
            const delayMs = Math.pow(2, attempt) * 1000;
            console.log(
              `Rate limited. Retrying in ${delayMs}ms (attempt ${
                attempt + 1
              }/${maxRetries})`
            );
            toast.loading(
              `Service busy. Retrying in ${Math.ceil(delayMs / 1000)}s...`
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }

          toast.error(
            serverMessage ||
              "Failed to get doctor suggestions. Please try again."
          );
        } else {
          toast.error("Failed to get doctor suggestions. Please try again.");
        }
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  };

  const onStartConsultation = async () => {
    setLoading(true);
    //Save all info to database
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log(result.data);
    if (result.data?.sessionId) {
      console.log("Session Created with ID: ", result.data.sessionId);
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  const hasReachedLimit = !paidUser && historyList?.length >= 1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-disabled={hasReachedLimit}
          className={`mt-3 ${
            hasReachedLimit ? "opacity-50 cursor-not-allowed" : ""
          }`}
          // block mouse activation before it reaches DialogTrigger
          onMouseDown={(e) => {
            if (hasReachedLimit) {
              e.preventDefault();
              e.stopPropagation();
              // stopImmediatePropagation exists on the native DOM event, call it there
              (e.nativeEvent as Event).stopImmediatePropagation();
            }
          }}
          // block click fallback
          onClick={(e) => {
            if (hasReachedLimit) {
              e.preventDefault();
              e.stopPropagation();
              // stopImmediatePropagation exists on the native DOM event, call it there
              (e.nativeEvent as Event).stopImmediatePropagation();
              toast.custom(() => (
                <div className="max-w-md px-4 py-3 rounded-lg shadow-lg bg-gray-800 text-white flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-sm">
                      Subscribe to continue
                    </div>
                    <div className="text-sm text-white/90 mt-1">
                      You have used your free consultation. Upgrade to continue.
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => {
                        router.push("/dashboard/billing");
                      }}
                      className="bg-white text-black font-semibold px-3 py-1.5 rounded-md shadow-sm"
                    >
                      View Billing
                    </button>
                  </div>
                </div>
              ));

              return;
            }
            // otherwise let DialogTrigger handle opening
          }}
          // block keyboard activation (Enter/Space)
          onKeyDown={(e) => {
            if (hasReachedLimit && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              e.stopPropagation();
              // stopImmediatePropagation exists on the native DOM event, call it there
              (e.nativeEvent as Event).stopImmediatePropagation();
              toast("Subscribe to continue", {
                description:
                  "You have used your free consultation. Upgrade to continue.",
                className: "text-white bg-black", // ← Title text color + background
                descriptionClassName: "text-gray-200", // ← Description color
              });
            }
          }}
        >
          + Start a Consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or anyother Details</h2>
                <Textarea
                  placeholder="Add Details here..."
                  className="h-[200px] mt-2 mb-4"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select the Doctor</h2>
                <div className="grid grid-cols-2 gap-5">
                  {suggestedDoctors &&
                    Array.isArray(suggestedDoctors) &&
                    suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        doctorAgent={doctor}
                        key={index}
                        setSelectedDoctor={() => SetSelectedDoctor(doctor)}
                        selectedDoctor={selectedDoctor ?? undefined}
                      />
                    ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={() => OnClickNext()}>
              Next {""}
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={() => onStartConsultation()}
            >
              Start Consultation
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
