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

// Keeps track of the next ID to hand out to a new task.
let nextId = tasks.length + 1;

// ---------------------------------------------------------------------------
// Swagger UI — serves interactive API docs at /docs
// ---------------------------------------------------------------------------
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// ---------------------------------------------------------------------------
// GET / — basic info about the API
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    name: 'Task CRUD API',
    description: 'A small in-memory Task CRUD API built with Node.js and Express.',
    docs: '/docs',
    endpoints: [
      'GET /health',
      'GET /tasks',
      'GET /tasks/:id',
      'POST /tasks',
      'PUT /tasks/:id',
      'DELETE /tasks/:id',
    ],
  });
});

// ---------------------------------------------------------------------------
// GET /health — simple health check
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------------------------------------------------------------------------
// GET /tasks — return all tasks
// ---------------------------------------------------------------------------
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// ---------------------------------------------------------------------------
// GET /tasks/:id — return a single task by ID
// ---------------------------------------------------------------------------
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// ---------------------------------------------------------------------------
// POST /tasks — create a new task
// ---------------------------------------------------------------------------
app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
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
    return res.status(404).json({ error: 'Task not found' });
  }

  const body = req.body;
  const hasTitle = body && Object.prototype.hasOwnProperty.call(body, 'title');
  const hasDone = body && Object.prototype.hasOwnProperty.call(body, 'done');

  // Reject empty bodies, or bodies that don't include title or done at all.
  if (!body || typeof body !== 'object' || Array.isArray(body) || (!hasTitle && !hasDone)) {
    return res.status(400).json({
      error: 'Request body must include a "title" (string) and/or "done" (boolean) field',
    });
  }

  // Validate title, if provided.
  if (hasTitle) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    task.title = body.title.trim();
  }

  // Validate done, if provided.
  if (hasDone) {
    if (typeof body.done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
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
    return res.status(404).json({ error: 'Task not found' });
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
