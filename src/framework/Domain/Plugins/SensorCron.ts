import { RegexMatchedString } from '../App/Kernel';
const regex =
    /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;
export type CronTime = string; //RegexMatchedString<typeof regex>
import { CronJob } from 'cron';
import { uuid } from './UUIDGenerator';
export const globalsConfig = global as typeof globalThis & {
    sensortCrons: SensorCronList;
    sensortStartedCron: { [x: string]: CronJob; };
}
class Consumer {
    public static interval: CronTime;
    public static onBoot?: boolean;
    public async handle(...args): Promise<any> { }
}
export type SensorCronList = Array<typeof Consumer>;

const SensorCron = {
    Consumer,
};

export const startCronjob = (cronjob: typeof Consumer, ...args) => {
    const token = uuid();
    const cron = new CronJob(cronjob.interval, async () => {
        try {
            await (new cronjob()).handle(...args);
        } catch (err) {
            console.error(err);
        }
    });
    if (cronjob.onBoot) (async () => (new cronjob()).handle(...args))();
    if (!globalsConfig.sensortStartedCron) globalsConfig.sensortStartedCron = {}
    globalsConfig.sensortStartedCron[token] = cron;
    cron.start();
    return token;
};
export const restartCronjob = (uuid: string) => {
    const cronjob = globalsConfig.sensortStartedCron[uuid];
    if (cronjob) {
        cronjob.start();
        return true;
    }
    return false;
};
export const releaseCronjob = (uuid: string) => {
    if (pauseCronjob(uuid)) {
        delete globalsConfig.sensortStartedCron[uuid];
        return true;
    }
    return false;
};
export const pauseCronjob = (uuid: string) => {
    const cronjob = globalsConfig.sensortStartedCron[uuid];
    if (cronjob) {
        cronjob.stop();
        return true;
    }
    return false;
};

export default SensorCron;
