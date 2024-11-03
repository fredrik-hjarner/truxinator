import type { IScene } from "./types/IScene";
import type { UI } from "../UI";

import { createShade } from "./components/atoms/shade.ts";
import { centerHorizontally } from "./utils/centering.ts";
import { createText } from "./components/atoms/text.ts";
import { Menu } from "./components/molecules/Menu.ts";
import { fontSizes } from "./consts/fontSizes.ts";
// TODO: This will only work once ESLINT supports the new `with` keyword.
// import packageJson from "../../../../../package.json" with { type: "json" };

type TConstructor = {
   ui: UI;
}

export class StartGame implements IScene {
   public readonly ui: UI;

   // elements
   private shadeElement?: HTMLDivElement;
   private title?: HTMLDivElement;
   private menu?: Menu;
   private version?: HTMLDivElement;

   public constructor(params: TConstructor) {
      this.ui = params.ui;
   }

   public render() {
      if(this.ui.settingsService.settings.skipStartMenu) {
         // Yea, just skip this start menu.
         this.onStartGame();
         return;
      }

      this.shadeElement = createShade();

      this.title = createText({
         text: `<span class="flash3s"><span style="font-size: 76px;">S</span>chmupinator</span>`,
         fontSize: 60,
         top: 36,
      });
      centerHorizontally(this.title);

      this.menu = new Menu({
         input: this.ui.input,
         top: 108,
         menuItems: [
            { text: "start game", onClick: this.onStartGame },
            {
               text: "highscore",
               onClick: () => { this.ui.SetActiveScene(this.ui.selectGameForHighscore); }
            },
            { text: "settings", onClick: () => { this.ui.SetActiveScene(this.ui.settings); }},
         ]
      });
      this.menu.render();

      this.version = createText({
         // text: packageJson.version,
         text: "0.7.1",
         fontSize: fontSizes.smallest,
         top: 225,
         // top: 0,
         left: 333,
         color: "rgba(255, 0, 0, 0.4)"
      });
   }

   public destroy() {
      this.shadeElement?.remove();
      this.shadeElement = undefined;

      this.title?.remove();
      this.title = undefined;

      this.menu?.destroy();

      this.version?.remove();
      this.version = undefined;
   }

   private onStartGame = () => {
      this.ui.SetActiveScene(this.ui.selectGame);
   };
}
