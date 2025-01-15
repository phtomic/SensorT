"use strict";

import { env } from "SensorT/App";

export class NetworkConfig {
   public api = {
      port: parseInt(env('HTTP_API_PORT', "8181"))
   };
   public notificationsTick: number = 0;
}