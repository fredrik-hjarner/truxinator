import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { BrowserDriver } from "../../../../drivers/BrowserDriver/index.ts";
import { createShade } from "./components/atoms/shade.ts";
import { createText } from "./components/atoms/text.ts";
import { Countdown } from "./components/molecules/Countdown.ts";
import { centerHorizontally } from "./utils/centering.ts";
import { fontSizes } from "./consts/fontSizes.ts";
import { getPoints } from "../../GameState.ts";

type TConstructor = {
   ui: UI;
}

export class GameOver implements IScene {
   public readonly ui: UI;
   private shadeElement?: HTMLDivElement;
   private textElement?: HTMLDivElement;
   private countdown?: Countdown;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.textElement = createText({
         text: "Game Over",
         fontSize: fontSizes.largest,
         top: 95,
      });
      centerHorizontally(this.textElement);

      this.countdown = new Countdown({
         input: this.ui.input,
         secondsLeft: 5,
         onDone: this.handleCountdDownDone,
         fontSize: fontSizes.largest,
         top: 130,
      });
      centerHorizontally(this.countdown.element);
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.textElement?.remove();
      this.textElement = undefined;

      this.countdown?.destroy();
      this.countdown = undefined;
   }

   private handleCountdDownDone = () => {
      const points = getPoints();
      const { qualifiedForTop10: qualified, rank } =
         this.ui.highscoreService.qualifiedForTop10(points);

      if(qualified) {
         this.ui.SetActiveScene(this.ui.enterHighscore, rank);
      } else {
         // TODO: reload just because app does not clear up by itself yet.
         BrowserDriver.WithWindow(window => {
            window.location.reload();
         });
         // this.ui.SetActiveScene(this.ui.startGame);
      }
   };
}
