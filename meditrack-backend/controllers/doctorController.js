const Doctor = require('../models/Doctors');
const Appointment = require('../models/Appointments');
const Prescription = require('../models/Prescriptions');

const pickDoctorFields = (body) => {
  const { fullName, specialty, contact, hospitalId, schedule } = body;
  return { fullName, specialty, contact, hospitalId, schedule };
};

// Public-ish: any authenticated user can browse the doctor directory.
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate('hospitalId')
      .populate('userId', 'name email');
    res.json(doctors);
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
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate('hospitalId');
    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = new Doctor(pickDoctorFields(req.body));
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

    Object.assign(existing, pickDoctorFields(req.body));
    await existing.save();
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
