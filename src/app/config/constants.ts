import { env } from "SensorT/App";
import { UUIDGenerator } from "SensorT/Plugins";

export const APP_VERSION = "1.1.6"
export const APP_SESSION = new UUIDGenerator().generate()
export const RADIUS_SERVER_URL = env('RADIUS_SERVER_URL',  '')
export const ENABLE_MULTITENANCY = true;