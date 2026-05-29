const User = require('../models/User');
const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, department, ward } = req.body;
    if (!title || !assignedTo) {
      return res.status(400).json({ error: 'Task title and assignee are required' });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee || !['nurse', 'technician'].includes(assignee.role)) {
      return res
        .status(400)
        .json({ error: 'Assignee must be an existing nurse or technician' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignee._id,
      createdBy: req.user.id,
      assignedRole: assignee.role,
      department,
      ward,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    let tasks;

    if (req.user.role === 'doctor') {
      tasks = await Task.find({ createdBy: req.user.id })
        .populate('assignedTo', 'name role department ward')
        .sort({ createdAt: -1 });
    } else if (['nurse', 'technician'].includes(req.user.role)) {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getAssignableStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ['nurse', 'technician'] } })
      .select('name role department ward email')
      .sort({ role: 1, name: 1 });
    res.json(staff);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Task status is required' });
    }

    const normalizedStatus = ['Scheduled', 'In progress', 'Completed'].find(
      (value) => value.toLowerCase() === status.toLowerCase(),
    );

    if (!normalizedStatus) {
      return res.status(400).json({ error: 'Invalid task status' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (['nurse', 'technician'].includes(req.user.role)) {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: not assigned to this task' });
      }
    } else if (req.user.role === 'doctor') {
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: not owner of this task' });
      }
    } else {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    task.status = normalizedStatus;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name role department ward');

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

exports.addTaskNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Note message is required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (['nurse', 'technician'].includes(req.user.role)) {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: not assigned to this task' });
      }
    } else if (req.user.role === 'doctor') {
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: not owner of this task' });
      }
    } else {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    task.notes.push({
      message: message.trim(),
      author: req.user.id,
      authorName: req.user.name,
      role: req.user.role,
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name role department ward');

    res.status(201).json(updatedTask);
  } catch (err) {
    next(err);
  }
};
