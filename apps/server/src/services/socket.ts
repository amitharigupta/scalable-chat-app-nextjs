import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host: 'redis-7c837b1-amitgt9967-6a43.a.aivencloud.com',
    port: 23645,
    username: 'default',
    password: 'AVNS_vlSfHJD8dIM8fhlRXS4'
});

const sub = new Redis({
    host: 'redis-7c837b1-amitgt9967-6a43.a.aivencloud.com',
    port: 23645,
    username: 'default',
    password: 'AVNS_vlSfHJD8dIM8fhlRXS4'
});

class SocketService {

    private _io: Server;

    constructor() {
        console.log("Init Socket Service....");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe('MESSAGES');
    }

    public initListeners() {
        const io = this.io;
        console.log(`Init socket listners...`);
        io.on("connect", socket => {
            console.log(`New Socket Connected $${socket.id}`);

            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log(`New message recieved... ${message}`); 
                // publish this message to redis
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
        });

        sub.on("message", (channel, message) => {
            if(channel === 'MESSAGES') {
                io.emit('message', message);
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;