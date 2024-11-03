import type { App } from "../../App";
import type { IService } from "../IService";

export interface IGameLoop extends IService {
   app: App;
   name: string;
    /** 1 = normal spd. 0 = paused. 2 = twice spd etc. */
   frameSpeedMultiplier: number

   Start: () => void;
   /** Public because GameSpeed might want control over frames. */
   pause: () => void;
   nextFrame: () => void;
}