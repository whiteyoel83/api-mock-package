# MockCustomAPI

## Overview

mockCustomAPI is a lightweight Node.js package that allows developers to quickly set up a mock API for development, unit testing, or integration testing. It supports all CRUD operations and provides validation middleware for API keys and authorization tokens.

## Features

- Supports the fourth basics HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Ability to define custom routes with mock responses.
- Middleware support for API key and authorization validation.
- Built-in CRUD functionality for dynamic resources.
- CORS support for cross-origin requests.
- Easy-to-use constructor for quick setup.
- Built-in request logging for debugging.
- Custom middleware support for advanced request handling.

## Installation

```sh
npm install mock-custom-api
```

## Usage

### Initializing the Mock API Server

```typescript
import MockAPI from "mock-custom-api";

const mockAPI = new MockAPI("MyMockAPI", 4000, true, true);
```

- The first parameter (`'MyMockAPI'`) is the application name.
- The second parameter (`4000`) is the port number. if you put undefined, the server will start on a 3000 port.
- The third parameter (`true`) enables CORS for all origins. You can also pass an array of allowed origins.
- The fourth parameter (`true`) is to allow create some defaults endpoints.

### Default Routes

The Mock API includes several default routes for common use cases. These routes are automatically added when the `createDefaultRoutes` parameter is set to `true` during initialization.

#### Default Routes List

- `GET /health` - Returns a 200 response with a message indicating the server is running.
- `GET /route-get` - Returns a 200 response with a list of items.
- `POST /route-create` - Returns a 201 response indicating an item was created.
- `PUT /route-update` - Returns a 200 response indicating an item was updated.
- `DELETE /route-delete` - Returns a 200 response indicating an item was deleted.
- `GET /secure-route-x-api-key` - Returns a 200 response if a valid API key is provided.
- `GET /secure-route-authorization` - Returns a 200 response if a valid authorization token is provided.
- `GET /token` - Returns a 200 response with a randomly generated token.
- `POST /login-success` - Returns a 200 response with a token for successful login.
- `POST /login-error` - Returns a 401 response with an error message for failed login.

#### Example Usage

```javascript
// Fetch a random token
fetch("http://localhost:3000/token")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Simulate a successful login
fetch("http://localhost:3000/login-success", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "user", password: "pass" }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Simulate a failed login
fetch("http://localhost:3000/login-error", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "user", password: "wrong-pass" }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Adding Custom Routes

You can define custom API routes with predefined responses.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/test",
  response: { message: "Test success" },
});
```

### Adding Custom Routes With Authentication Middleware

You can secure routes with API key or token-based authentication.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/protected",
  response: { message: "Protected route" },
  validationType: "apiKey",
  validationValue: "my-secret-key",
});
```

- `validationType: 'apiKey'` ensures that requests must include `x-api-key: my-secret-key` in the headers.

```typescript
mockAPI.addRoute({
  method: "GET",
  path: "/secured",
  response: { message: "Protected route" },
  validationType: "authorization",
  validationValue: "secret-token",
});
```

- `validationType: 'authorization'` ensures that requests must include `authorization: secret-token` in the headers.

### Adding CRUD Routes

The `addCrudRoutes` method allows you to quickly set up CRUD (Create, Read, Update, Delete) endpoints for a specific resource. This is useful for mocking APIs with dynamic resources.

#### Syntax

```typescript
mockAPI.addCrudRoutes<T>({
  name: string,
  interface: T,
  randomData: boolean,
});
```

- `name`: The name of the resource (e.g., "users"). This will be used as the base path for the endpoints.
- `interface`: The TypeScript interface defining the structure of the resource.
- `randomData`: A boolean indicating whether to generate random data for the resource.

#### Example

```typescript
interface IUser {
  id: string;
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

mockAPI.addCrudRoutes<IUser>({
  name: "users",
  interface: {
    id: "",
    name: "",
    age: 0,
    email: "",
    isActive: false,
  },
  randomData: true,
});
```

This will generate the following endpoints:

- `GET /users` - Retrieve a list of users.
- `POST /users` - Create a new user.
- `PUT /users` - Update an existing user.
- `DELETE /users` - Delete a user.

#### Example API Calls Using Fetch

```javascript
// Fetch all users
fetch("http://localhost:4000/users")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Create a new user
fetch("http://localhost:4000/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "1",
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    isActive: true,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Update a user
fetch("http://localhost:4000/users", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "1",
    name: "Jane Doe",
    age: 25,
    email: "jane.doe@example.com",
    isActive: false,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Delete a user
fetch("http://localhost:4000/users", {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

#### Notes

- The `randomData` option generates random data for the resource if set to `true`. This is useful for testing purposes.
- The `interface` parameter ensures that the resource structure adheres to the specified TypeScript interface.

### Starting the Mock API Server

```typescript
mockAPI.start();
```

### Stopping the Mock API Server

```typescript
mockAPI.stop();
```

This starts the API server on the specified port.

### Example API Calls Using Fetch

```javascript
fetch("http://localhost:4000/test")
  .then((response) => response.json())
  .then((data) => console.log(data));

fetch("http://localhost:4000/protected", {
  headers: { "x-api-key": "my-secret-key" },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Running Tests

```sh
npm test
```

## License

MIT
