// server.js
// A small in-memory Task CRUD API built with Express.

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies
app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory "database" — just a plain array. Data resets every time the
// server restarts, since nothing is saved to disk.
// ---------------------------------------------------------------------------
let tasks = [
  { id: 1, title: 'Learn Node.js', done: false },
  { id: 2, title: 'Build an Express API', done: false },
  { id: 3, title: 'Write some tests', done: true },
];

// Works out the next available ID based on the tasks that currently exist.
function getNextId() {
  if (tasks.length === 0) {
    return 1;
  }
  const maxId = Math.max(...tasks.map((t) => t.id));
  return maxId + 1;
}

// ---------------------------------------------------------------------------
// Swagger UI — serves interactive API docs at /docs
// ---------------------------------------------------------------------------
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// ---------------------------------------------------------------------------
// GET / — basic info about the API
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks'],
  });
});

// ---------------------------------------------------------------------------
// GET /health — simple health check
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ---------------------------------------------------------------------------
// GET /tasks — return all tasks
// ---------------------------------------------------------------------------
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// ---------------------------------------------------------------------------
// GET /tasks/:id — return a single task by ID
// ---------------------------------------------------------------------------
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  res.status(200).json(task);
});

// ---------------------------------------------------------------------------
// POST /tasks — create a new task
// ---------------------------------------------------------------------------
app.post('/tasks', (req, res) => {
  const body = req.body || {};
  const { title } = body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }

  const newTask = {
    id: getNextId(),
    title: title,
    done: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ---------------------------------------------------------------------------
// PUT /tasks/:id — update an existing task's title and/or done status
// ---------------------------------------------------------------------------
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }

  const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(body, 'done');

  if (hasTitle && (typeof body.title !== 'string' || body.title.trim() === '')) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (hasDone && typeof body.done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be a boolean' });
  }

  if (hasTitle) {
    task.title = body.title;
  }

  if (hasDone) {
    task.done = body.done;
  }

  res.status(200).json(task);
});

// ---------------------------------------------------------------------------
// DELETE /tasks/:id — remove a task
// ---------------------------------------------------------------------------
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ---------------------------------------------------------------------------
// Start the server
// ---------------------------------------------------------------------------
app.listen(PORT, 'localhost', () => {
  console.log(`Task API running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
