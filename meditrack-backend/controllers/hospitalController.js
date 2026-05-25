const Hospital = require('../models/Hospitals');
const Doctor = require('../models/Doctors');

const pickHospitalFields = (body) => {
  const { name, location, description, departments, contact, hours } = body;
  return { name, location, description, departments, contact, hours };
};

exports.getHospitals = async (_req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    next(err);
  }
};

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.createHospital = async (req, res, next) => {
  try {
    const hospital = new Hospital(pickHospitalFields(req.body));
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      pickHospitalFields(req.body),
      { new: true, runValidators: true },
    );
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

    // Detach doctors instead of deleting them.
    await Doctor.updateMany({ hospitalId: hospital._id }, { $unset: { hospitalId: '' } });

    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    next(err);
  }
};
