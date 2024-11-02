import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createText } from "./components/atoms/text.ts";
import { fontSizes } from "./consts/fontSizes.ts";

type TConstructor = {
   ui: UI;
}

export class Game implements IScene {
   //deps/services
   public readonly ui: UI;

   // elements.
   private scoreElement?: HTMLDivElement;
   private hiscoreElement?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.scoreElement = createText({
         text: `Score ${Math.round(this.ui.points.points)}`,
         color: "white",
         fontSize: fontSizes.smallest,
         top: 10,
         left: 20
      });

      const record = this.ui.highscoreService.getTop1().score;
      this.hiscoreElement = createText({
         text: `Record ${record}`,
         color: "white",
         fontSize: fontSizes.smallest,
         top: 10,
         left: 285
      });
   }

   public destroy() {
      this.scoreElement?.remove();
      this.scoreElement = undefined;

      this.hiscoreElement?.remove();
      this.hiscoreElement = undefined;
   }

   public update() {
      if (this.scoreElement) {
         // TODO: Should it keep track of the last score and only update if it has changed?
         this.scoreElement.innerHTML = `Score ${Math.round(this.ui.points.points)}`;
      }
   }
}
