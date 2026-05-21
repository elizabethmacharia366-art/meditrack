import React, { useState } from "react";

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked:", formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
        <label className="block mb-2">Doctor</label>
        <input
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className="border rounded w-full p-2 mb-4"
        />
        <label className="block mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border rounded w-full p-2 mb-4"
        />
        <label className="block mb-2">Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border rounded w-full p-2 mb-4"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>
    </div>
  );
}
