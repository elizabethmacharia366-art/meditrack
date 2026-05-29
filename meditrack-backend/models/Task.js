const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedRole: {
      type: String,
      enum: ['nurse', 'technician'],
      required: true,
    },
    department: { type: String, trim: true },
    ward: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Scheduled', 'In progress', 'Completed'],
      default: 'Scheduled',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Task', taskSchema);
