import type {
   IEventsCollisions, IEventsPoints, IGameEvents,
} from "./Events/IEvents";
import type { Settings } from "./Settings/Settings";
import type { IInput } from "./Input/IInput";
import type { IE2eTest } from "./E2eTest/IE2eTest";
import type { IGameLoop } from "./GameLoop/IGameLoop";
import type { IFps } from "./Fps/IFps";
import type { Enemies } from "./Enemies/Enemies";
import type { GamePad } from "./GamePad/GamePad";
import type { Collisions } from "./Collisions/Collisions";
import type { IGameSpeed } from "./GameSpeed/IGameSpeed";
import type { IPoints } from "./Points/IPoints";
import type { Highscore } from "./Highscore/Highscore.ts";
import type { GameData } from "./GamaData/GameData";
import type { IGraphics } from "./Graphics/IGraphics";
import type { IUI } from "./UI/IUI";
import type { IFullscreen } from "./Fullscreen/IFullscreen";
import type { IOutsideHider } from "./OutsideHider/IOutsideHider";
import type { IAttributes } from "./Attributes/IAttributes";
import type { IPseudoRandom } from "./PseudoRandom/IPseudoRandom.ts";

export type TInitParams = Partial<{
  e2eTest: IE2eTest;
  settings: Settings;
  input: IInput;
  gameLoop: IGameLoop;
  fps: IFps;
  enemies: Enemies;
  gamepad: GamePad;
  collisions: Collisions;
  events: IGameEvents;
  eventsCollisions: IEventsCollisions;
  eventsPoints: IEventsPoints;
  gameSpeed: IGameSpeed;
  points: IPoints;
  highscore: Highscore;
  gameData: GameData;
  graphics: IGraphics;
  pseudoRandom: IPseudoRandom;
  ui: IUI;
  fullscreen: IFullscreen;
  outsideHider: IOutsideHider;
  attributes: IAttributes;
}>;

export interface IService {
  name: string;
  // Create: () => Promise<IService>
  /**
   * 2nd phase of initialization.
   * Here you are allowed to use other services (that are deps),
   * because you know they have initialized.
   */
  Init: (deps?: TInitParams) => Promise<void>
  // Destroy: () => void
  // TODO: Eventually all services should make use of this Update method instead of listening to
  //events.
  Update?: () => void;
}
