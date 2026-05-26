const Appointment = require('../models/Appointments');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');

const pickFields = (body) => {
  const {
    patientId,
    doctorId,
    hospitalId,
    date,
    status,
    issue,
    matchedSpecialty,
    reminderDate,
    reminderMessage,
  } = body;
  return {
    patientId,
    doctorId,
    hospitalId,
    date,
    status,
    issue,
    matchedSpecialty,
    reminderDate,
    reminderMessage,
  };
};

// Keyword → specialty mapping. We pick the first specialty that has any
// matching keyword in the patient's described issue. Order matters: more
// specific specialties come before "General Practice".
const SPECIALTY_KEYWORDS = [
  { specialty: 'Cardiology',   keywords: ['heart', 'chest pain', 'palpitation', 'cardiac', 'hypertension', 'blood pressure'] },
  { specialty: 'Pediatrics',   keywords: ['child', 'kid', 'infant', 'baby', 'pediatric'] },
  { specialty: 'Dermatology',  keywords: ['skin', 'rash', 'acne', 'eczema', 'itch'] },
  { specialty: 'Orthopedics',  keywords: ['bone', 'fracture', 'joint', 'knee', 'back pain', 'sprain', 'arthritis'] },
  { specialty: 'Neurology',    keywords: ['headache', 'migraine', 'seizure', 'numb', 'stroke', 'dizziness'] },
  { specialty: 'Gastroenterology', keywords: ['stomach', 'nausea', 'vomit', 'diarrh', 'ulcer', 'liver', 'abdominal'] },
  { specialty: 'ENT',          keywords: ['ear', 'nose', 'throat', 'sinus', 'cough', 'sore throat', 'tonsil'] },
  { specialty: 'Ophthalmology',keywords: ['eye', 'vision', 'blurr', 'sight'] },
  { specialty: 'Dentistry',    keywords: ['tooth', 'dental', 'gum', 'cavity'] },
  { specialty: 'Gynecology',   keywords: ['pregnan', 'menstr', 'gynec', 'womb'] },
  { specialty: 'Psychiatry',   keywords: ['anxiety', 'depress', 'mental', 'stress', 'insomnia'] },
  { specialty: 'Endocrinology',keywords: ['diabet', 'thyroid', 'hormone'] },
  { specialty: 'Pulmonology',  keywords: ['lung', 'asthma', 'breath', 'pneumonia', 'wheez'] },
  { specialty: 'General Practice', keywords: ['fever', 'flu', 'cold', 'pain', 'fatigue', 'tired', 'check', 'general'] },
];

const detectSpecialty = (issue) => {
  if (!issue || typeof issue !== 'string') return null;
  const text = issue.toLowerCase();
  for (const { specialty, keywords } of SPECIALTY_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) return specialty;
  }
  return null;
};

const matchesSpecialty = (doctorSpecialty, target) => {
  if (!doctorSpecialty || !target) return false;
  return doctorSpecialty.toLowerCase().includes(target.toLowerCase()) ||
    target.toLowerCase().includes(doctorSpecialty.toLowerCase());
};

// Pick the doctor at the hospital with the fewest active (Scheduled/In Treatment)
// appointments. Prefers doctors whose specialty matches `targetSpecialty`.
// Falls back to any doctor at the hospital if no specialty match exists.
const pickDoctorForHospital = async (hospitalId, targetSpecialty) => {
  if (!hospitalId) return null;

  const doctors = await Doctor.find({ hospitalId });
  if (doctors.length === 0) return null;

  let candidates = doctors;
  if (targetSpecialty) {
    const matched = doctors.filter((d) => matchesSpecialty(d.specialty, targetSpecialty));
    if (matched.length > 0) candidates = matched;
  }

  // Workload = count of active appointments per candidate doctor.
  const ids = candidates.map((d) => d._id);
  const loads = await Appointment.aggregate([
    { $match: { doctorId: { $in: ids }, status: { $in: ['Scheduled', 'In Treatment'] } } },
    { $group: { _id: '$doctorId', count: { $sum: 1 } } },
  ]);
  const loadMap = new Map(loads.map((l) => [String(l._id), l.count]));

  candidates.sort((a, b) => {
    const la = loadMap.get(String(a._id)) || 0;
    const lb = loadMap.get(String(b._id)) || 0;
    return la - lb;
  });

  return candidates[0];
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

    if (!data.patientId || !data.date) {
      return res.status(400).json({ error: 'patientId and date are required' });
    }

    // Patients can only book on their own behalf.
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.id }).select('_id');
      if (!patient || String(patient._id) !== String(data.patientId)) {
        return res.status(403).json({ error: 'Patients can only book their own appointments' });
      }
    }

    // Auto-route: if no doctor was selected, pick one from the chosen hospital
    // whose specialty matches the patient's described issue (least busy first).
    if (!data.doctorId) {
      if (!data.hospitalId) {
        return res.status(400).json({
          error: 'Either doctorId or hospitalId (with optional issue) is required',
        });
      }
      const targetSpecialty = detectSpecialty(data.issue);
      const picked = await pickDoctorForHospital(data.hospitalId, targetSpecialty);
      if (!picked) {
        return res.status(409).json({
          error: 'No doctors are available at the selected hospital',
        });
      }
      data.doctorId = picked._id;
      data.matchedSpecialty = targetSpecialty || picked.specialty || undefined;
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
