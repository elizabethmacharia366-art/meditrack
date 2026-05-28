const Doctor = require('../models/Doctors');
const User = require('../models/User');
const Hospital = require('../models/Hospitals');
const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescriptions');

const pickDoctorFields = (body) => {
  const { fullName, specialty, contact, hospitalId, schedule } = body;
  return Object.fromEntries(
    Object.entries({ fullName, specialty, contact, hospitalId, schedule })
      .filter(([, value]) => value !== undefined),
  );
};

const ensureHospitalExists = async (hospitalId) => {
  if (!hospitalId) return true;
  return Boolean(await Hospital.exists({ _id: hospitalId }));
};

// Public-ish: any authenticated user can browse the doctor directory.
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate('hospitalId')
      .populate('userId', 'name email role status');

    if (req.user.role === 'admin') return res.json(doctors);

    const visibleDoctors = doctors.filter((doctor) => (
      !doctor.userId || doctor.userId.status === 'approved'
    ));
    res.json(visibleDoctors);
  } catch (err) {
    next(err);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('hospitalId')
      .populate('userId', 'name email');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.getMyDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.user.id }).populate('hospitalId');
    if (!doctor) {
      doctor = await Doctor.create({ userId: req.user.id, fullName: req.user.name || 'Doctor', contact: '' });
      doctor = await Doctor.findById(doctor._id).populate('hospitalId');
    }
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const data = pickDoctorFields(req.body);
    if (data.hospitalId && !(await ensureHospitalExists(data.hospitalId))) {
      return res.status(400).json({ error: 'Hospital not found for the provided hospitalId' });
    }

    const doctor = new Doctor(data);
    await doctor.save();
    const populated = await Doctor.findById(doctor._id).populate('hospitalId');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const existing = await Doctor.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Doctor not found' });

    // Doctors may only edit their own profile.
    if (req.user.role === 'doctor' && String(existing.userId) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const data = pickDoctorFields(req.body);
    if (data.hospitalId && !(await ensureHospitalExists(data.hospitalId))) {
      return res.status(400).json({ error: 'Hospital not found for the provided hospitalId' });
    }

    Object.assign(existing, data);
    await existing.save();
    if (req.body.fullName && existing.userId) {
      await User.findByIdAndUpdate(existing.userId, { name: req.body.fullName.trim() });
    }
    const populated = await Doctor.findById(existing._id).populate('hospitalId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    await Appointment.deleteMany({ doctorId: doctor._id });
    await Prescription.deleteMany({ doctorId: doctor._id });

    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    next(err);
  }
};
