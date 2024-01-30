import express, { Application, NextFunction, Request, Response } from "express";
import cluster from "cluster";
import { cpus } from "os";
import { IRunOptions } from "./types";
import { log } from "starless-logger";
import { IncomingMessage, Server, ServerResponse } from "http";
import cors from "cors";
import registerRoutes from "./utils/register-routes";
import { defaultRoutesFolderPath } from "./constants";

async function bootstrap(
  app: Application,
  options?: IRunOptions,
  callback?:
    | ((server: Server<typeof IncomingMessage, typeof ServerResponse>) => void)
    | undefined
) {
  const corsOptions = options ? options.corsOptions : undefined;
  const bodyParserOptions = options ? options.bodyParserOptions : undefined;
  const port = options ? options.port || 3000 : 3000;
  const routesFolderPath = options
    ? options.routesFolderPath || defaultRoutesFolderPath
    : defaultRoutesFolderPath;

  app.use(cors(corsOptions));
  app.use(express.json(bodyParserOptions));

  await registerRoutes(app, port, routesFolderPath);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error!";
    const data = err.data;
    if (data) {
      res.status(status).json(data);
    } else {
      res.status(status).json({
        code: status,
        message,
      });
    }
  });

  const server = app.listen(port, () => {
    if (callback) {
      callback(server);
    }
  });
}

export class PurrApplication {
  static create() {
    return express();
  }

  static async run(
    app: Application,
    options?: IRunOptions,
    callback?:
      | ((
          server: Server<typeof IncomingMessage, typeof ServerResponse>
        ) => void)
      | undefined
  ) {
    const workers = options ? options.workers : undefined;

    if (workers == 1) {
      await bootstrap(app, options, callback);
    } else {
      if (cluster.isPrimary) {
        // Adjust based on Node.js version
        const numCPUs = workers || cpus().length;

        log(`Master process is running with PID: ${process.pid}`);

        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
          log(
            `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
          );
          log("Starting a new worker");
          cluster.fork();
        });
      } else {
        await bootstrap(app, options, callback);
      }
    }
  }
}

// const app = PurrApplication.create();
// PurrApplication.run(app, { workers: 1 });
