import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import {
  Activity,
  Calendar,
  Clock,
  Eye,
  FileText,
  Stethoscope,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  record: sessionDetail;
};

export default function ViewReportDialog({ record }: Props) {
  const hasChiefComplaint =
    record.chiefComplaint && record.chiefComplaint.trim() !== "";
  const hasSymptoms = record.symptoms && record.symptoms.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye className="h-4 w-4" />
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Consultation Report
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                AI-Generated Medical Summary
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Info Card */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Session Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Specialist</p>
                  <p className="text-gray-600">
                    {record.selectedDoctor?.specialist || "General Physician"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Date</p>
                  <p className="text-gray-600">
                    {moment(record.createdOn).format("MMM D, YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Time</p>
                  <p className="text-gray-600">
                    {moment(record.createdOn).format("h:mm A")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Session ID</p>
                  <p className="text-gray-600 font-mono text-xs">
                    {record.sessionId?.slice(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              Chief Complaint
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {hasChiefComplaint
                ? record.chiefComplaint
                : "No specific complaint documented during this session."}
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              Consultation Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {record.sessionSummary ||
                "The consultation was conducted, but no detailed summary was recorded."}
            </p>
          </div>

          {/* Symptoms */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-600"></span>
              Reported Symptoms
            </h3>
            {hasSymptoms ? (
              <div className="flex flex-wrap gap-2">
                {record.symptoms!.map((symptom, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No symptoms were documented.</p>
            )}
          </div>

          {/* Duration & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Duration
              </h3>
              <p className="text-gray-700">
                {record.duration || "Not specified"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-600" />
                Severity
              </h3>
              <p className="text-gray-700">
                {record.severity || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs text-center text-gray-500">
            ⚠️ This report was generated by an AI Medical Assistant and should
            not replace professional medical advice.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
