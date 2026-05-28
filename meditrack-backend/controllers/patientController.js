const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');
const User = require('../models/User');
const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescriptions');
const LabResult = require('../models/LabResults');

// Pick only safe fields out of req.body.
const pickPatientFields = (body) => {
  const { fullName, age, gender, contact, bloodGroup, medicalHistory } = body;
  return Object.fromEntries(
    Object.entries({ fullName, age, gender, contact, bloodGroup, medicalHistory })
      .filter(([, value]) => value !== undefined),
  );
};

// Admin & doctors can list. Patients can only see themselves via /me.
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email role status');
    const approvedPatients = patients.filter((patient) => (
      !patient.userId || patient.userId.status === 'approved'
    ));
    res.json(approvedPatients);
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
    let patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      patient = await Patient.create({ userId: req.user.id, fullName: req.user.name || 'Patient' });
    }
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
    if (req.body.fullName && existing.userId) {
      await User.findByIdAndUpdate(existing.userId, { name: req.body.fullName.trim() });
    }
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
    await LabResult.deleteMany({ patientId: patient._id });

    res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getMyLabResults = async (req, res, next) => {
  try {
    let patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      patient = await Patient.create({ userId: req.user.id, fullName: req.user.name || 'Patient' });
    }

    const labResults = await LabResult.find({ patientId: patient._id })
      .populate('doctorId', 'fullName specialty')
      .populate('hospitalId', 'name')
      .sort({ date: -1 });

    res.json(labResults);
  } catch (err) {
    next(err);
  }
};

exports.getPatientLabResults = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    if (req.user.role === 'patient' && String(patient.userId || patient.userId) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor) return res.status(403).json({ error: 'No doctor profile found' });
    }

    const labResults = await LabResult.find({ patientId: patient._id })
      .populate('doctorId', 'fullName specialty')
      .populate('hospitalId', 'name')
      .sort({ date: -1 });

    res.json(labResults);
  } catch (err) {
    next(err);
  }
};

const pickLabResultFields = (body) => {
  const {
    type,
    date,
    summary,
    abnormal,
    status,
    fileUrl,
    hospitalId,
    details,
  } = body;

  return Object.fromEntries(
    Object.entries({ type, date, summary, abnormal, status, fileUrl, hospitalId, details })
      .filter(([, value]) => value !== undefined),
  );
};

exports.createLabResult = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const doctor = req.user.role === 'doctor'
      ? await Doctor.findOne({ userId: req.user.id }).select('_id')
      : null;
    if (req.user.role === 'doctor' && !doctor) {
      return res.status(403).json({ error: 'Doctor profile required to create lab results' });
    }

    const payload = pickLabResultFields(req.body);
    if (!payload.type) {
      return res.status(400).json({ error: 'Lab result type is required' });
    }

    const labResult = new LabResult({
      patientId: patient._id,
      doctorId: doctor?._id,
      hospitalId: payload.hospitalId,
      type: payload.type,
      date: payload.date ? new Date(payload.date) : undefined,
      summary: payload.summary,
      abnormal: payload.abnormal,
      status: payload.status,
      fileUrl: payload.fileUrl,
      details: payload.details,
    });

    await labResult.save();
    res.status(201).json(labResult);
  } catch (err) {
    next(err);
  }
};

// Returns a patient's appointments + prescriptions, scoped by role:
// - admin: full history
// - patient (self): full history
// - doctor: only records they themselves issued/are assigned to
exports.getPatientHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'name email role',
    );
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const apptFilter = { patientId: patient._id };
    const presFilter = { patientId: patient._id };

    if (req.user.role === 'patient') {
      if (String(patient.userId?._id || patient.userId) !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor) return res.status(403).json({ error: 'No doctor profile' });
      apptFilter.doctorId = doctor._id;
      presFilter.doctorId = doctor._id;
    }

    const [appointments, prescriptions] = await Promise.all([
      Appointment.find(apptFilter)
        .populate('doctorId hospitalId')
        .sort({ date: -1 }),
      Prescription.find(presFilter)
        .populate('doctorId')
        .sort({ createdAt: -1 }),
    ]);

    res.json({ patient, appointments, prescriptions });
  } catch (err) {
    next(err);
  }
};
