import { Request, Response } from 'express';
import { SocketIoController } from '../Domain/SocketIoController';
import { Server } from 'socket.io';
import { uuid } from '../../Plugins/UUIDGenerator';
let globalWithSocket = global as typeof globalThis & {
    socketio: SocketIoController;
};
export class SocketTask {
    private tasks: Array<{
        task: string,
        req: Request,
        res: Response,
        callback: () => void
    }> = [];
    private isRunning = false
    constructor() {
        if (!globalWithSocket.socketio) globalWithSocket.socketio = new SocketIoController()
    }
    public setIo(io: Server){
        globalWithSocket.socketio.setIo(io)
    }
    public task(res: Response, callback?: (req: Request, res: Response) => void): { send: (toast: any) => void, end: (toast?: any) => void } {
        let task = uuid()
        return {
            send: (toast: any) => {
                globalWithSocket.socketio.emit(res.locals.user, { task, ...toast })
            },
            end: (toast?: any) => {
                if (toast) globalWithSocket.socketio.emit(res.locals.user, { task, ...toast })
                if (callback) callback(res.req, res)
            }
        }
    }
}

export function task(res: Response, callback?: (req: Request, res: Response) => void): { send: (toast: any) => void, end: (toast?: any) => void } {
    return new SocketTask().task(res, callback)
}