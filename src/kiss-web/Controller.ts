import { Application } from "express";
import fs from "fs";
import { Server } from "http";
import https from "https";
import path from "path";
import { WebSocketServer } from 'ws';
import { Constructor } from "../kiss-data/decorators/types.js";
import { isConstructor } from "../utils/is-constructor.js";
import { metadata } from "../utils/reflect-metadata.js";
import { HttpTypes, ROUTES_KEY } from "./RequestTypes.js";


export const CONTROLLER_KEY = Symbol();

export const Controller = <T extends Constructor<any>>(target: T, context: ClassDecoratorContext) => {
    // signale.debug(`Controller decorator for ${target.name}`);
    // context.constructor[Symbol['metadata']] ??= {};
    // context.constructor[Symbol['metadata']]["isController"] = true;
    metadata.get<boolean>(context, "isController", true);
    metadata.get<string>(context, "name", context.name);
    return class extends (target as Constructor<any>) {
        constructor(...args: any) {
            // console.log("Service constructor");
            if (!target.prototype[CONTROLLER_KEY]) {
                // console.log("Controller is a singleton");
                super(...args);
                target.prototype[CONTROLLER_KEY] = this;
            }
            return target.prototype[CONTROLLER_KEY] as T;
        }
    } as typeof target
};

export class KissServer {

    baseDir: string;

    server: Server;

    private _wsServer: WebSocketServer;

    constructor(private app: Application, conf: { port: number, enableHttps: boolean, keyFile: string, certFile: string, webRoute: string }) {
        this.baseDir = conf.webRoute;
        // start http/s server
        if (conf.enableHttps) {
            const keyFile = fs.readFileSync(conf.keyFile);
            const certFile = fs.readFileSync(conf.certFile);
            const options = { key: keyFile, cert: certFile };
            this.server = https.createServer(options, app).listen(conf.port, () => console.log(`KissServer is listening on port ${conf.port}!`));
        } else {
            this.server = app.listen(conf.port, () => console.log(`KissServer is listening on port ${conf.port}!`));
        }
        this.importControllerFiles();
    }


    importControllerFiles = async (relPath: string = "/") => {
        // console.log("importing controllers from", relPath);
        const fullDirPath = path.join(this.baseDir, relPath);
        const entries = fs.readdirSync(fullDirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(fullDirPath, entry.name);
            if (entry.isDirectory()) {
                const newRelPath = path.join(relPath, entry.name);
                await this.importControllerFiles(newRelPath); // Recursively traverse subdirectories
            } else if (
                entry.isFile() &&
                (entry.name.endsWith(".controller.js") ||
                    entry.name.endsWith(".service.js") ||
                    entry.name.endsWith(".controller.ts") ||
                    entry.name.endsWith(".service.ts")
                )
            ) {
                const controllerModule = await import(path.resolve(fullPath));
                Object.values(controllerModule).forEach((topLvlExport) => {
                    if (
                        isConstructor(topLvlExport) &&
                        metadata.get<boolean>(<Constructor<any>>topLvlExport, "isController")
                    ) {
                        const ctr = new (topLvlExport as Constructor<any>)();
                        const orgClass = metadata.get<string>(ctr, "name");
                        // let routes = ctr.__routes__ || [];
                        const routes = metadata.getArray(<Constructor<any>>topLvlExport, ROUTES_KEY) as { httpMethod: HttpTypes | "ws", wrappedName: string | symbol }[];

                        for (let route of routes) {
                            const w = ctr[route.wrappedName]; //.bind(ctr) bind does not work with decorators :(
                            if (w) {
                                //add filename to relPath
                                //remove suffix controller.ts
                                const routePath = (relPath === '/' ? relPath : relPath + '/') + entry.name.replace(/\.controller\.(t|j)s$/, '');
                                if (route.httpMethod === "ws") {
                                    this.server.on("upgrade", ((req, s, head) => {
                                        console.log(`-----------Websocket upgrade request for ${routePath}---------------`);
                                        const wss = new WebSocketServer({ noServer: true });
                                        wss.on("connection", ((client, request) => {
                                            w(ctr, client, request);
                                        }).bind(this));
                                        wss.handleUpgrade(req, s, head, ((client, request) => {
                                            wss.emit("connection", client, request);
                                        }));
                                        process.on('SIGINT', async () => {
                                            console.log();
                                            console.log('Received SIGINT signal. Closing open sockets...');
                                            await wss.close();
                                            console.log(`open socket closed successfully`);
                                        });
                                    }).bind(this));
                                    // ws(routePath, (ws, req) => w(ctr, ws, req));
                                } else {
                                    this.app[route.httpMethod](routePath, (req, res, next) => w(ctr, req, res, next));
                                }
                                console.log(
                                    `Registered - ${routePath}:${route.httpMethod} to ${orgClass}.${String(route.wrappedName)}()`
                                );
                            } else {
                                console.log(`Warning - route method for ${route.httpMethod}:${relPath} to ${(<Constructor<any>>topLvlExport).prototype.name} not found`)
                            }
                        }
                    }
                });
            }
        }
    }
}