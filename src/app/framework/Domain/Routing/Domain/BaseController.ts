import { Request, Response } from "express";
import { Types } from "mongoose";

export class BaseController {
    
    public user?: Types.ObjectId

    constructor(request: Request, response: Response){
        
    }
}