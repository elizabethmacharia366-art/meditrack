const Prescription = require('../models/Prescriptions');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');

const pickFields = (body) => {
  const { patientId, doctorId, diagnosis, medicines, notes } = body;
  return { patientId, doctorId, diagnosis, medicines, notes };
};

const buildScopeFilter = async (user) => {
  if (user.role === 'admin') return {};
  if (user.role === 'patient') {
    const patient = await Patient.findOne({ userId: user.id }).select('_id');
    return { patientId: patient ? patient._id : null };
  }
  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: user.id }).select('_id');
    return { doctorId: doctor ? doctor._id : null };
  }
  return { _id: null };
};

exports.getPrescriptions = async (req, res, next) => {
  try {
    const filter = await buildScopeFilter(req.user);
    const prescriptions = await Prescription.find(filter)
      .populate('patientId doctorId')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    next(err);
  }
};

exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patientId doctorId');
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id }).select('_id');
      if (!patient || String(prescription.patientId?._id || prescription.patientId) !== String(patient._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor || String(prescription.doctorId?._id || prescription.doctorId) !== String(doctor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    res.json(prescription);
  } catch (err) {
    next(err);
  }
};

exports.createPrescription = async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    if (!data.patientId) {
      return res.status(400).json({ error: 'patientId is required' });
    }

    // A doctor can only issue prescriptions under their own doctor profile.
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor) return res.status(403).json({ error: 'No doctor profile' });
      data.doctorId = doctor._id;
    } else if (!data.doctorId) {
      return res.status(400).json({ error: 'doctorId is required' });
    }

    const prescription = new Prescription(data);
    await prescription.save();
    const populated = await Prescription.findById(prescription._id).populate('patientId doctorId');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updatePrescription = async (req, res, next) => {
  try {
    const existing = await Prescription.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Prescription not found' });

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor || String(existing.doctorId) !== String(doctor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const data = pickFields(req.body);
    // Doctors cannot reassign the prescription to a different doctor.
    if (req.user.role === 'doctor') delete data.doctorId;

    Object.assign(existing, data);
    await existing.save();
    const populated = await Prescription.findById(existing._id).populate('patientId doctorId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.deletePrescription = async (req, res, next) => {
  try {
    const existing = await Prescription.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Prescription not found' });

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor || String(existing.doctorId) !== String(doctor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await existing.deleteOne();
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    next(err);
  }
};
