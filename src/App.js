const express = require("express");
const app = express();
const connectDB = require("./config/database");
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    AssignedTo: String,
});

const Task = mongoose.model('Task', taskSchema);

// middleware
async function getTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


// Routes

app.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        AssignedTo: req.body.AssignedTo,
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/tasks/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.status != null) {
        res.task.status = req.body.status;
    }
    if (req.body.AssignedTo != null) {
        res.task.status = req.body.AssignedTo;
    }
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/tasks/:id', getTask, async (req, res) => {
    try {
        await res.task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(5000, () => {
      console.log("app listen at 5000...");
    });
  })
  .catch((err) => {
    console.log("Database connection failed"+err.message);
  });
