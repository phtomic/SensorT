"use strict";

import { env } from "../framework/Domain/App/Globals";

export class NetworkConfig {
   public api = {
      port: parseInt(env('HTTP_API_PORT', "8181")),
      socketio: true
   };
   public notificationsTick: number = 0;
}