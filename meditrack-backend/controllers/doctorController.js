const Doctor = require('../models/Doctors');

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('hospitalId');
    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitalId');
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    const populated = await Doctor.findById(doctor._id).populate('hospitalId');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const populated = await Doctor.findById(doctor._id).populate('hospitalId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    next(err);
  }
};
