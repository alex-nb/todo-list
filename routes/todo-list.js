const express = require('express');
const { body } = require('express-validator');

const todoListController = require('../controllers/todo-list');

const router = express.Router();

router.get('/tasks', todoListController.getTasks);

router.post(
  '/task',
  [
    body('title')
      .trim()
      .isLength({ min: 5 })
  ],
  todoListController.createTask
);

router.get('/task/:taskId', todoListController.getTask);

router.put(
  '/task/:taskId',
  todoListController.updateTask
);

router.delete('/task/:taskId', todoListController.deleteTask);

module.exports = router;
