import client, { Channel, Connection } from "amqplib";
import * as ConsumerList from "../../../config/amqp";
import { env } from "../App/Globals";

const getConnectionEnv = () => ({
    username: env('SENSORQ_USER') || env('RABBITMQ_USER', ''),
    password: env('SENSORQ_PASS') || env('RABBITMQ_PASS', ''),
    host: env('SENSORQ_HOST') || env('RABBITMQ_HOST', 'rabbitmq'),
    port: env('SENSORQ_PORT') || env('RABBITMQ_PORT', '5672')
})

class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;

    async connect(conn) {
        if (this.connected && this.channel) return;
        else this.connected = true;
        try {
            console.debug(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(
                `amqp://${conn.username}:${conn.password}@${conn.host}:${conn.port}`
            );
            console.debug(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async queue(queue: string, message: any, conn) {
        try {
            if (!this.channel) await this.connect(conn);
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
        }
    }

    async consume(queue: string, QueueConsumer: Consumer, conn) {
        if (!this.channel) await this.connect(conn);
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue,
            async (msg) => {
                if (!msg) return console.error(`Invalid incoming message`);
                await QueueConsumer.handle(msg)
                this.channel.ack(msg);
            },
            { noAck: false }
        );
    }
}
class Consumer {
    public queue_name!: string;
    public consumer_name!: string;

    public async handle(msg: client.Message): Promise<any> { }
}
export type SensorQConsumerList = Array<typeof Consumer>
function consume(queue?: string, connection?: { username: any; password: any; host: any; port: any; }) {
    if (!connection) connection = getConnectionEnv()
    const mq = new RabbitMQConnection()
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
                mq.consume(consumer.queue_name, consumer, connection)
        })
}
function send(queue: string, message: any, connection?: { username: any; password: any; host: any; port: any; }) {
    if (!connection) connection = getConnectionEnv()
    new RabbitMQConnection().queue(queue, message, connection)
}
const SensorQ = {
    consume,
    send,
    Consumer,
};

export default SensorQ;
