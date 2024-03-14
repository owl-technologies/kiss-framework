#!/usr/bin/env node --experimental-specifier-resolution=node

// import * as dotenv from "dotenv";
import cors from "cors";
import { EventEmitter } from 'events';
import express, { Request, Response } from "express";
import { KissServer } from "../kiss-web/Controller.js";
import { tictoc } from "../utils/tic-toc.js";
import { config } from "./config.js";


const logger = (req: Request, res: Response, next: Function) => {
  const tic = tictoc()
  next();
  const clientIp = req.ip;
  //signale.debug("%s %s %s", clientIp, req.method, req.url, req.path);
  tic.toc(`${clientIp}, ${req.method}, ${req.url}, ${req.path} status: ${res.statusCode}`)
};


// clear console, quite nice when nodemon is running
// console.clear();

// configure Event Emitter
EventEmitter.defaultMaxListeners = 300;

// configure express
const app = express();

// configure cors
app.use(cors());

// configure body parser
app.use(express.json()); // for parsing application/json

app.use(logger);

// app.use(express.static(config.staticRoute))

new KissServer(app, config);
