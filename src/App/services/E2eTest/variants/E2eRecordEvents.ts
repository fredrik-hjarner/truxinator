import type { IE2eTest } from "../IE2eTest";

import { gameState, getFrame } from "../../GameState.ts";

type THistory = Partial<{
   [gameObjectId: string]: unknown // hp
}>[];

type TConstructor = {
   name: string
}

/**
 * Record all attributes. Subscribe as first subscriber to gameLoop. Immediately when next_frame
 * happens, record all attributes `event.frameNr - 1`.
 */
export class E2eRecordEvents implements IE2eTest {
   public readonly name: string;

   // local history (what actually happened)
   // Store it later in file that has, so to speak, been pre-recorded.
   private history: THistory = [];


   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/no-empty-function
   public Init = async () => {};

   public onGameOver = () => {
      console.log("E2eRecordEvents.history:");
      console.log(this.history);
      // TODO: Should it destruct itself or something here?
   };

   public Update = () => {
      const lastFrame = getFrame() - 1;
      // (first frame is frame nr 1 though)
      if(lastFrame < 0) {
         return;
      }
      if(!this.history[lastFrame]) { // TODO: really if-case not needed should always be set {}.
         this.history[lastFrame] = {};
      }
      // grab attributes and store them in history.
      for (const [gameObjectId, attribute] of Object.entries(gameState.gameObjects)) {
         this.history[lastFrame][gameObjectId] = attribute?.hp;
      }
   };
}
