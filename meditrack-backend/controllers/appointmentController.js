const Appointment = require('../models/Appointments');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');

const pickFields = (body) => {
  const { patientId, doctorId, hospitalId, date, status, reminderDate, reminderMessage } = body;
  return { patientId, doctorId, hospitalId, date, status, reminderDate, reminderMessage };
};

// Build a role-scoped filter so each role only sees their own appointments.
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

const canAccess = (user, appointment, patientProfileId, doctorProfileId) => {
  if (user.role === 'admin') return true;
  if (user.role === 'patient') return String(appointment.patientId?._id || appointment.patientId) === String(patientProfileId);
  if (user.role === 'doctor') return String(appointment.doctorId?._id || appointment.doctorId) === String(doctorProfileId);
  return false;
};

exports.getAppointments = async (req, res, next) => {
  try {
    const filter = await buildScopeFilter(req.user);
    const appointments = await Appointment.find(filter)
      .populate('patientId doctorId hospitalId')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId doctorId hospitalId');
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    if (req.user.role !== 'admin') {
      const profile = req.user.role === 'patient'
        ? await Patient.findOne({ userId: req.user.id }).select('_id')
        : await Doctor.findOne({ userId: req.user.id }).select('_id');
      const ok = canAccess(req.user, appointment, profile?._id, profile?._id);
      if (!ok) return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const data = pickFields(req.body);

    if (!data.patientId || !data.doctorId || !data.date) {
      return res.status(400).json({ error: 'patientId, doctorId and date are required' });
    }

    // Patients can only book on their own behalf.
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id }).select('_id');
      if (!patient || String(patient._id) !== String(data.patientId)) {
        return res.status(403).json({ error: 'Patients can only book their own appointments' });
      }
    }

    const appointment = new Appointment(data);
    await appointment.save();
    const populated = await Appointment.findById(appointment._id)
      .populate('patientId doctorId hospitalId');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id }).select('_id');
      if (!patient || String(existing.patientId) !== String(patient._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Patients can really only schedule or cancel.
      if (req.body.status && !['Scheduled', 'Cancelled'].includes(req.body.status)) {
        return res.status(403).json({ error: 'Patients cannot set that status' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor || String(existing.doctorId) !== String(doctor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    Object.assign(existing, pickFields(req.body));
    await existing.save();
    const populated = await Appointment.findById(existing._id)
      .populate('patientId doctorId hospitalId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id }).select('_id');
      if (!patient || String(existing.patientId) !== String(patient._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id }).select('_id');
      if (!doctor || String(existing.doctorId) !== String(doctor._id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await existing.deleteOne();
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};
