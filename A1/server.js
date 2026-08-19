const express = require("express");

const app = express();
app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const PORT = 3000;
/*
let tasks = [
  { id: 1, title: "Finish FlyRank assignment", done: false },
  { id: 2, title: "Go to the gym", done: true },
  { id: 3, title: "Review backend notes", done: false }
];
*/

const initialTasks = [
  { id: 1, title: "Finish FlyRank assignment", done: false },
  { id: 2, title: "Go to the gym", done: true },
  { id: 3, title: "Review backend notes", done: false }
];

let tasks = initialTasks.map(task => ({ ...task }));
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.get("/tasks", (req, res) => {
  let filteredTasks = tasks;

  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    filteredTasks = filteredTasks.filter(task => task.done === done);
  }

  if (req.query.search) {
    const search = req.query.search.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(search)
    );
  }

  res.json(filteredTasks);
});
app.get ( "/tasks/:id", (req,res)=>{
  const id = parseInt(req.params.id);
  const task = tasks.find(task=> task.id === id);
  
  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const nextId =
    tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

  const newTask = {
    id: nextId,
    title: title,
    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  const { title, done } = req.body;

  if (
    (title === undefined && done === undefined) ||
    (title !== undefined && (typeof title !== "string" || title.trim() === "")) ||
    (done !== undefined && typeof done !== "boolean")
  ) {
    return res.status(400).json({
      error: "Invalid request body"
    });
  }

  if (title !== undefined) {
    task.title = title;
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});

app.get("/stats", (req, res) => {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const open = tasks.filter(task => !task.done).length;

  res.json({
    total,
    done,
    open
  });
});

app.post("/reset", (req, res) => {
  tasks = initialTasks.map(task => ({ ...task }));

  res.json(tasks);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});