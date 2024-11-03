import type  { App } from "../../App";
import type { IFps } from "./IFps";

import { round } from "../../../utils/round.ts";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { initElapsedTimeDiv } from "./elapsedTimeDiv.ts";
import { initFpsDiv, initMaxWebWorkersDiv } from "./fpsDiv.ts";
import { initFrameCounterDiv } from "./frameCounterDiv.ts";
import { getFrame } from "../GameState.ts";

type TConstructor = {
   // TODO: remove app here?
   app: App;
   name: string;
};

export class Fps implements IFps {
   public app: App;
   public name: string;
   private startTime: number | null;

   //elements
   private framCounterDiv?: HTMLDivElement;
   private elapsedTimeDiv?: HTMLDivElement;
   private fpsDiv?: HTMLDivElement;
   private maxWebWorkers?: HTMLDivElement;

   /**
    * Public
    */
   public constructor({ app, name }: TConstructor) {
      // vars
      this.name = name;
      this.startTime = null;
      
      // deps/services
      this.app = app;

      // elements
      this.framCounterDiv = initFrameCounterDiv();
      this.elapsedTimeDiv = initElapsedTimeDiv();
      this.fpsDiv = initFpsDiv();
      this.maxWebWorkers = initMaxWebWorkersDiv();
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      // TODO: remove duplication. Have common/duped code in common function.
      this.elapsedTimeDiv && (this.elapsedTimeDiv.innerHTML = `elapsed: 0s`);
      this.framCounterDiv && (this.framCounterDiv.innerHTML = `frames: 0`);
      this.fpsDiv && (this.fpsDiv.innerHTML = `fps: 0`);
      BrowserDriver.WithWindow(window => {
         const max = window.navigator.hardwareConcurrency;
         this.maxWebWorkers && (this.maxWebWorkers.innerHTML = `maxWebWorkers: ${max}`);
      });
   };

   public destroy = () => {
      /**
       * reset vars
       */
      this.startTime = null;

      /**
       * Destroy elements
       */
      this.framCounterDiv?.remove();
      this.framCounterDiv = undefined;

      this.elapsedTimeDiv?.remove();
      this.elapsedTimeDiv = undefined;

      this.fpsDiv?.remove();
      this.fpsDiv = undefined;

      this.maxWebWorkers?.remove();
      this.maxWebWorkers = undefined;
   };

   public Update = () => {
      if(this.startTime === null) {
         this.startTime = BrowserDriver.PerformanceNow();
      }
      
      // Display stats.
      const elapsed = BrowserDriver.PerformanceNow() - this.startTime;

      const frame = getFrame();
      this.elapsedTimeDiv && (this.elapsedTimeDiv.innerHTML = `elapsed: ${round(elapsed/1000)}s`);
      this.framCounterDiv && (this.framCounterDiv.innerHTML = `frames: ${frame}`);
      this.fpsDiv && (this.fpsDiv.innerHTML = `fps: ${Math.round(frame / (elapsed / 1000))}`);
   };
}
