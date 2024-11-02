import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { enableReduxDevTools, millisPerFrame } from "../../../../consts.ts";
import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";
import { incrementFrame, sendDiffToDevTools } from "../../GameState.ts";

type TConstructor = {
   app: App;
   name: string;
};

export class ReqAnimFrameGameLoop implements IGameLoop {
   // vars
   public name: string;
   private nextFrameMillis: number | null;
   public frameSpeedMultiplier: number; // 1 = normal spd. 0 = paused. 2 = twice spd etc.

   // deps/services
   public app: App;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.nextFrameMillis = null;
      // TODO: Questionable if this should start as 1, but that's how it was.
      this.frameSpeedMultiplier = 1;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      this.nextFrameMillis = BrowserDriver.PerformanceNow() + millisPerFrame;
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
   };

   public pause = () => {
      this.frameSpeedMultiplier = 0;
   };

   // Public because GameSpeed might want control over frames.
   public nextFrame = () => {
      incrementFrame();

      // TODO: Eventually remove these two calls and replace with running each thing in sequence.
      this.app.events.dispatchEvent({ type: "frame_tick" });

      // TODO: I want all the different stuff to run here in sequence
      this.app.ui.Update?.(); // TODO: should ?. really be needed?

      if(enableReduxDevTools) {
         sendDiffToDevTools();
      }
   };

   /**
   * Private
   */
   private advanceFrames = () => {
      for(let i=0; i<this.frameSpeedMultiplier; i++) {
         this.nextFrame();
      }
   };

   /**
    * Number of frames that took too long time to execute.
    */
   private tooSlowFrames = 0;

   /**
   * This may not actually progress the game one frame.
   * Idea is to run these as fast as possible and to only progress a frame
   * when one frame has passed.
   */
   private oneGameLoop = (time: number) => {
      // console.log("time:", time);
      BrowserDriver.RequestAnimationFrame(this.oneGameLoop);
      if(this.nextFrameMillis === null) {
         BrowserDriver.Alert("this.nextFrameMillis === null");
         throw new Error("this.nextFrameMillis === null");
      }
      let i = 0;
      /**
       * uncomment to log the "drift". if requestAnimationFrame is faster or slower than 60 hz
       * (and also not an even multiple) then the number will increase or decrease, if 60hx exactly
       * the the number will be the same.
       */
      // console.log(time - this.nextFrameMillis);
      while (time >= this.nextFrameMillis) {
         i++;
         this.nextFrameMillis += millisPerFrame;
         this.advanceFrames();
      }
      if(i > 1) {
         this.tooSlowFrames += (i-1);
         // TODO: Only show this warning on debug, right?
         console.info(`A total of ${this.tooSlowFrames} frames executed too slow!`);
      }
   };
}