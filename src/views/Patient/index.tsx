"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import CallLogsTable from "./CallLogsTable";
import {
  useGetLeadsEnumsQuery,
  useLazyGetPatientRecordsQuery,
} from "@/src/redux/services/leads/leadsApi";
import { useDebounce } from "use-debounce";

const Patient = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [callType, setCallType] = useState<string[]>([]);
  const [payerName, setPayerName] = useState<string[]>([]);
  const [debouncedSearch] = useDebounce(searchQuery, 800);

  const {
    data: enumsData,
    isLoading: isEnumLoading,
    isFetching: isEnumFetching,
  } = useGetLeadsEnumsQuery();

  const [triggerFetch, { data: patientData, isLoading, isFetching }] =
    useLazyGetPatientRecordsQuery();

  useEffect(() => {
    triggerFetch({
      limit: 100,
      search: debouncedSearch?.trim() || undefined,
      call_type: callType.length > 0 ? callType.join(",") : undefined,
      payer_name: payerName.length > 0 ? payerName.join(",") : undefined,
    });
  }, [debouncedSearch, callType, payerName]);

  const tableData = useMemo(() => {
    if (!patientData?.data) return [];

    const dataArray = Object.values(patientData.data);

    return dataArray.map((item: any) => {
      const allCalls = item.conversations?.calls || [];
      const latestCall = allCalls[allCalls.length - 1];

      return {
        id: item.patient_member_id,
        name: `${item.patient_name || ""}`.trim(),
        title: "Consultation Call",
        call_status: item.call_status || "-",
        phone: item.phone || "-",
        date: item.lead_creation_time?.split(" ")[0] || "-",

        transcript: latestCall?.transcript || "-",
        audioUrl: latestCall?.recording_url || "-",
        callDuration: latestCall?.call_duration || "-",

        slots: latestCall?.slots
          ? Object.entries(latestCall.slots).map(([key, val]: any) => ({
              key,
              value: val.value,
              description: val.description,
              timestamp: val.time,
            }))
          : [],

        calls: allCalls.map((call: any) => ({
          transcript: call.transcript || "-",
          recording_url: call.recording_url || "-",
          call_duration: call.call_duration || "-",
          slots: Object.entries(call.slots || {}).reduce(
            (acc: any, [key, val]: any) => {
              acc[key] = {
                key: val.key || key,
                value: val.value,
                description: val.description,
                timestamp: val.time,
              };
              return acc;
            },
            {}
          ),
        })),

        patient_dob: item.patient_dob || "-",
        payer_name: item.payer_name || "-",
        member_id: item.patient_member_id || "-",
        call_type: item.call_type || "-",
      };
    });
  }, [patientData]);

  const clean = (v: any) => String(v).replace(/,/g, "");

  const handleDownloadCSV = () => {
    const rows = tableData.filter((r: any) => selectedRows.includes(r.id));

    const slotKeys: string[] = Array.from(
      new Set(
        rows.flatMap((r: any) =>
          r.slots ? r.slots.map((s: any) => clean(s.key)) : []
        )
      )
    );

    const header = [
      "Name",
      "Phone",
      "Date",
      "Patient_Dob",
      "Payer_Name",
      "Member_Id",
      "Call_Type",
      "Call_status",
      ...slotKeys,
    ];

    const csvRows = rows.map((r: any) => {
      const slotMap: Record<string, string> = {};

      if (Array.isArray(r.slots)) {
        r.slots.forEach((s: any) => {
          slotMap[clean(s.key)] = clean(s.value ?? "");
        });
      }

      const slotValues = slotKeys.map((key: string) => slotMap[key] ?? "");

      return [
        clean(r.name),
        `"${clean(r.phone)}"`,
        clean(r.date),
        clean(r.patient_dob),
        clean(r.payer_name),
        clean(r.member_id),
        clean(r.call_type),
        clean(r.call_status),
        ...slotValues,
      ];
    });

    const csvContent = [header, ...csvRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patient-records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || isEnumLoading  || !patientData?.data) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <CallLogsTable
        data={tableData}
        selected={selectedRows}
        setSelected={setSelectedRows}
        onDownloadCSV={handleDownloadCSV}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCallTypes={callType}
        setSelectedCallTypes={setCallType}
        selectedPayers={payerName}
        setSelectedPayers={setPayerName}
        isFetching={isFetching}
        call_type={enumsData?.call_type ?? []}
        payer_name={enumsData?.payer_name ?? []}
      />
    </Box>
  );
};

export default Patient;
