# Task API

A simple in-memory CRUD API built with Node.js and Express. The API allows tasks to be created, retrieved, updated, and deleted. Swagger UI is used to provide interactive API documentation and testing.

## Swagger UI

Swagger UI is available at:

`http://localhost:3000/docs`

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

## Stage 5 Result

Swagger UI successfully documents all five task endpoints and allows the complete CRUD cycle to be performed without curl:

1. Create a task using `POST /tasks`
2. List tasks using `GET /tasks`
3. Retrieve a task using `GET /tasks/{id}`
4. Update a task using `PUT /tasks/{id}`
5. Delete a task using `DELETE /tasks/{id}`

The API also correctly handles validation errors and requests for tasks that do not exist.
