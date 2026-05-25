const Patient = require('../models/Patients');
const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescriptions');

// Pick only safe fields out of req.body.
const pickPatientFields = (body) => {
  const { fullName, age, gender, contact, bloodGroup, medicalHistory } = body;
  return { fullName, age, gender, contact, bloodGroup, medicalHistory };
};

// Admin & doctors can list. Patients can only see themselves via /me.
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email role');
    res.json(patients);
  } catch (err) {
    next(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email role');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Patients may only fetch their own record.
    if (req.user.role === 'patient' && String(patient.userId?._id) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

exports.getMyPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

// Only admins manually create patient records. Normal patients get one on register.
exports.createPatient = async (req, res, next) => {
  try {
    const patient = new Patient(pickPatientFields(req.body));
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const existing = await Patient.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });

    if (req.user.role === 'patient' && String(existing.userId) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(existing, pickPatientFields(req.body));
    await existing.save();
    res.json(existing);
  } catch (err) {
    next(err);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Cascade: clean up dependent records.
    await Appointment.deleteMany({ patientId: patient._id });
    await Prescription.deleteMany({ patientId: patient._id });

    res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
};
