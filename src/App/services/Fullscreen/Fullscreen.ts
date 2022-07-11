import type { IFullscreen } from "./IFullscreen";

import { BrowserDriver } from "../../../drivers/BrowserDriver";
import { resolutionHeight, resolutionWidth } from "../../../consts";

type TConstructor = {
   name: string;
}

export class Fullscreen implements IFullscreen {
   name: string;
   private interval: number;
   private gameAspectRatio = resolutionWidth / resolutionHeight;

   constructor({ name }: TConstructor) {
      this.name = name;

      this.setFullscreen();
      // TODO: THis is never cleared !!!
      this.interval = BrowserDriver.SetInterval(this.setFullscreen, 1000);
   }

   Init = async () => {
      //
   };

   // TODO: This is never called because it is not on IFullscreen interface etc.
   destroy = () => {
      BrowserDriver.WithWindow(window => {
         window.clearInterval(this.interval);
      });
   };

   private setFullscreen = () => {
      BrowserDriver.WithWindow(window => {
         const body = window.document.body;
         const windowWidth = window.document.documentElement.clientWidth;
         const windowHeight = window.document.documentElement.clientHeight;
         const windowAspectRatio = windowWidth / windowHeight; // eslint-disable-line
         if(windowAspectRatio > this.gameAspectRatio) {
            const yRatio = windowHeight / resolutionHeight;
            body.style.transform = `scale(${yRatio})`;
         } else {
            const xRatio = windowWidth / resolutionWidth;
            body.style.transform = `scale(${xRatio})`;
         }
      });
   };
}
