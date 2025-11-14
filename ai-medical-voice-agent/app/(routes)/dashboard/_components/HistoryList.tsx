"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import { ChevronDown } from "lucide-react";

function HistoryList() {
  const [historyList, setHistoryList] = useState<sessionDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log(result.data);
      setHistoryList(result.data);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {loading ? (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 rounded-lg bg-gray-200" />
                <div className="h-4 w-32 rounded-lg bg-gray-100" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-full rounded-lg bg-gray-100" />
              <div className="h-12 w-full rounded-lg bg-gray-100" />
              <div className="h-12 w-4/5 rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
      ) : historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-12 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
          <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-6 mb-4">
            <Image
              src={"/medical-assistance.png"}
              alt="empty"
              width={120}
              height={120}
              className="opacity-80"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            No Consultation History Yet
          </h2>
          <p className="text-gray-600 mt-2 text-center max-w-md">
            Start your first consultation with our AI medical specialists to get
            personalized health advice.
          </p>
          <div className="mt-6">
            <AddNewSessionDialog />
          </div>
        </div>
      ) : (
        <div>
          <HistoryTable
            historyList={showAll ? historyList : historyList.slice(0, 3)}
            totalCount={historyList.length}
          />

          {historyList.length > 3 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="gap-2 rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50"
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
                  </>
                ) : (
                  <>
                    View {historyList.length - 3} More
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
