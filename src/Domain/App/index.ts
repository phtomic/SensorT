'use strict';
import { Request, Response, Express } from 'express';
import express from 'express';
import {
    getStorage,
    SessionStorage,
    setStorage,
} from '../Routing/Plugins/SessionStorage';
import { createServer } from 'http';
import { NextFunction } from 'express-serve-static-core';

enum RouteTypes {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}
type AnyPluginMidleware = Array<any>;
type RequestCallback = (request?: Request, response?: Response) => Promise<any>;
type ConfigRequest = {
    name?: string,
    withoutMiddleware?: AnyPluginMidleware,
}
export class Routing {
    private plugins: AnyPluginMidleware = [];
    public endpoints: Array<[string, string, Array<() => Promise<any>>] | Routing> = []
    private middlewares: AnyPluginMidleware = [];
    private path: string = '';
    private controller: Express;
    constructor(
        path?: string,
        middlewares?: AnyPluginMidleware,
        plugins?: AnyPluginMidleware,
        controller?: Express,
    ) {
        this.path = path || '';
        this.middlewares = middlewares || [];
        this.plugins = plugins || [];
        this.controller = controller || express();
    }
    public groupMiddleware(middlewares: AnyPluginMidleware) {
        const endpoints = new Routing(
            this.path,
            [...this.middlewares, ...middlewares],
            this.plugins,
        )
        this.endpoints.push(endpoints)
        return endpoints;
    }
    public groupPlugins(plugins: AnyPluginMidleware) {
        const endpoints = new Routing(this.path, this.middlewares, [...this.plugins, ...plugins])
        this.endpoints.push(endpoints);
        return endpoints
    }
    public group(path: string) {
        const endpoints = new Routing(this.getCleanPath(path), this.middlewares, this.plugins);
        this.endpoints.push(endpoints);
        return endpoints;
    }

    public get(
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        return this.newRoute(RouteTypes.GET, path, callback, config);
    }
    public post(
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        return this.newRoute(RouteTypes.POST, path, callback, config);
    }
    public delete(
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        return this.newRoute(RouteTypes.DELETE, path, callback, config);
    }
    public patch(
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        return this.newRoute(RouteTypes.PATCH, path, callback, config);
    }
    public put(
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        return this.newRoute(RouteTypes.PUT, path, callback, config);
    }
    private getCleanPath(path: string) {
        let tmpPath = ''
        path = path.trim()
        if (this.path.length !== 0) tmpPath = `${this.path}/`
        if (path.startsWith('/')) path = path.substring(1)
        if (path.endsWith('/')) path = path.substring(0, path.length - 1)
        return `${tmpPath.startsWith('/') ? '' : '/'}${tmpPath}${path}`;
    }
    private newRoute(
        type: RouteTypes,
        path: string,
        callback: RequestCallback,
        config: ConfigRequest = {},
    ) {
        const execs = this.middlewares.filter(
            (middleware) => !(config.withoutMiddleware || []).find((md) => md === middleware),
        ).map((middleware) => () => new middleware().handle());
        execs.push(() => callback());
        this.endpoints.push([type.toLowerCase(), this.getCleanPath(path), execs])
        return this;
    }
    public router() {
        return this.controller;
    }
    public start(port: number = 8000) {
        const endpoints: Array<any> = []
        this.controller.use((req: Request, res: Response, next: NextFunction) => {
            try {
                SessionStorage(async () => {
                    res.header("X-Powered-By", "SensorT")
                    setStorage('request', req);
                    setStorage('response', res);
                    setStorage('originalUrl', req?.originalUrl);
                    setStorage('access-origin', req.headers.origin);
                    next();
                });
            } catch (err) {
                if (!res.headersSent) res.status(500).send(err);
            }
        })
        const load = (e) => {
            if (e instanceof Routing) e.endpoints.forEach(load);
            else endpoints.push(e);
        }
        this.endpoints.forEach(load)
        endpoints.forEach((endpoint) => {
            this.controller[endpoint[0]](endpoint[1], async (req: Request, res: Response) => {
                const execs = Array.from<any>(endpoint[2])
                while (execs.length > 0) {
                    if (res.headersSent) return;
                    const cb = execs.shift();
                    if (cb) await cb();
                }
            })
        })

        const server = createServer(this.controller)
        this.plugins.forEach(async (Plugin) => {
            new Plugin().handle(server);
        });
        server.listen(port, () => {
            console.info(`Listening :${port}`)
        });
        return this;
    }
}
export function request(): Request {
    return getStorage<Request>('request') as Request;
}
export function response(): Response {
    return getStorage<Response>('response') as Response;
}
export function getAccessOrigin(): string {
    return getStorage<string>('access-origin');
}
export function getOriginalUrl(): string {
    return getStorage<string>('originalUrl');
}
