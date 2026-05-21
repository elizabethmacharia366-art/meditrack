import React from "react";

export default function AppointmentTable({ appointments }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Patient</th>
          <th className="border p-2">Doctor</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt, idx) => (
          <tr key={idx}>
            <td className="border p-2">{appt.patientName}</td>
            <td className="border p-2">{appt.doctorName}</td>
            <td className="border p-2">{new Date(appt.date).toLocaleString()}</td>
            <td className="border p-2">{appt.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
