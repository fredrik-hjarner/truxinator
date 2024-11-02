import type { IUI } from "./IUI";
import type { IScene } from "./Scenes/types/IScene";
import type { IGameEvents, TGameEvent } from "../Events/IEvents";
import type { IGameLoop } from "../GameLoop/IGameLoop";
import type { TInitParams } from "../IService";
import type { Highscore as THighscoreService } from "../Highscore/Highscore.ts";
import type { IPoints } from "../Points/IPoints";
import type { Settings as TSettingsService } from "../Settings/Settings";
import type { IInput } from "../Input/IInput";
import type { GameData } from "../GamaData/GameData";

import { StartGame } from "./Scenes/StartGame.ts";
import { Game } from "./Scenes/Game.ts";
import { GameOver } from "./Scenes/GameOver.ts";
import { Highscore } from "./Scenes/Highscore.ts";
import { EnterHighscore } from "./Scenes/EnterHighscore.ts";
import { Settings } from "./Scenes/Settings.ts";
import { DisplayControls } from "./Scenes/DisplayControls.ts";
import { SelectGame } from "./Scenes/SelectGame.ts";
import { SelectGameForHighscore } from "./Scenes/SelectGameForHighscore.ts";

type TConstructor = {
   name: string
}

export class UI implements IUI {
   public readonly name: string;

   // deps/services
   public events!: IGameEvents;
   public gameLoop!: IGameLoop;
   public highscoreService!: THighscoreService;
   public points!: IPoints;
   public settingsService!: TSettingsService;
   public input!: IInput;
   public gameData!: GameData;

   // Scenes
   public startGame: IScene;
   public selectGame: IScene;
   public settings: IScene;
   public game: IScene;
   public gameOver: IScene;
   public highscore: IScene;
   public selectGameForHighscore: IScene;
   public enterHighscore: IScene;
   public displayControls: IScene;

   // Active scene
   private activeScene?: IScene;

   public constructor({ name }: TConstructor) {
      this.name = name;

      this.startGame = new StartGame({ ui: this });
      this.selectGame = new SelectGame({ ui: this });
      this.settings = new Settings({ ui: this });
      this.game = new Game({ ui: this });
      this.gameOver = new GameOver({ ui: this });
      this.highscore = new Highscore({ ui: this });
      this.selectGameForHighscore = new SelectGameForHighscore({ ui: this });
      this.enterHighscore = new EnterHighscore({ ui: this });
      this.displayControls = new DisplayControls({ ui: this });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      // TODO: Better type checking here.
      this.events = deps?.events!;
      this.gameLoop = deps?.gameLoop!;
      this.highscoreService = deps?.highscore!;
      this.points = deps?.points!;
      this.settingsService = deps?.settings!;
      this.input = deps?.input!;
      this.gameData = deps?.gameData!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

      this.events.subscribeToEvent(this.name, this.onEvent);

      this.SetActiveScene(this.startGame);
      // this.SetActiveScene(this.enterHighscore);
      // this.SetActiveScene(this.highscore, 2);
      // this.SetActiveScene(this.gameOver);
   };

   public SetActiveScene = (scene: IScene, props?: unknown) => {
      if(scene === this.activeScene) {
         // same scene already active.
         console.warn("Trying to set a scene to active which is already active.");
         return;
      }

      if(this.activeScene) {
         this.activeScene.destroy();
      }

      this.activeScene = scene;
      this.activeScene.render(props);
   };

   private onEvent = (event: TGameEvent) => {
      switch(event.type) {
         case "gameOver": {
            this.gameLoop.pause();
            this.SetActiveScene(this.gameOver);
            break;
         }
         default:
            // NOOP
      }
   };

   public destroy = () => {
      // Destroy all scenes // TODO: should prolly be a loop or somethin'
      this.startGame.destroy();
      this.settings.destroy();
      this.game.destroy();
      this.gameOver.destroy();
      this.highscore.destroy();
      this.enterHighscore.destroy();
      this.displayControls.destroy();

      // Unsubscribe to events.
      this.events.unsubscribeToEvent(this.name);

      // Unset active scene
      this.activeScene = undefined;
   };

   public Update = () => {
      if (this.activeScene) {
         this.activeScene.update?.(); // TODO: Should ?. really be needed?
      }
   };
}