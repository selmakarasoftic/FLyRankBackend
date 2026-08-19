# Task API

A simple in-memory CRUD API built with Node.js and Express. The API allows tasks to be created, retrieved, updated, and deleted. Task data is stored in memory, so changes are reset when the server restarts.

Swagger UI is included to provide interactive API documentation and testing.

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/selmakarasoftic/FLyRankBackend.git
```

Navigate to the A1 directory:

```bash
cd FLyRankBackend/A1
```

Install the required dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API will run at:

`http://localhost:3000`

Swagger UI is available at:

`http://localhost:3000/docs`

## API Endpoints

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| GET | `/` | Get basic API information | `200 OK` |
| GET | `/health` | Check if the server is running | `200 OK` |
| GET | `/tasks` | Get all tasks | `200 OK` |
| GET | `/tasks/:id` | Get a task by ID | `200 OK` |
| POST | `/tasks` | Create a new task | `201 Created` |
| PUT | `/tasks/:id` | Update a task | `200 OK` |
| DELETE | `/tasks/:id` | Delete a task | `204 No Content` |

## Example Request with curl

The API can also be tested from the terminal using curl.

Example:

```bash
curl -i http://localhost:3000/health
```

Example response:

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 15
ETag: W/"f-VaSQ4oDUiZblZNAEkkN+sX+q3Sg"
Date: Wed, 19 Aug 2026 22:38:01 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok"}
```

## Swagger UI

The API documentation is defined in `openapi.json` and served using `swagger-ui-express`.

The Swagger UI provides access to all five task endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a task by ID
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

![Swagger UI](images/swagger-ui.png)

## API Testing with Swagger UI

The CRUD operations were tested directly through Swagger UI using the **Try it out** functionality.

### Get All Tasks

`GET /tasks` returns the current list of tasks with status `200 OK`.

![Get All Tasks](images/getAll.png)

### Get Task by ID

`GET /tasks/{id}` returns a specific task when a valid ID is provided.

A successful request returns `200 OK`.

![Get Task by ID](images/getById-success.png)

If the requested task does not exist, the API returns `404 Not Found`.

![Get Task Not Found](images/getById-error.png)

### Create a Task

`POST /tasks` creates a new task. The server assigns the next available ID and sets `done` to `false`.

A valid request returns `201 Created`.

![Create Task](images/post-success.png)

If the title is missing or empty, the API returns `400 Bad Request`.

![Create Task Validation](images/post-error.png)

### Update a Task

`PUT /tasks/{id}` can update the task title, completion status, or both.

A successful update returns `200 OK`.

![Update Task](images/put-success.png)

An empty or invalid request body returns `400 Bad Request`.

![Update Task Validation](images/put-error.png)

If the requested task does not exist, the API returns `404 Not Found`.

![Update Task Not Found](images/put-404.png)

### Delete a Task

`DELETE /tasks/{id}` removes an existing task.

A successful deletion returns `204 No Content`.

![Delete Task](images/delete-success.png)

If the requested task does not exist, the API returns `404 Not Found`.

![Delete Task Not Found](images/delete-error.png)

## Full CRUD Cycle

The complete CRUD cycle was tested successfully using Swagger UI:

1. Create a task using `POST /tasks`
2. List tasks using `GET /tasks`
3. Retrieve a task using `GET /tasks/{id}`
4. Update a task using `PUT /tasks/{id}`
5. Delete a task using `DELETE /tasks/{id}`

The API also correctly handles invalid request bodies and requests for tasks that do not exist.

## In-Memory Storage

Tasks are stored in an in-memory JavaScript array rather than a database.

This means that tasks created, updated, or deleted while the server is running are not permanently stored. Restarting the server restores the initial task list.