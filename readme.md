# PurrTS: Simplified Express Application Framework

PurrTS is a lightweight framework designed to simplify the setup and scalability of Express applications. It offers an easy way to bootstrap your Express app with essential features like CORS, JSON body parsing, centralized error handling, and automatic route registration. PurrTS also supports running your application in a clustered environment to take full advantage of multi-core systems.

## Features

- `Easy Setup`: Quickly set up an Express application with sensible defaults.
- `Automatic Route Registration`: Automatically register routes from a specified directory.
- `Cluster Support`: Run your application across multiple CPU cores for increased performance.
- `Customizable`: Easily configure CORS, body parser options, and more.
- `Centralized Error Handling`: Provides a built-in error handling middleware for consistent error responses.

## Installation

To install PurrTS, use npm:

```bash
npm install purrts
```

Or with yarn:

```bash
yarn add purrts
```

## Getting Started

First, import `PurrApplication` from `purrts` and create a new Express application instance:

```ts
import { PurrApplication } from "purrts";

const app = PurrApplication.create();
```

## Running the Application

To run your application, call `PurrApplication.run` with your app instance and an optional configuration object:

```ts
PurrApplication.run(app, {
  port: 3000, // Optional: default is 3000
  workers: cpus().length, // Optional: default is the number of CPU cores
  routesFolderPath: "./src/routes", // Optional: default is './routes'
  corsOptions: {}, // Optional: default CORS configuration
  bodyParserOptions: {}, // Optional: default body parser configuration
});
```

## Configuration Options

The run method accepts an optional `IRunOptions` object with the following properties:

- `port`: The port number on which the Express server will listen (default: 3000).
- `workers`: The number of cluster workers to spawn for the application. Use 1 to run in single-threaded mode or omit for automatic scaling based on CPU cores.
- `routesFolderPath`: The path to the folder containing your route modules (default: './routes').
- `corsOptions`: Configuration options for CORS middleware.
- `bodyParserOptions`: Configuration options for the body-parser middleware.

## Route Modules

Route modules should export a handler function that handles the route and optionally an `IRouteMetadata` object named metadata for additional route configuration:

```ts
// Example route module: src/routes/hello.js

export const handler = function (req, res) {
  res.send("Hello, World!");
};

export const metadata = {
  method: "get", // HTTP method
  middlewares: [], // Array of Express middlewares
};
```

## Error Handling

PurrTS includes a default error handling middleware that catches any thrown errors and sends a formatted JSON response. You can throw errors in your route handlers, and they will be caught by this middleware:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ code: status, message });
});
```

## Advanced Usage

For more advanced scenarios, such as custom initialization procedures or middleware, you can set them up before calling `PurrApplication.run`.

## Example

Here's a complete example of setting up a PurrTS application:

```ts
import { PurrApplication } from "purrts";

// Create a new Express application
const app = PurrApplication.create();

// Add any custom middleware or routes here
app.get("/custom", (req, res) => res.send("Custom Route"));

// Run the application
PurrApplication.run(app, {
  port: 3000,
  workers: 2, // Adjust as needed
});
```

This example creates an Express application, adds a custom route, and then runs the application with PurrTS, leveraging two worker processes for improved performance on multi-core systems.

## Support

For questions, issues, or contributions, please refer to the PurrTS GitHub repository.
