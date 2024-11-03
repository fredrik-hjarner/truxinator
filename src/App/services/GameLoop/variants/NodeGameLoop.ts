import type  { App } from "../../../App";
import type { IGameLoop } from "../IGameLoop";

import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";
import { getGameOver, incrementFrame, setGameOver } from "../../GameState.ts";

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

      // TODO: This is duplicate between NodeGameLoop and ReqAnimFrameGameLoop.
      this.app.e2eTest.Update?.(); // TODO: should ?. really be needed?
      this.app.input.Update?.(); // TODO: should ?. really be needed?
      this.app.fps.Update?.(); // TODO: should ?. really be needed?
      const collisions = this.app.collisions.calculateCollisions();
      this.app.enemies.storeCollisions(collisions);
      this.app.enemies.Update?.(); // TODO: should ?. really be needed?
      this.app.ui.Update?.(); // TODO: should ?. really be needed?

      if(getGameOver()) {
         this.app.ui.onGameOver?.(); // TODO: should ?. really be needed?
         this.app.e2eTest.onGameOver?.(); // TODO: should ?. really be needed?
         this.app.input.onGameOver?.(); // TODO: should ?. really be needed?

         setGameOver(false);
      }
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