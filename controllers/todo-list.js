const { validationResult } = require('express-validator');
const io = require('../socket');

const Task = require('../models/task');

exports.getTasks = (req, res, next) => {
  Task.find().sort({createdAt: -1})
    .then(tasks => {
      res
        .status(200)
        .json({
          message: 'Fetched tasks successfully.',
          tasks: tasks,
        });
    })
    .catch(err => {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server error.' }] });
    });
};

exports.createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
        .status(422)
        .json({ errors: [{ msg: 'Validation failed, entered data is incorrect.' }] });
  }
  const title = req.body.title;
  const task = new Task({
    title: title
  });
  task
    .save()
    .then(result => {
      io.getIO().emit('task', {
        action: 'create',
        task: result
      });
      res.status(201).json({
        message: 'Task created successfully!',
        task: result
      });
    })
    .catch(err => {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server error.' }] });
    });
};

exports.getTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then(task => {
      if (!task) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Could not find task.' }] });
      }
      res.status(200).json({ message: 'Task fetched.', task: task });
    })
    .catch(err => {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server error.' }] });
    });
};

exports.updateTask = (req, res, next) => {
  const taskId = req.params.taskId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
        .status(422)
        .json({ errors: [{ msg: 'Validation failed, entered data is incorrect.' }] });
  }
  const {title, completed} = req.body;
  Task.findById(taskId)
    .then(task => {
      if (!task) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Could not find task.' }] });
      }
      if (title) task.title = title;
      if (typeof completed !== "undefined") task.completed = completed;
      return task.save();
    })
    .then(result => {
      io.getIO().emit('task', {
        action: 'update',
        task: result
      });
      res.status(200).json({ message: 'Task updated!', task: result });
    })
    .catch(err => {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server error.' }] });
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then(task => {
      if (!task) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Could not find task.' }] });
      }
      return Task.findByIdAndRemove(taskId);
    })
    .then(result => {
      io.getIO().emit('task', {
        action: 'delete',
        task: taskId
      });
      res.status(200).json({ message: 'Deleted task.' });
    })
    .catch(err => {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server error.' }] });
    });
};