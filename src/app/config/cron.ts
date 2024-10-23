import { SensorCronList } from "../framework/Domain/Plugins/SensorCron";

export default [
/*
*   To create new Crontab consumers you must define new consumers below in the following pattern
*      typeof SensorCron.Consumer
*   On server start, will run all available consumers at the same time
*/
] as SensorCronList