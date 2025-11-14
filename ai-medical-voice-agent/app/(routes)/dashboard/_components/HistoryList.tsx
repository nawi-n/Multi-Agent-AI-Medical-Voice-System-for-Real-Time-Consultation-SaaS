"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { sessionDetail } from "../medical-agent/[sessionId]/page";

function HistoryList() {
  const [historyList, setHistoryList] = useState<sessionDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        <div className="w-full rounded-2xl border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-56 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-100" />
            <div className="h-10 w-full rounded bg-gray-100" />
            <div className="h-10 w-3/5 rounded bg-gray-100" />
          </div>
        </div>
      ) : historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border-dashed rounded-2xl border-2">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            width={150}
            height={150}
          />

          <h2 className="font-bold text-xl mt-2">No Recent Consultations</h2>
          <p>It looks like you haven't consulted with any doctors yet.</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;
