const { validationResult } = require('express-validator');
const io = require('../socket');

const Task = require('../models/task');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({createdAt: -1});
    res
        .status(200)
        .json({
          message: 'Fetched tasks successfully.',
          tasks: tasks,
        });
  } catch (err) {
      console.error(err.message);
      res
          .status(500)
          .json({ errors: [{ msg: 'Server error.' }] });
  }
};

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
        .status(422)
        .json({ errors: [{ msg: 'Validation failed, entered data is incorrect.' }] });
  }
  const title = req.body.title;
  try {
    const task = new Task({
      title: title
    });
    await task.save();
    io.getIO().emit('task', {
      action: 'create',
      task: task
    });
    res.status(201).json({
      message: 'Task created successfully!',
      task: task
    });
  } catch (err) {
      console.error(err.message);
      res
          .status(500)
          .json({ errors: [{ msg: 'Server error.' }] });
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Could not find task.' }] });
    }
    res.status(200).json({ message: 'Task fetched.', task: task });
  } catch (err) {
      console.error(err.message);
      res
          .status(500)
          .json({ errors: [{ msg: 'Server error.' }] });
  }
};

exports.updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
        .status(422)
        .json({ errors: [{ msg: 'Validation failed, entered data is incorrect.' }] });
  }
  try {
    const taskId = req.params.taskId;
    const {title, completed} = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Could not find task.' }] });
    }
    if (title) task.title = title;
    if (typeof completed !== "undefined") task.completed = completed;
    await task.save();
    io.getIO().emit('task', {
      action: 'update',
      task: task
    });
    res.status(200).json({ message: 'Task updated!', task: task });
  } catch (err) {
      console.error(err.message);
      res
          .status(500)
          .json({ errors: [{ msg: 'Server error.' }] });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Could not find task.' }] });
    }
    await Task.findByIdAndRemove(taskId);
    io.getIO().emit('task', {
      action: 'delete',
      task: taskId
    });
    res.status(200).json({ message: 'Deleted task.' });
  } catch (err) {
      console.error(err.message);
      res
          .status(500)
          .json({ errors: [{ msg: 'Server error.' }] });
  }
};