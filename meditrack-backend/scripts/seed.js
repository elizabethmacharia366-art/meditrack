/* eslint-disable no-console */
require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

// Force Node's DNS resolver to use public DNS servers. This is required when
// the local network blocks/times-out SRV lookups against MongoDB Atlas
// (which the mongodb+srv:// scheme depends on).
const DNS_SERVERS = (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
try {
  dns.setServers(DNS_SERVERS);
} catch (_) {
  // ignore; Node will keep its defaults
}

const User = require('../models/User');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const Hospital = require('../models/Hospitals');
const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescriptions');
const Invite = require('../models/Invite');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB || 'meditrack';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '106276';

const log = (...args) => console.log('[seed]', ...args);

async function run() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is required to seed.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 15000,
    });
  } catch (err) {
    console.error('\nFailed to connect to MongoDB:', err.message);
    if (err.code === 'ETIMEOUT' || /querySrv|ENOTFOUND|ECONNREFUSED/.test(err.message)) {
      console.error('\nHints:');
      console.error('  - Check your internet connection / VPN.');
      console.error('  - In Atlas, add your current IP to the Network Access allow list.');
      console.error('  - Make sure the cluster is not paused.');
      console.error('  - If on a restrictive network, SRV DNS lookups may be blocked.');
    }
    process.exit(1);
  }
  log('connected to', mongoose.connection.name);

  // Wipe (only the collections we own)
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Hospital.deleteMany({}),
    Appointment.deleteMany({}),
    Prescription.deleteMany({}),
    Invite.deleteMany({}),
  ]);
  log('cleared existing data');

  // Hospitals
  const [nairobi, mombasa] = await Hospital.create([
    {
      name: 'Nairobi General Hospital',
      location: 'Nairobi, Kenya',
      description: 'Tertiary public hospital with full specialty coverage.',
      departments: ['Cardiology', 'Pediatrics', 'Radiology', 'Surgery'],
      contact: '+254 700 000 001',
      hours: 'Mon-Sun, 24h',
    },
    {
      name: 'Mombasa Coast Hospital',
      location: 'Mombasa, Kenya',
      description: 'Regional hospital serving the coastal counties.',
      departments: ['Maternity', 'Orthopedics', 'Dermatology'],
      contact: '+254 700 000 002',
      hours: 'Mon-Sat, 7am-8pm',
    },
  ]);
  log('hospitals:', 2);

  // Admin
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@meditrack.test',
    password: ADMIN_SECRET,
    role: 'admin',
    provider: 'email',
    status: 'approved',
    emailVerified: true,
    approvedAt: new Date(),
  });

  // Doctors (with linked users)
  const doctorUsers = await User.create([
    {
      name: 'Dr. Aisha Mwangi',
      email: 'aisha@meditrack.test',
      password: 'password123',
      role: 'doctor',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
      approvedBy: admin._id,
    },
    {
      name: 'Dr. Brian Otieno',
      email: 'brian@meditrack.test',
      password: 'password123',
      role: 'doctor',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
      approvedBy: admin._id,
    },
  ]);
  const doctors = await Doctor.create([
    {
      userId: doctorUsers[0]._id,
      fullName: 'Dr. Aisha Mwangi',
      specialty: 'Cardiology',
      contact: '+254 711 000 001',
      hospitalId: nairobi._id,
      schedule: [{ day: 'Mon', time: '09:00-12:00' }, { day: 'Wed', time: '14:00-17:00' }],
    },
    {
      userId: doctorUsers[1]._id,
      fullName: 'Dr. Brian Otieno',
      specialty: 'Pediatrics',
      contact: '+254 711 000 002',
      hospitalId: mombasa._id,
      schedule: [{ day: 'Tue', time: '10:00-13:00' }, { day: 'Fri', time: '09:00-12:00' }],
    },
  ]);
  log('doctors:', doctors.length);

  // Patients (with linked users)
  const patientUsers = await User.create([
    {
      name: 'Jane Doe',
      email: 'jane@meditrack.test',
      password: 'password123',
      role: 'patient',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
    },
    {
      name: 'John Kamau',
      email: 'john@meditrack.test',
      password: 'password123',
      role: 'patient',
      status: 'approved',
      emailVerified: true,
      approvedAt: new Date(),
    },
  ]);
  const patients = await Patient.create([
    {
      userId: patientUsers[0]._id,
      fullName: 'Jane Doe',
      age: 32,
      gender: 'Female',
      contact: '+254 720 000 001',
      bloodGroup: 'O+',
      medicalHistory: ['Mild asthma'],
    },
    {
      userId: patientUsers[1]._id,
      fullName: 'John Kamau',
      age: 45,
      gender: 'Male',
      contact: '+254 720 000 002',
      bloodGroup: 'A+',
      medicalHistory: ['Hypertension'],
    },
  ]);
  log('patients:', patients.length);

  // Appointments
  const now = new Date();
  const inDays = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);
  const appointments = await Appointment.create([
    {
      patientId: patients[0]._id,
      doctorId: doctors[0]._id,
      hospitalId: nairobi._id,
      date: inDays(2),
      status: 'Scheduled',
      reminderDate: inDays(1),
      reminderMessage: 'Don\'t forget your cardiology follow-up.',
    },
    {
      patientId: patients[1]._id,
      doctorId: doctors[1]._id,
      hospitalId: mombasa._id,
      date: inDays(5),
      status: 'Scheduled',
    },
  ]);
  log('appointments:', appointments.length);

  // Prescriptions
  const prescriptions = await Prescription.create([
    {
      patientId: patients[0]._id,
      doctorId: doctors[0]._id,
      diagnosis: 'Mild hypertension',
      medicines: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
      ],
      notes: 'Monitor blood pressure weekly.',
    },
    {
      patientId: patients[1]._id,
      doctorId: doctors[1]._id,
      diagnosis: 'Seasonal flu',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' },
        { name: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily' },
      ],
      notes: 'Plenty of fluids and rest.',
    },
  ]);
  log('prescriptions:', prescriptions.length);

  console.log('\nSeed complete. Test credentials:');
  console.table([
    { role: 'admin', email: admin.email, password: ADMIN_SECRET },
    { role: 'doctor', email: doctorUsers[0].email, password: 'password123' },
    { role: 'doctor', email: doctorUsers[1].email, password: 'password123' },
    { role: 'patient', email: patientUsers[0].email, password: 'password123' },
    { role: 'patient', email: patientUsers[1].email, password: 'password123' },
  ]);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
