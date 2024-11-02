import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";
import { incrementFrame } from "../../GameState.ts";

type TConstructor = {
   app: App;
   name: string;
};

export class NodeGameLoop implements IGameLoop {
   // vars
   public name: string;
   public frameSpeedMultiplier: number; // 1 = normal spd. 0 = paused. 2 = twice spd etc.

   // deps/services
   public app: App;

   /**
   * Public
   */
   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;

      this.frameSpeedMultiplier = 1;
   }

   public Init = async () => {
      // noop
   };

   public Start = () => {
      BrowserDriver.SetInterval(this.oneGameLoop, 0);
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
   };

   /**
   * Private
   */
   private advanceFrames = () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      this.nextFrame();
   };

   private oneGameLoop = () => {
      if(this.frameSpeedMultiplier === 0) {
         return;
      }
      this.advanceFrames();
   };
}