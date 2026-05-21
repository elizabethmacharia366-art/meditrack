const Hospital = require('../models/Hospitals');

exports.getHospitals = async (req, res, next) => {
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
    res.json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.createHospital = async (req, res, next) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hospital);
  } catch (err) {
    next(err);
  }
};

exports.deleteHospital = async (req, res, next) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hospital deleted' });
  } catch (err) {
    next(err);
  }
};
