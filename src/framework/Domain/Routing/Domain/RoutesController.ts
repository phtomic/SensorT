import { Express, Request, Response } from "express";
import * as http from "http"
import { BaseController } from "./BaseController";
export class RoutesController {

    private Router: Express;
    private server: http.Server
    constructor(router: Express, routes: Object) {
        this.Router = router;
        this.server = http.createServer(router)
        this.initRoutes(routes);
    }

    public listen(port: number) {
        this.server.listen(port);
    }

    public getServer() {
        return this.server
    }

    private initRoutes(routes: Object) {
        
        const apiMiddlewares: Array<any> = routes['middleware'] || []
        const apiPlugins: Array<any> = routes['plugin'] || []
        if(apiPlugins.length>0){
            apiPlugins.forEach(Class => {
                new Class(this.server).handle()
            });
        }
        if (routes['ExpressConfig']) {
            Object.keys(routes['ExpressConfig']).forEach((config) => {
                routes['ExpressConfig'][config].forEach((element: any) => {
                    this.Router[config.toLowerCase()](element[0], element[1])
                });
            })
        }
        
        Object.keys(routes['routes']).forEach((prefix) => {
            try {
                let path = routes['routes'][prefix]
                if (!Array.isArray(path) && typeof path === "object") {
                    Object.keys(path).forEach(routeType => {
                        Object.keys(path[routeType]).forEach(async (route) => {
                            let routeTypeMiddlewares = [
                                ...apiMiddlewares,
                                ...path?.middlewares || []
                            ]
                            let tmp = path?.[routeType]?.[route]
                            if (routeType == "redirect")
                                return this.Router[tmp[0].toLowerCase()]('/' + route, (req: Request, res: Response) => {
                                    res.redirect(tmp[1])
                                });

                            if (tmp[0] === undefined) return;
                            const middlewares = [
                                ...routeTypeMiddlewares,
                                ...tmp[2]?.middlewares || []
                            ]
                            let pointer = `/${prefix}/${route}`
                            middlewares.forEach((middleware) => {
                                this.Router.use(pointer, async (req, res, next) => {
                                    try{
                                        if (await (new middleware()).handle()) next();
                                        else res.status(500);
                                    } catch (err: any) {
                                        console.error(err)
                                        res.status(500).send(err)
                                    }
                                })
                            })
                            this.Router[routeType.toLowerCase()](
                                pointer,
                                async (request: Request, response: Response) => {
                                    try {
                                        const c = new tmp[0](request, response)
                                        if (!(c instanceof BaseController)) return console.info(`${tmp[0].name} not a controller class`);
                                        if (c[tmp[1]] == undefined) return console.info(`Route not found: ${tmp[0].name} - ${tmp[1]}`);
                                        c[tmp[1]](request, response)
                                    } catch (err: any) {
                                        console.error(err)
                                        response.status(500).send(err)
                                    }
                                }
                            );
                        })
                    })
                } else if (Array.isArray(path)) {
                    this.Router[path[0].toLowerCase()](path[1], (request: Request, response: Response) => path[2](request, response))
                }
            } catch (err) {
                console.log(err)
            }
        })
    }
}