import { Server, Socket } from 'socket.io';
import Notifications from '../../../../models/Notifications';
export class SocketIoController {
    private io?: Server
    private connections: Array<{ user: string, socket: Socket, id: string }> = []
    constructor() {
    }
    public emit(event: string, ...args: Array<any>) {
        let io = this.io
        if (this.io) {
            Notifications().create({
                token: event,
                task: args[0]?.task,
                title: args[0]?.title || "Sistema",
                message: args[0]?.message || "Erro no envio da mensagem",
                delay: args[0]?.delay || 3000,
                link: args[0]?.link,
                data: args[0]?.data,
                type: args[0]?.type,
                active: true
            })
            let client = this.connections.find(c => c.user == event)
            if (client) io!.to(client.id).emit(event, args)
        }
    }
    public setIo(io: Server) {
        io.on("connection", (socket) => {
            socket.on("usr", (userToken) => {
                let exist = this.connections.findIndex(conn => userToken == conn.user)
                let param = {
                    user: userToken,
                    socket: socket,
                    id: socket.id
                }
                if (exist >= 0) {
                    this.connections[exist] = param
                } else {
                    this.connections.push(param)
                }
            })
            socket.on("receivedTask", (task) => {
                Notifications().findOneAndUpdate({ task: task }, { active: false }).exec()
            })
            socket.on("disconnect", (reason) => {
                let disconnected = this.connections.findIndex(sck=>sck.id==socket.id)
                if(disconnected>=0) this.connections.splice(disconnected,1)
            });
        })
        this.io = io
    }
}