import { Request, Response } from "express";
import { Types } from "mongoose";

export class BaseController {
    
    public user?: Types.ObjectId

    constructor(request: Request, response: Response){
        
    }
}
enum RouteTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}
type AnyPluginMidleware = Array<any>
type RouteMethods = {
    [key in RouteTypes]?: { [x: string]: [any, string] }
}
type RouteEndpoints = {
    [path: string]: RouteMethods
}
export type RoutePaths = {
    plugin?: AnyPluginMidleware,
    middleware: AnyPluginMidleware,
    ExpressConfig?: any,
    routes?: RouteEndpoints
}