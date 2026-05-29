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
    notes: [
      {
        message: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, trim: true },
        role: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Task', taskSchema);
