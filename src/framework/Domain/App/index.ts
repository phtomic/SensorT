'use strict';
import { Request, Response } from 'express';
import {
    getStorage,
    SessionStorage,
    setStorage,
} from '../Routing/Plugins/SessionStorage';
import { ExpressController } from '../Routing/Domain/ExpressController';
enum RouteTypes {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}
type AnyPluginMidleware = Array<any>;
type RequestCallback = (request?: Request, response?: Response) => Promise<any>;
export class Routing {
    private plugins: AnyPluginMidleware = [];
    private middlewares: AnyPluginMidleware = [];
    private path: string = '';
    private controller: ExpressController;
    constructor(
        path?: string,
        middlewares?: AnyPluginMidleware,
        plugins?: AnyPluginMidleware,
        controller?: ExpressController,
    ) {
        this.path = path || '';
        this.middlewares = middlewares || [];
        this.plugins = plugins || [];
        this.controller = controller || (new ExpressController());
    }
    public groupMiddleware(middlewares: AnyPluginMidleware) {
        return new Routing(
            this.path,
            [...this.middlewares, ...middlewares],
            this.plugins,
        );
    }
    public groupPlugins(plugins: AnyPluginMidleware) {
        return new Routing(this.path, this.middlewares, [...this.plugins, ...plugins]);
    }
    public group(path: string) {
        return new Routing(this.getCleanPath(path), this.middlewares, this.plugins);
    }

    public get(
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        return this.newRoute(RouteTypes.GET, path, callback, name, without);
    }
    public post(
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        return this.newRoute(RouteTypes.POST, path, callback, name, without);
    }
    public delete(
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        return this.newRoute(RouteTypes.DELETE, path, callback, name, without);
    }
    public patch(
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        return this.newRoute(RouteTypes.PATCH, path, callback, name, without);
    }
    public put(
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        return this.newRoute(RouteTypes.PUT, path, callback, name, without);
    }
    private getCleanPath(path: string){
        let tmpPath = ''
        path = path.trim()
        if(this.path.length!==0) tmpPath = `${this.path}/`
        if(path.startsWith('/')) path = path.substring(1)
        if(path.endsWith('/')) path = path.substring(0, path.length -1)
        return `${tmpPath}${path}`;
    }
    private newRoute(
        type: RouteTypes,
        path: string,
        callback: RequestCallback,
        name?: string,
        without?: AnyPluginMidleware,
    ) {
        
        this.controller.getRouter()[type.toLowerCase()](this.getCleanPath(path), (req: Request, res: Response) => {
            SessionStorage(async () => {
                setStorage('request', req);
                setStorage('response', res);
                setStorage('originalUrl', req?.originalUrl);
                setStorage('access-origin', req.headers.origin);
                const execs = this.middlewares
                    .filter(
                        (middleware) => !(without || []).find((md) => md === middleware),
                    )
                    .map((middleware) => () => new middleware().handle(req, res));
                execs.push(() => callback(req, res));
                while (execs.length > 0) {
                    const cb = execs.shift();
                    if (cb) cb();
                }
                if (!res.headersSent) res.send(204);
            });
        });
        return this;
    }
    public router() {
        return this.controller.getRouter();
    }
    public use(callback: any) {
        this.controller.getRouter().use(callback);
        return this;
    }
    public start(port: number = 8000) {
        this.plugins.forEach(async (Plugin) => {
            new Plugin().handle(this.controller);
        });
        this.controller.getRouter().listen(port);
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
