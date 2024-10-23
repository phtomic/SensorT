import { RegexMatchedString } from "../App/Kernel";
const regex = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/
export type CronTime = string; //RegexMatchedString<typeof regex>
class Consumer {
    public interval!: CronTime;
    public async handle(data: Object): Promise<any> { }
}
export type SensorCronList = Array<typeof Consumer>

const SensorCron = {
    Consumer,
};

export default SensorCron;
