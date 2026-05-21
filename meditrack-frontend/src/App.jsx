import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectedrouted";

import AdminDashboard from "./pages/admin/admindashboard";
import ManageDoctors from "./pages/admin/managedoctors";
import ManagePatients from "./pages/admin/managepatients";
import ManageHospitals from "./pages/admin/managehospitals";
import ManageAppointments from "./pages/admin/manageappointments";

import DoctorDashboard from "./pages/doctor/doctordashboard";
import Patients from "./pages/doctor/patient";
import Prescriptions from "./pages/doctor/prescription";
import Appointments from "./pages/doctor/appointments";

import PatientDashboard from "./pages/patient/patientdashboard";
import ViewPrescriptions from "./pages/patient/viewprescriptions";
import BookAppointment from "./pages/patient/bookappointment";
import Hospitals from "./pages/patient/hospitals";

import HospitalList from "./pages/hospital/hospitallist";
import HospitalDetail from "./pages/hospital/hospitaldetail";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-doctors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-patients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManagePatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-hospitals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageHospitals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-appointments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ViewPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/hospitals"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Hospitals />
            </ProtectedRoute>
          }
        />

        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
