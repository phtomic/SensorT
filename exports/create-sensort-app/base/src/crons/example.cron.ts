import { SensorCron } from "@sensort/cron";

export default class ExampleCronjob extends SensorCron.Consumer{
    static timeout = '* */5 * * *' //Every 5 minutes
    async handle(...args: any[]): Promise<any> {
        console.log("Example cronjob")
    }
}