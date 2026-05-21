import React from "react";

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold">{doctor.fullName}</h3>
      <p className="text-gray-600">{doctor.specialty}</p>
      <p className="text-gray-500">Contact: {doctor.contact}</p>
      <ul className="mt-2">
        {doctor.schedule.map((slot, index) => (
          <li key={index} className="text-sm text-gray-700">
            {slot.day} - {slot.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
