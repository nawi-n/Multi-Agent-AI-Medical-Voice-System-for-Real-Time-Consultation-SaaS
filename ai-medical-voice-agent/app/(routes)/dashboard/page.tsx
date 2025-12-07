import React from "react";
import HistoryList from "./_components/HistoryList";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import { Activity } from "lucide-react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-16">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back! Manage your health consultations
                </p>
              </div>
            </div>
          </div>
          <AddNewSessionDialog />
        </div>

        {/* Recent Consultations */}
        <HistoryList />

        {/* Available Doctors */}
        <DoctorsAgentList />
      </div>
    </div>
  );
}

export default Dashboard;
