const Appointment = require('../models/Appointments');

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate('patientId doctorId hospitalId');
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patientId doctorId');
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId doctorId');
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};
