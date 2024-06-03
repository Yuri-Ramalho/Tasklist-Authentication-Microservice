const express = require('express');
const router = express.Router();
const Parse = require('parse/node');


router.use((req, res, next) => {
  const sessionToken = req.headers['x-parse-session-token'];
  if (!sessionToken) {
    return res.status(401).json({ error: 'Session token required' });
  }
  req.sessionToken = sessionToken;
  next();
});


router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;


    const user = await Parse.User.me(req.sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }


    const Task = Parse.Object.extend('Task');
    const task = new Task();
    task.set('title', title);
    task.set('description', description);
    task.set('dueDate', new Date(dueDate).toISOString());
    task.set('priority', priority);
    task.set('category', category);
    task.set('user', user);


    await task.save(null, { sessionToken: req.sessionToken });

    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


router.put('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, dueDate, priority, category } = req.body;


    const user = await Parse.User.me(req.sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }


    const query = new Parse.Query('Task');
    const task = await query.get(taskId, { sessionToken: req.sessionToken });


    if (!task.get('user').equals(user)) {
      return res.status(403).json({ error: 'You are not authorized to edit this task' });
    }


    task.set('title', title);
    task.set('description', description);


    if (dueDate instanceof Date) {
      task.set('dueDate', dueDate.toISOString());
    } else {
      task.set('dueDate', dueDate);
    }

    task.set('priority', priority);
    task.set('category', category);


    await task.save(null, { sessionToken: req.sessionToken });

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});


router.get('/', async (req, res) => {
  try {
    const user = await Parse.User.me(req.sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const query = new Parse.Query('Task');
    query.equalTo('user', user);
    const tasks = await query.find({ sessionToken: req.sessionToken });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


router.get('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;


    const user = await Parse.User.me(req.sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }


    const query = new Parse.Query('Task');
    const task = await query.get(taskId, { sessionToken: req.sessionToken });


    if (!task.get('user').equals(user)) {
      return res.status(403).json({ error: 'You are not authorized to view this task' });
    }

    res.status(200).json({
      title: task.get('title'),
      description: task.get('description'),
      dueDate: task.get('dueDate'),
      priority: task.get('priority'),
      category: task.get('category')
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});


router.delete('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;


    const user = await Parse.User.me(req.sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }


    const query = new Parse.Query('Task');
    const task = await query.get(taskId, { sessionToken: req.sessionToken });


    if (!task.get('user').equals(user)) {
      return res.status(403).json({ error: 'You are not authorized to delete this task' });
    }


    await task.destroy({ sessionToken: req.sessionToken });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


module.exports = router;
