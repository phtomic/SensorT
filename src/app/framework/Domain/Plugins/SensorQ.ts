import client, { Channel, Connection } from "amqplib";
import * as ConsumerList from "../../../config/amqp";
import { env } from "../App/Globals";
class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;
        try {
            let rmqUser = env('RABBITMQ_USER', '')
            let rmqHost = env('RABBITMQ_HOST', 'rabbitmq')
            let rmqPass = env('RABBITMQ_PASS', '')
            let rmqPort = env('RABBITMQ_PORT', '5672')
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(
                `amqp://${rmqUser}:${rmqPass}@${rmqHost}:${rmqPort}`
            );
            console.debug(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async queue(queue: string, message: any) {
        try {
            if (!this.channel) await this.connect();
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
        }
    }

    async consume(queue: string, QueueConsumer: Consumer) {
        if (!this.channel) await this.connect();
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
function consume(queue?: string) {
    const mq = new RabbitMQConnection()
    let queue_exist = (queue?.length || 0) > 0
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
function send(queue: string, message: any) {
    new RabbitMQConnection().queue(queue, message)
}
const SensorQ = {
    consume,
    send,
    Consumer,
};

export default SensorQ;
