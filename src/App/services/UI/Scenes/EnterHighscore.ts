import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade.ts";
import { createText } from "./components/atoms/text.ts";
import { isNumber } from "../../../../utils/typeAssertions.ts";
import { centerHorizontally } from "./utils/centering.ts";
import { fontSizes } from "./consts/fontSizes.ts";
import { FlipCharacters } from "./components/molecules/FlipCharacters.ts";
import { getPoints } from "../../GameState.ts";

type TConstructor = {
   ui: UI;
}

export class EnterHighscore implements IScene {
   // deps/services
   public readonly ui: UI;

   // vars
   private rank?: number;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private subTitle?: HTMLDivElement;
   private flipCharacters?: FlipCharacters;
   
   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }
   
   // If rank is a number then that's the rank the player got in top10 list.
   public render(rank?: unknown) {
      if(isNumber(rank)) {
         this.rank = rank;
      }
      
      this.shadeElement = createShade();
      
      this.title = createText({
         text: "Made it into the Highscore",
         fontSize: fontSizes.normal,
         top: 20,
         className: "flash1s"
      });
      centerHorizontally(this.title);

      this.subTitle = createText({
         text: "Enter thy name and\n become a legend",
         fontSize: fontSizes.small,
         top: 70,
         className: "flash1s"
      });
      centerHorizontally(this.subTitle);

      this.flipCharacters = new FlipCharacters({
         input: this.ui.input,
         top: 130,
         onDone: this.onEnteredName,
      });
      this.flipCharacters.render();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.subTitle?.remove();
      this.subTitle = undefined;

      this.flipCharacters?.destroy();
   }

   private onEnteredName = (name: string) => {
      // Enter entry then go to Highscore screen.
      this.ui.highscoreService.registerNewEntry({
         name,
         score: getPoints(),
      });
      this.ui.SetActiveScene(this.ui.highscore, { rank: this.rank });
   };
}
