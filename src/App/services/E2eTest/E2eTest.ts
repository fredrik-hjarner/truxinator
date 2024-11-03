import type { IE2eTest } from "./IE2eTest";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";
import { gameState, getFrame } from "../GameState.ts";

type THistory = Partial<{
   [gameObjectId: string]: unknown // hp
}>[];

type TConstructor = {
   name: string
}

export class E2eTest implements IE2eTest {
   public readonly name: string;

   // From file that has been pre-recorded.
   private recordedHistory!: THistory;
   private startTime = 0;
   /**
    * Set startTime to performanceNow if you want to measure including
    * stuff that happens before the first frame.
    */
   // private startTime = BrowserDriver.PerformanceNow();

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.recordedHistory = (await import("./e2ehistory.ts")).recordedHistory as THistory;
   };

   public onGameOver = () => {
      // This should actually trigger for very kind of END OF GAME scenario.
      console.log("E2eTest: Test succeeded.");
      const millis = (BrowserDriver.PerformanceNow() - this.startTime);
      console.log(`E2eTest: Took ${millis} ms to run test.`);
      if (!IsBrowser()) {
         BrowserDriver.ProcessExit(0);
      }
   };

   public Update = () => {
      const lastFrame = getFrame() - 1;

      if(this.startTime === 0) {
         // start counting from the first frame.
         this.startTime = BrowserDriver.PerformanceNow();
      }

      const _actual: Partial<{ [id: string]: unknown }> = {};
      for (const [gameObjectId, attribute] of Object.entries(gameState.gameObjects)) {
         _actual[gameObjectId] = attribute?.hp;
      }
      const actual = JSON.stringify(_actual);

      const expected = JSON.stringify(this.recordedHistory[lastFrame]);

      if (expected !== actual) {
         BrowserDriver.Alert(
            `Test failed!\nFrame: ${lastFrame}\nExpected: ${expected}\nActual: ${actual}`
         );
      }
   };
}
