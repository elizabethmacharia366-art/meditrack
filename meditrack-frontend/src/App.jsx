import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protectedroute";

import DashboardLanding from "./pages/dashboardlanding";

import AdminDashboard from "./pages/admin/admindashboard";
import ManageDoctors from "./pages/admin/managedoctors";
import ManagePatients from "./pages/admin/managepatients";
import ManageHospitals from "./pages/admin/managehospitals";
import PendingUsers from "./pages/admin/pendingusers";

import DoctorDashboard from "./pages/doctor/doctordashboard";
import TaskAssignments from "./pages/doctor/taskassignments";
import Patients from "./pages/doctor/patient";
import DoctorPatientDetail from "./pages/doctor/patientdetail";
import Prescriptions from "./pages/doctor/prescription";
import Appointments from "./pages/doctor/appointments";
import DoctorProfile from "./pages/doctor/profile";
import DoctorClinicalDashboard from "./pages/doctor/clinicaldashboard";
import DoctorAlerts from "./pages/doctor/alerts";

import PatientDashboard from "./pages/patient/patientdashboard";
import ViewPrescriptions from "./pages/patient/viewprescriptions";
import ManageStaff from "./pages/admin/managestaff";
import NurseDashboard from "./pages/nurse/nursedashboard";
import ShiftSchedule from "./pages/nurse/shiftSchedule";
import PatientMonitoring from "./pages/nurse/patientMonitoring";
import MedicationAdministration from "./pages/nurse/medicationAdministration";
import CareNotes from "./pages/nurse/careNotes";
import NurseAlerts from "./pages/nurse/alerts";
import NurseTasks from "./pages/nurse/tasks";
import TechnicianDashboard from "./pages/technician/techniciandashboard";
import PendingLabTests from "./pages/technician/pendingLabTests";
import UploadResults from "./pages/technician/uploadResults";
import QualityChecks from "./pages/technician/qualityChecks";
import EquipmentStatus from "./pages/technician/equipmentStatus";
import TechnicianAlerts from "./pages/technician/alerts";
import TechnicianTasks from "./pages/technician/tasks";
import BookAppointment from "./pages/patient/bookappointment";
import Hospitals from "./pages/patient/hospitals";
import PatientHistory from "./pages/patient/history";
import PatientProfile from "./pages/patient/profile";
import PatientLabResults from "./pages/patient/labresults";
import PatientNotifications from "./pages/patient/notifications";
import PatientFAQ from "./pages/patient/faq";

import HospitalList from "./pages/hospital/hospitallist";
import HospitalDetail from "./pages/hospital/hospitaldetail";

import WorkflowBoard from "./pages/workflowboard";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLanding />} />

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
          path="/admin/manage-staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workflow"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WorkflowBoard backTo="/admin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingUsers />
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
          path="/doctor/patients/:id"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/workflow"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <WorkflowBoard backTo="/doctor" />
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
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/clinical-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorClinicalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/alerts"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/tasks"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <TaskAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nurse"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/shift-schedule"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <ShiftSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/patient-monitoring"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <PatientMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/medication-administration"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <MedicationAdministration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/care-notes"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <CareNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/alerts"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/tasks"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/pending-lab-tests"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <PendingLabTests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/upload-results"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <UploadResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/quality-checks"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <QualityChecks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/equipment-status"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <EquipmentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/alerts"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/tasks"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianTasks />
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
          path="/patient/lab-results"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientLabResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/notifications"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/faq"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientFAQ />
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
        <Route
          path="/patient/history"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientHistory />
            </ProtectedRoute>
          }
        />

        <Route path="/hospitals" element={<HospitalList />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
