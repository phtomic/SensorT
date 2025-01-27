import { RegexMatchedString } from '../App/Kernel';
const regex =
  /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;
export type CronTime = string; //RegexMatchedString<typeof regex>
import { CronJob } from 'cron';
import { uuid } from './UUIDGenerator';
export const globalsWithCrons = global as typeof globalThis & {
  sensortCrons: SensorCronList;
  sensortStartedCron: {
    [x: string]: CronJob;
  };
};
class Consumer {
  public interval!: CronTime;
  public onBoot?: boolean;
  public async handle(data: Object): Promise<any> {}
}
export type SensorCronList = Array<typeof Consumer>;

const SensorCron = {
  Consumer,
};

export const startCronjob = (
  interval: CronTime,
  callback: (cron: string) => Promise<any>,
) => {
  const token = uuid();
  const cron = new CronJob(interval, async () => {
    try {
      await callback(token);
    } catch (err) {
      console.error(err);
    }
  });
  globalsWithCrons.sensortStartedCron[token] = cron;
  cron.start();
};
export const restartCronjob = (uuid: string) => {
  const cronjob = globalsWithCrons.sensortStartedCron[uuid];
  if (cronjob) {
    cronjob.start();
    return true;
  }
  return false;
};
export const releaseCronjob = (uuid: string) => {
  if (pauseCronjob(uuid)) {
    delete globalsWithCrons.sensortStartedCron[uuid];
    return true;
  }
  return false;
};
export const pauseCronjob = (uuid: string) => {
  const cronjob = globalsWithCrons.sensortStartedCron[uuid];
  if (cronjob) {
    cronjob.stop();
    return true;
  }
  return false;
};

export default SensorCron;
