import express from "express";
import cors from "cors";
import { UserModel } from "./models/user-model.js";
import { TaskStatusEnum } from "./constants/task-status-enum.js";
import { TaskModel } from "./models/task-model.js";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(cors());

//Routes

/**
 * User Routes
 * - Get all users
 * - Add a new user
 * - Get user by ID
 * - Delete a user
 */

//Get all users
app.get("/users", (req, res) => {
  const usersData = fs.readFileSync("./db-local/users.json");
  const users = JSON.parse(usersData).users;
  res.json(users);
});

//Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const usersData = fs.readFileSync("./db-local/users.json");
  const users = JSON.parse(usersData).users;
  const newUser = new UserModel(users.length + 1, name, email);
  users.push(newUser);
  fs.writeFileSync("./db-local/users.json", JSON.stringify({ users }, null, 2));
  res.status(201).json(newUser);
});

//Get user by ID
app.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  // Basic validation
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const usersData = fs.readFileSync("./db-local/users.json");
  const users = JSON.parse(usersData).users;
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//Delete a user
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const usersData = fs.readFileSync("./db-local/users.json");
  // Basic validation
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  let users = JSON.parse(usersData).users;
  users = users.filter((user) => user.id !== userId);
  fs.writeFileSync("./db-local/users.json", JSON.stringify({ users }, null, 2));
  res.status(204).send();
});

/**
 * Tasks Routes
 * - Get all tasks
 * - Add a new task
 * - Get task by ID
 * - Delete a task
 */

// Get all tasks
app.get("/tasks", (req, res) => {
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  const tasks = JSON.parse(tasksData).tasks;
  res.json(tasks);
});

app.get("/tasks/user/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  const tasks = JSON.parse(tasksData).tasks;
  const userTasks = tasks.filter((task) => task.assignedTo === userId);
  res.json(userTasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { title, description, status, assignedTo, priority, dueDate } = req.body;
  // Basic validation
  if (!title || !description || !status || !Object.values(TaskStatusEnum).includes(status) || !assignedTo || !priority || !dueDate) {
    return res.status(400).json({ message: "Title, description, status, assignedTo, priority, and dueDate are required" });
  }
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  const tasks = JSON.parse(tasksData).tasks;
  const newTask = new TaskModel(tasks.length + 1, title, description, status, assignedTo, priority, dueDate);
  tasks.push(newTask);
  fs.writeFileSync(
    "./db-local/task-list.json",
    JSON.stringify({ tasks }, null, 2),
  );
  res.status(201).json(newTask);
});

// Get task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  const tasks = JSON.parse(tasksData).tasks;
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, status, assignedTo, priority, dueDate } = req.body;
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  let tasks = JSON.parse(tasksData).tasks;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  // Update task properties
  if (title) tasks[taskIndex].title = title;
  if (description) tasks[taskIndex].description = description;
  if (status) tasks[taskIndex].status = status;
  if (assignedTo) tasks[taskIndex].assignedTo = assignedTo;
  if (priority) tasks[taskIndex].priority = priority;
  if (dueDate) tasks[taskIndex].dueDate = dueDate;
  fs.writeFileSync("./db-local/task-list.json", JSON.stringify({ tasks }, null, 2));
  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  console.log("Deleting task with ID:", taskId);
  const tasksData = fs.readFileSync("./db-local/task-list.json");
  let tasks = JSON.parse(tasksData).tasks;
  tasks = tasks.filter((task) => task.id !== taskId);
  fs.writeFileSync("./db-local/task-list.json", JSON.stringify({ tasks }, null, 2));
  res.status(204).send();
});

export default app;
