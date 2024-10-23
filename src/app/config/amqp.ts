import { SensorQConsumerList } from '../framework/Domain/Plugins/SensorQ';

export default [
/*
*   To create new RabbitMQ consumers you must first configure the application's .env with
*   RABBITMQ_USER || empty string
*   RABBITMQ_PASS || empty string
*   RABBITMQ_HOST || rabbitmq
*   RABBITMQ_PORT || 5672
*   After this configuration, it is possible to define the new consumers below in the following pattern
*      typeof SensorQ.Consumer
*   To start consumers run 'npm run consume <consumer_name>' to specify which one should be started, or 'npm run consume' to run all available consumers at the same time
*/
] as SensorQConsumerList