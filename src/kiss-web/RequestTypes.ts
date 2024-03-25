import { Request, Response } from "express";
import { IncomingMessage } from "http";
import { UrlWithParsedQuery, parse } from "url";
import { WebSocket } from "ws";
import { metadata } from "../utils/reflect-metadata.js";
export const ROUTES_KEY = Symbol("routes");

const httpMethodDeclarator = (
  httpMethod: HttpTypes,
  ...decoratorArgs: any[]
): Function => {
  return (
    method: Function,
    context: ClassMethodDecoratorContext
  ) => {
    const routes = metadata.getArray(context, ROUTES_KEY) as { httpMethod: HttpTypes, wrappedName: string | symbol }[];
    if (!routes) throw new Error(`routes metadata not found for ${String(context.name)}`);
    routes.push({ httpMethod, wrappedName: context.name });
    return function (this, req: Request, res: Response, next: Function, ...args) {
      const newArgs: any = []
      let responseInMethod = false; //If response is handled by the method do not do res.send()
      decoratorArgs.forEach((param) => {
        switch (param) {
          case Request:
            newArgs.push(req);
            break;
          case Response:
            newArgs.push(res);
            responseInMethod = true;
            break;
          default:
            if (typeof param === "string" || typeof param === "number") { // url param
              if (httpMethod === "get") {
                newArgs.push(req.query[param]);
              } else if (httpMethod === "post") {
                // check if request url has the parameter, otherwise try to get it from the body
                if (req.params[param]) {
                  newArgs.push(req.params[param]);
                } else {
                  newArgs.push(req.body[param]);
                }
              }
            }
        }
      })
      newArgs.push(...args);
      try {
        const result = method.apply(this, newArgs);
        if (result instanceof Promise) { // make sure to call res.send() and next() after the promise is resolved
          return result.then((r) => {
            r && !responseInMethod && res.send(r);
            next();
          }).catch((err) => {
            // next(err); //Middeleware error handling not working from here
            console.log(`Error executing async ${httpMethod}:${String(context.name)} error: ${err.message}`);
            console.log('httpMethodDeclarator', err);
            const response = {
              message: err.message,
              success: false
            }
            res.status(400).send(response);
            next();
          });
        } else {
          result && !responseInMethod && res.send(result);
          next();
          return result;
        }
      } catch (err) {
        // next(err); //Middeleware error handling not working from here
        console.log(`Error executing ${httpMethod}:${String(context.name)} error: ${(<any>err)['message']}`);
        console.log('httpMethodDeclarator', err);
        const response = {
          message: (<Error>err).message,
          success: false
        }
        res.status(500).send(response);
      }
    };

  };
};

/**
 * Post decorator uses express to route http-post requests to the decorated method. Provided parameters
 * will be resolved to the url arguments corresponding to the requested parameter names or fill
 * the provided Data Transfer Object (DTO). Any object with public properties (or setters) will work as DTO.
 * 
 * @param params : express.Request?, express.Response?, object | string[]. Either DTO to fill or names of arguments to extract from the url.
 * @returns a MethodDecorator function that is evaluated prior to method execution
 */
export const Post = (...params: any[]) =>
  httpMethodDeclarator("post", ...params);

/**
 * Get decorator uses express to route http-get requests to the decorated method. Provided parameters
 * will be resolved to the url arguments corresponding to the requested parameter names or fill
 * the provided Data Transfer Object (DTO). Any object with public properties (or setters) will work as DTO.
 *
 * @param params : express.Request?, express.Response?, object | string[]. Either DTO to fill or names of arguments to extract from the url.
 * @returns a MethodDecorator function that is evaluated prior to method execution
 */
export const Get = (...params: any[]) =>
  httpMethodDeclarator("get", ...params);

export type HttpTypes = "all" | "get" | "post" | "put" | "delete";


export const WS = (...decoratorArgs: any[]) => {

  return function (
    method: Function,
    context: ClassMethodDecoratorContext
  ) {
    const routes = metadata.getArray(context, ROUTES_KEY) as { httpMethod: HttpTypes | "ws", wrappedName: string | symbol }[];
    if (!routes) throw new Error(`routes metadata not found for ${String(context.name)}`);
    routes.push({ httpMethod: 'ws', wrappedName: context.name });
    return function (this, ...args) {
      // console.debug(`** Executing ws:${JSON.stringify(context.name)}(${args.length}-args), dis: ${JSON.stringify(this)} ws: ${args[0]} req: ${args[1]} `);
      // const dis = args[0];
      const ws: WebSocket = args[0];
      const req: IncomingMessage & { url: string } = args[1];
      // const newArgs = args.slice(0,2);
      const newArgs: any = []
      let parsedUrl: UrlWithParsedQuery = parse(req.url, true);
      decoratorArgs.forEach((param) => {
        if (param === WebSocket) {
          newArgs.push(ws);
        } else if (param === IncomingMessage) {
          newArgs.push(req);
        } else if (typeof param === "string" || typeof param === "number") { // url param
          // signale.star(`param: ${param}, req.params: ${JSON.stringify(req.params)}`);
          newArgs.push(parsedUrl.query[param]);
        } else if (param && !(typeof param === "string" || typeof param === "number")) { // DTO
          throw new Error("DTO not yet implemented");
        }
      })
      try {
        return method.call(this, ...newArgs);
      } catch (err) {
        // next(err); //Middeleware error handling not working from here
        console.log(`Error executing ws:${String(context.name)} error: ${(<any>err)['message']}`);
        return err; //TODO: handle error
      }
    }
  }
}
