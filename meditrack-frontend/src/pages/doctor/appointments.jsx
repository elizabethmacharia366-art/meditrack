import React, { useState } from "react";
import AppointmentTable from "../../components/appointmenttable";

export default function Appointments() {
  const [appointments] = useState([
    { id: 1, patientName: "Elizabeth Njeri", doctorName: "Dr. John Mwangi", date: "2026-05-25T10:00:00", status: "Scheduled" },
    { id: 2, patientName: "James Otieno", doctorName: "Dr. John Mwangi", date: "2026-05-26T14:00:00", status: "Completed" }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <AppointmentTable appointments={appointments} />
    </div>
  );
}
