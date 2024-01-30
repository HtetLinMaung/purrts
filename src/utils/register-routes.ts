import { Application } from "express";
import { IRouteMetadata } from "../types";
import findFiles from "./find-files";
import parseRoutePath from "./parse-route-path";
import { log } from "starless-logger";
import fs from "fs";

export default async function registerRoutes(
  app: Application,
  port: number,
  routesFolderPath: string
) {
  if (fs.existsSync(routesFolderPath)) {
    const routes = await findFiles(routesFolderPath);
    routes.sort((a, b) => a.localeCompare(b));
    for (const route of routes) {
      if (route.endsWith(".js")) {
        const parseResult = parseRoutePath(route, routesFolderPath);
        const module = await import(parseResult.filepath);
        // console.log(module);
        const metadata: IRouteMetadata = module.metadata;

        const dynamicUrl = parseResult.url.replace(/\[([^\]]+)\]/g, ":$1");

        let method = "use";

        if (typeof module.default == "function") {
          app.use(dynamicUrl, module.default);
        } else {
          if (metadata) {
            const middlewares = metadata.middlewares || [];
            method = metadata.method || "use";
            (app as any)[method](
              dynamicUrl,
              ...[...middlewares, module.handler]
            );
          } else {
            app.use(dynamicUrl, module.handler);
          }
        }

        log(
          `[${method
            .replace("use", "get, post, put, patch, delete")
            .toUpperCase()}] http://localhost:${port}${dynamicUrl}`
        );
      }
    }
  }
}
