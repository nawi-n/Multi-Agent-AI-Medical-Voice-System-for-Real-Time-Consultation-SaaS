import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";
import { Clock, FileText } from "lucide-react";
import ViewReportDialog from "./ViewReportDialog";
import { Badge } from "@/components/ui/badge";

type Props = {
  historyList: sessionDetail[];
  totalCount?: number;
};

function HistoryTable({ historyList, totalCount }: Props) {
  const displayCount = totalCount ?? historyList.length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Consultation History
            </h3>
            <p className="text-sm text-gray-600">
              {displayCount} consultation
              {displayCount !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>
      </div>

      {/* Desktop/Table view */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="font-semibold text-gray-700">
                Specialist
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyList.map((record: sessionDetail, index: number) => (
              <TableRow
                key={record.id ?? record.sessionId ?? index}
                className="hover:bg-blue-50/50 transition-colors border-gray-100"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {record.selectedDoctor?.specialist?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {record.selectedDoctor?.specialist}
                      </p>
                      {record.selectedDoctor?.subscriptionRequired && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-xs">
                  <p className="line-clamp-2">{record.notes}</p>
                </TableCell>
                <TableCell className="text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {moment(new Date(record.createdOn)).format("MMM D, YYYY")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moment(new Date(record.createdOn)).fromNow()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ViewReportDialog record={record} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Card view */}
      <div className="sm:hidden p-4">
        <div className="grid grid-cols-1 gap-4">
          {historyList.map((record: sessionDetail, index: number) => (
            <div
              key={record.id ?? record.sessionId ?? index}
              className="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {record.selectedDoctor?.specialist?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                      {record.selectedDoctor?.specialist}
                    </p>
                    {record.selectedDoctor?.subscriptionRequired && (
                      <Badge variant="secondary" className="text-[10px]">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {moment(new Date(record.createdOn)).format(
                      "MMM D, YYYY"
                    )} • {moment(new Date(record.createdOn)).fromNow()}
                  </p>
                </div>
              </div>

              {record.notes && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {record.notes}
                </p>
              )}

              <div className="mt-4">
                <ViewReportDialog record={record} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {historyList.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No consultation history available</p>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;
