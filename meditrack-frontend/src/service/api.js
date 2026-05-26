import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Always read the latest token from localStorage so requests stay authorized
// even after a page refresh.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPatients = () => API.get("/patients");
export const getPatient = (id) => API.get(`/patients/${id}`);
export const getPatientHistory = (id) => API.get(`/patients/${id}/history`);
export const createPatient = (data) => API.post("/patients", data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

export const getAppointments = () => API.get("/appointments");
export const createAppointment = (data) => API.post("/appointments", data);
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

export const getPrescriptions = () => API.get("/prescriptions");
export const createPrescription = (data) => API.post("/prescriptions", data);
export const updatePrescription = (id, data) => API.put(`/prescriptions/${id}`, data);
export const deletePrescription = (id) => API.delete(`/prescriptions/${id}`);

export const getDoctors = () => API.get("/doctors");
export const createDoctor = (data) => API.post("/doctors", data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

export const getHospitals = () => API.get('/hospitals');
export const getHospital = (id) => API.get(`/hospitals/${id}`);
export const createHospital = (data) => API.post('/hospitals', data);
export const updateHospital = (id, data) => API.put(`/hospitals/${id}`, data);
export const deleteHospital = (id) => API.delete(`/hospitals/${id}`);

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const adminLogin = (data) => API.post('/auth/admin-login', data);
export const me = () => API.get('/auth/me');
export const verifyEmail = (token) => API.post('/auth/verify-email', { token });
export const resendVerification = (email) => API.post('/auth/resend-verification', { email });
export const getMyPatient = () => API.get('/patients/me');
export const updateMyPatient = (id, data) => API.put(`/patients/${id}`, data);

// Admin approval & invites
export const adminListUsers = (params) => API.get('/admin/users', { params });
export const adminApproveUser = (id) => API.post(`/admin/users/${id}/approve`);
export const adminRejectUser = (id, reason) =>
  API.post(`/admin/users/${id}/reject`, { reason });

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
