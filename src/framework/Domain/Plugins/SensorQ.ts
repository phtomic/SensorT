import client, { Channel, Connection } from "amqplib";
import * as ConsumerList from "../../../app/config/amqp";
import BaseModel, { DBConnectionPool } from "../Database/Domain/BaseModel";
import { sleep_async } from "../App/Globals";
import { concat } from "lodash";
class MQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
    private config: SensorQConnectionConfig;
    constructor(connection: MQPool) {
        this.config = ConsumerList.MQ_CONFIG[connection]
    }
    async connect() {
        if (this.connected || this.channel) return;
        else this.connected = true;
        if (this.config.driver == 'mongo') {
            return;
        } else if (this.config.driver == 'rabbitmq') {
            try {
                const connUser = this.config.user || ''
                const connHost = this.config.host || 'localhost'
                const connPass = this.config.pass || ''
                const connPort = this.config.port || '5672'
                this.connection = await client.connect(
                    `amqp://${connUser}:${connPass}@${connHost}:${connPort}`
                );
                this.channel = await this.connection.createChannel();
            } catch (error) {
                console.error(error);
                console.error(`Not connected to MQ Server`);
            }
        }
    }

    async queue(queue: string, message: any, options?: MqOptions) {
        if (this.config.driver == 'mongo') {
            await Queue(this.config.prefix || 'sensorq')().create({
                message,
                queue,
                route: options?.route || queue,
                vhost: this.config.vhost || '/',
                timeout: options?.timeout || 1000 * 60 * 5, // Default 5 Minutes
                status: InQueueStatus.WAITING,
                ack_expiration: 0
            })
            return true
        }
        else if (this.config.driver == 'rabbitmq') {
            try {
                if (!this.channel) await this.connect();
                return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    }

    async consume(queue: string, QueueConsumer: Consumer) {
        if (this.config.driver == 'mongo') {
            const queue_model = Queue(this.config.prefix || 'sensorq')()
            while (true) {
                const msg = await queue_model.findOneAndUpdate({
                    route: queue,
                    locked: false,
                    $or: [
                        { ack_expiration: { $not: { $gte: Date.now() } }, status: InQueueStatus.NOACK },
                        { status: InQueueStatus.WAITING }
                    ]
                }, { locked: true, status: InQueueStatus.WAITING })
                if (msg) {
                    msg.ack_expiration = Date.now() + msg.timeout
                    await msg.save();
                    msg.status = InQueueStatus.WAITING;
                    await QueueConsumer.handle(msg.message, queue_methods(
                        () => queue_model.deleteById(msg._id),
                        () => msg.save()
                    ))
                } else await sleep_async(1000)
            }
        } else if (this.config.driver == 'rabbitmq') {
            if (!this.channel) await this.connect();
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.consume(queue,
                async (msg) => {
                    if (!msg) return console.error(`Invalid incoming message`);
                    await QueueConsumer.handle(msg.content.toString(), queue_methods(
                        async () => this.channel.ack(msg),
                        async () => this.channel.reject(msg)
                    ))
                },
                { noAck: !QueueConsumer.ack || false }
            );
        }
    }
}
const queue_methods = (ack: () => Promise<any>, reject: () => Promise<any>) => ({
    ack,
    reject,
})
type MQPool = keyof typeof ConsumerList.MQ_CONFIG
const MQDefaultPool = Object.keys(ConsumerList.MQ_CONFIG)[0]
class Consumer {
    public queue_name!: string;
    public consumer_name!: string;
    public connection: MQPool = MQDefaultPool;
    public ack = true;
    public async handle(msg: string, f: { ack: () => void, reject: () => void }): Promise<boolean> { return true }
}
export type SensorQConsumerList = Array<typeof Consumer>
type SensorQConnectionConfig = {
    user?: string,
    pass?: string,
    host?: string,
    port?: number,
    driver: 'rabbitmq'
} | {
    driver: 'mongo',
    connection?: DBConnectionPool,
    // Default is sensorq_
    prefix?: string,
    watch_interval_ms?: number
} & { vhost?: string }
type MqOptions = {
    connection?: MQPool,
    route?: string,
    timeout?: number
}
export type SensorQConfig = {
    [x: string]: SensorQConnectionConfig
}
function consume(queue?: string, options?: MqOptions) {
    const mq = new MQConnection(options?.connection || MQDefaultPool)
    const queue_exist = (queue?.length || 0) > 0
    ConsumerList.default
        .filter(c => c)
        .map(consumer => new consumer())
        .filter(consumer => consumer.consumer_name == (queue_exist ? queue : consumer.consumer_name))
        .forEach(consumer => {
            if (
                consumer.consumer_name &&
                consumer.queue_name
            )
                mq.consume(consumer.queue_name, consumer)
        })
}
function send(queue: string, message: any, options?: MqOptions) {
    return new MQConnection(options?.connection || MQDefaultPool).queue(queue, message, options)
}
const SensorQ = {
    consume,
    send,
    Consumer,
};
enum InQueueStatus {
    WAITING = 'waiting',
    NOACK = 'noack',
    ACK = 'ack',
}
const Queue = (model_name: string) => new class extends BaseModel<{
    queue: string,
    route: string,
    message: string,
    status: InQueueStatus,
    ack_expiration: number,
    timeout: number,
    locked: boolean,
    vhost: string
}> {
    public fields = {
        queue: String,
        route: String,
        message: String,
        status: String,
        ack_expiration: Number,
        vhost: String,
        timeout: Number,
        locked: Boolean,
    };
    public collection_name: string = `${model_name?.replace(/_$/,'')}_queue`;
}().load()
export default SensorQ;
