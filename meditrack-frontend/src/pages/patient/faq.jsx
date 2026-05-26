import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "Do you accept insurance?",
    a: "Yes — most major insurance providers are supported. Add your insurance details on your profile so hospitals can verify coverage in advance.",
  },
  {
    q: "How long is the typical wait time?",
    a: "Average wait time across our partner hospitals is under 20 minutes for in-person visits, and under 5 minutes for telehealth consultations.",
  },
  {
    q: "Can I consult online?",
    a: "Yes. When booking an appointment you can choose telehealth in the form if the hospital supports it.",
  },
  {
    q: "How do I renew a prescription?",
    a: "Open My Prescriptions, find the prescription you want to renew, and message your doctor — they will issue a new one if appropriate.",
  },
  {
    q: "How do reminders work?",
    a: "If your appointment has a reminder date set by the clinic, you will see it in your appointment list. We do not send unsolicited messages.",
  },
  {
    q: "Is my data private?",
    a: "Only you, your treating doctor, and authorized administrators can see your records. Doctors only see history for patients they have treated.",
  },
  {
    q: "How do I cancel an appointment?",
    a: "From Book Appointment, find the appointment in your list and click Cancel. You can also delete it.",
  },
];

export default function PatientFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">FAQ & Support</h1>
        <Link to="/patient" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <ul className="space-y-2">
        {FAQS.map((item, idx) => (
          <li key={idx} className="bg-white shadow rounded-lg">
            <button
              type="button"
              onClick={() => setOpen(open === idx ? -1 : idx)}
              className="w-full text-left px-4 py-3 font-medium text-gray-800 flex items-center justify-between"
            >
              <span>{item.q}</span>
              <span className="text-blue-600 text-sm">{open === idx ? "−" : "+"}</span>
            </button>
            {open === idx && (
              <div className="px-4 pb-4 text-sm text-gray-700">{item.a}</div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
        Still need help? Contact your hospital directly from the
        {" "}
        <Link to="/patient/hospitals" className="underline font-medium">hospital directory</Link>.
      </div>
    </div>
  );
}
