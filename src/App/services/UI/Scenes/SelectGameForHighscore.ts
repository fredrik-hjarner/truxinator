import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade.ts";
import { centerHorizontally } from "./utils/centering.ts";
import { createText } from "./components/atoms/text.ts";
import { Menu } from "./components/molecules/Menu.ts";

type TConstructor = {
   ui: UI;
}

export class SelectGameForHighscore implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>elect game</span>`,
         fontSize: 60,
         top: 36,
      });
      centerHorizontally(this.title);

      const games = this.ui.gameData.getGameNames()
         .map((game, i) => (
            {
               text: game,
               onClick: () => {
                  this.onSelectGame(i);
               }
            }
         ));

      this.menu = new Menu({
         input: this.ui.input,
         top: 108,
         menuItems: [
            ...games,
            {
               text: "back",
               onClick: () => { this.ui.SetActiveScene(this.ui.startGame); }
            },
         ]
      });
      this.menu.render();
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.menu?.destroy();
   }

   private onSelectGame = (gameName: number) => {
      this.ui.gameData.setActiveGame(gameName);
      this.ui.SetActiveScene(this.ui.highscore, { backButton: true });
   };
}
