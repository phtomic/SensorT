import ExampleCronjob from '@/crons/example.cron'
import {startCronjob} from '@sensort/cron'

startCronjob(ExampleCronjob)