import React, { useState } from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg"];

export default function TechnicianUploadResults() {
  const [patientId, setPatientId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultValue, setResultValue] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUpload = (e) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setUploadMessage("Patient ID is required.");
      return;
    }
    if (!selectedFile && !resultValue.trim()) {
      setUploadMessage("Please attach a result file or enter a numeric value.");
      return;
    }
    if (selectedFile && !acceptedFileTypes.includes(selectedFile.type)) {
      setUploadMessage("Only PDF, PNG, and JPEG formats are accepted.");
      return;
    }
    setUploadMessage(selectedFile
      ? `Uploaded ${selectedFile.name} for ${patientId}.`
      : `Saved numeric result for ${patientId}: ${resultValue}`);
    setPatientId("");
    setSelectedFile(null);
    setResultValue("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Upload test results and attach them to a patient profile for doctor and nurse review." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Upload Results</h1>
            <p className="mt-2 text-slate-600">Attach PDF or image reports, or enter numeric results directly for patient lab work.</p>
          </div>
          <Link to="/technician" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to technician dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Patient ID</label>
              <input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3"
                placeholder="Enter patient ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Result file</label>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="mt-1 text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Numeric result (optional)</label>
              <input
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                type="number"
                step="any"
                className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3"
                placeholder="Enter a number if no file is attached"
              />
            </div>
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Submit result</button>
            {uploadMessage && <p className="text-sm text-slate-600">{uploadMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
