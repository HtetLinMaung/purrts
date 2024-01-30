import bodyParser from "body-parser";
import cors from "cors";
import { RequestHandler } from "express";

export interface IRunOptions {
  port?: number;
  workers?: number;
  corsOptions?: cors.CorsOptions;
  bodyParserOptions?: bodyParser.OptionsJson;
  routesFolderPath?: string;
}

export interface IRouteMetadata {
  method?: string;
  middlewares?: RequestHandler[];
}
