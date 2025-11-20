// "use client";
// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import CallLogsTable from "./CallLogsTable";
// import { useGetPatientRecordsQuery } from "@/src/redux/services/leads/leadsApi";

// const Pharmacy = () => {
//   const [selectedRows, setSelectedRows] = useState<string[]>([]);
//   const {data:patientData}=useGetPatientRecordsQuery()

//   const fakeData = [
//     {
//       id: "1",
//       name: "Ali Farooq",
//       title: "Consultation Call",
//       email: "ali@cyphdigital.com",
//       phone: "+1234567890",
//       date: "2025-11-05",
//       transcript: "Hello, thank you for reaching out...",
//       audioUrl: "/sample.mp3",
//       markers: [
//         {
//           time: 3,
//           label: "Greeting",
//           question: "What was the patient's concern?",
//           answer: "They called to confirm prescription details.",
//         },
//         {
//           time: 12,
//           label: "Query",
//           question: "What question did they ask?",
//           answer: "Asked if they can refill early.",
//         },
//         {
//           time: 25,
//           label: "End",
//           question: "How was the call closed?",
//           answer: "Pharmacist provided guidance and ended politely.",
//         },
//       ],
//     },
//     {
//       id: "2",
//       name: "Zeeshan Ali",
//       title: "Consultation Call",
//       email: "zeeshan@cyphdigital.com",
//       phone: "+1234567890",
//       date: "2025-11-05",
//       transcript: "Hello, thank you for reaching out...",
//       audioUrl: "/sample.mp3",
//       markers: [
//         {
//           time: 5,
//           label: "Start",
//           question: "What was the patient's concern?",
//           answer: "They called to confirm prescription details.",
//         },
//         {
//           time: 12,
//           label: "Query",
//           question: "What question did they ask?",
//           answer: "Asked if they can refill early.",
//         },
//         {
//           time: 25,
//           label: "End",
//           question: "How was the call closed?",
//           answer: "Pharmacist provided guidance and ended politely.",
//         },
//       ],
//     },
//   ];

//   const handleDownloadCSV = () => {
//     const rows = fakeData.filter((r) => selectedRows.includes(r.id));
//     const csv = [
//       ["Name", "Email", "Phone", "Date", "Title"],
//       ...rows.map((r) => [r.name, r.email, r.phone, r.date, r.title]),
//     ]
//       .map((r) => r.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "call-logs.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Box p={3}>
//       <CallLogsTable
//         data={fakeData}
//         selected={selectedRows}
//         setSelected={setSelectedRows}
//         onDownloadCSV={handleDownloadCSV}
//       />
//     </Box>
//   );
// };

// export default Pharmacy;
"use client";
import React, { useState, useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CallLogsTable from "./CallLogsTable";
import { useGetPatientRecordsQuery } from "@/src/redux/services/leads/leadsApi";

const Pharmacy = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: patientData, isLoading } = useGetPatientRecordsQuery({
    limit: 50,
  });

  const tableData = useMemo(() => {
    if (!patientData?.data) return [];

    return patientData.data.map((item: any) => ({
      
      id: item.lead_id,
      name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
      title: "Consultation Call",
      // email: "",
      phone: item.phone || "",
      date: item.created_at?.split(" ")[0] || "",
      transcript: item.provider_metadata?.transcript || "",
      audioUrl: item.provider_metadata?.recording_url || "",
      slots: Object.entries(item.slots || {}).map(([key, val]: any) => ({
        key,
        value: val.value,
        description: val.description,
        timestamp: val.timestamp,
      })),
      patient_dob: item.call_context.patient_dob.value || "",
      payer_name: item.call_context.payer_name.value || "",
      member_id: item.call_context.patient_member_id.value || "",
      callDuration: item?.call_duration || "",
    }));
  }, [patientData]);

  const handleDownloadCSV = () => {
    const rows = tableData.filter((r: any) => selectedRows.includes(r.id));

    const slotKeys = Array.from(
      new Set(
        rows.flatMap((r: any) =>
          r.slots ? r.slots.map((s: any) => s.key) : []
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
      ...slotKeys,
    ];

    const csvRows = rows.map((r: any) => {
      const slotMap: any = {};

      if (Array.isArray(r.slots)) {
        r.slots.forEach((s: any) => {
          slotMap[s.key] = s.value ?? "";
        });
      }

      const slotValues = slotKeys.map(
        (key) => (slotMap[key as string] as any) ?? ""
      );

      return [
        r.name,
        `"${r.phone}"`,
        r.date,
        r.patient_dob,
        r.payer_name,
        r.member_id,
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

  if (isLoading || !patientData?.data) {
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
      />
    </Box>
  );
};

export default Pharmacy;
