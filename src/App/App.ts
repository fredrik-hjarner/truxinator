/**
 * Interfaces
 */
import type { IInput } from "./services/Input/IInput";
import type { IGameLoop } from "./services/GameLoop/IGameLoop";
import type { IFps } from "./services/Fps/IFps";
import type { IGraphics } from "./services/Graphics/IGraphics";
import type { IUI } from "./services/UI/IUI";
import type {
   IEventsCollisions, IGameEvents, TCollisionsEvent,
   TGameEvent,
} from "./services/Events/IEvents";
import type { IGameSpeed } from "./services/GameSpeed/IGameSpeed";
import type { IFullscreen } from "./services/Fullscreen/IFullscreen";
import type { IE2eTest } from "./services/E2eTest/IE2eTest";
import type { IOutsideHider } from "./services/OutsideHider/IOutsideHider";
import type { ICursorShowGamePos } from "./services/CursorShowGamePos/ICursorShowGamePos";
import type { IAttributes } from "./services/Attributes/IAttributes";
import type { IPseudoRandom } from "./services/PseudoRandom/IPseudoRandom";

/**
 * Services
 */
import { CursorShowGamePos } from "./services/CursorShowGamePos/CursorShowGamePos.ts";
import { Enemies } from "./services/Enemies/Enemies.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fps } from "./services/Fps/Fps.ts";
import { Input } from "./services/Input/Input.ts";
import { GamePad } from "./services/GamePad/GamePad.ts";
import { Collisions } from "./services/Collisions/Collisions.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Events } from "./services/Events/Events.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameSpeed } from "./services/GameSpeed/GameSpeed.ts";
import { Highscore } from "./services/Highscore/Highscore.ts";
import { GameData } from "./services/GamaData/GameData.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Graphics } from "./services/Graphics/Graphics.ts";
import { UI } from "./services/UI/UI.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fullscreen } from "./services/Fullscreen/Fullscreen.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { E2eTest } from "./services/E2eTest/E2eTest.ts";
import { Settings } from "./services/Settings/Settings.ts";
import { OutsideHider } from "./services/OutsideHider/OutsideHider.ts";
import { Attributes } from "./services/Attributes/Attributes.ts";
import { PseudoRandom } from "./services/PseudoRandom/PseudoRandom.ts";

/**
 * "Mocks"/Service variations
 */
import { NoopService } from "./services/NoopService.ts";
import { ReplayerInput } from "./services/Input/mocks/ReplayerInput.ts";
import { MockFullscreen } from "./services/Fullscreen/MockFullscreen.ts";
import { MockGraphics } from "./services/Graphics/variants/MockGraphics.ts";
import { NodeGameLoop } from "./services/GameLoop/variants/NodeGameLoop.ts";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReqAnimFrameGameLoop } from "./services/GameLoop/variants/ReqAnimFrameGameLoop.ts";
import { E2eRecordEvents } from "./services/E2eTest/variants/E2eRecordEvents.ts";

/* Other */
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

/**
 * TODO: I toggle some stuff based upon if the mode is "release" (my custom mode), this is
 * inconsistent though since I toggle most stuff based on the stuff in Settings service, so I dont
 * know if I should make this more consistent by, for example, removing this and placing all of
 * these in the Settings service instead.
 * I only care about "release" if this is executed in the browser.
 * I also may need to get this to work with Bun if I want to use Bun.
 */
const isRelease = IsBrowser() ? import.meta.env.MODE === "release" : false;

export class App {
   // types here should not be IService but rather something that implements IService.
   // TODO: also all types should NOT be concrete types, but interfaces.
   // TODO: I think the goal was to make all services on App be private, so it's not wild west and
   // every service can access every other service and it's thus impossible to know what service has
   // what service as a dependencies.
   private cursorShowGamePos: ICursorShowGamePos;
   public e2eTest: IE2eTest;
   private settings: Settings;
   public input: IInput;
   public gameLoop: IGameLoop;
   public fps: IFps;
   public enemies: Enemies;
   public gamepad: GamePad;
   public collisions: Collisions;
   public events: IGameEvents;
   public eventsCollisions: IEventsCollisions;
   public gameSpeed: IGameSpeed;
   public highscore: Highscore;
   public gameData: GameData;
   public graphics: IGraphics;
   public ui: IUI;
   public fullscreen: IFullscreen;
   public outsideHider: IOutsideHider;
   public attributes: IAttributes;
   public pseudoRandom: IPseudoRandom;

   /**
    * Step 1 of initialization
    */
   public constructor() {
      /**
       * Constuct services
       */
      /**
       * This is not the most elegant but settings contain some settings that decide
       * what services are going to be used, so it should be created first.
       */
      this.settings = new Settings({ app: this, name: "settings" });
      const { autoplay } = this.settings.settings;

      this.cursorShowGamePos = this.construct.cursorShowGamePos();

      this.e2eTest = IsBrowser() ?
         // new NoopService() :
         (isRelease ?
            new NoopService() : // don't record events in releases.
            new E2eRecordEvents({ name: "e2e" })) :
         new E2eTest({ name: "e2e" });

      this.input = IsBrowser() ?
         (autoplay ?
            new ReplayerInput({ name: "input" }) :
            new Input({ name: "input" })
         ) :
         new ReplayerInput({ name: "input" });

      this.gameLoop = IsBrowser() ?
         new ReqAnimFrameGameLoop({ app: this, name: "gameLoop" }) :
         new NodeGameLoop({ app: this, name: "nodeGameLoop" });

      this.fps = this.construct.fps();

      this.enemies = new Enemies({ name: "enemies" });
      
      this.gamepad = new GamePad({ name: "gamePad" });

      this.collisions = new Collisions({ name: "collisions" });

      /* The events services are event channels passing events with
       * `dispatchEvent` and `subscribeToEvent` functions */
      this.events =           new Events<TGameEvent>({ app: this, name: "events" });
      this.eventsCollisions = new Events<TCollisionsEvent>({ app: this, name: "eventsCollisions" });

      this.gameSpeed = this.construct.gameSpeed();

      this.highscore = new Highscore({ name: "highscore" });

      this.gameData = new GameData({ name: "gameData" });

      this.graphics = IsBrowser() ? new Graphics() : new MockGraphics();

      this.ui = IsBrowser() ? new UI({ name: "ui" }) : new NoopService();

      this.fullscreen = this.construct.fullscreen();

      this.outsideHider = this.construct.outsideHider();

      this.attributes = this.construct.attributes();

      this.pseudoRandom = this.construct.pseudoRandom();
   }

   /* Contains construction functions keyed by service.
    * TODO: Force sort this object alphabetically. */
   public construct = {
      attributes: (): IAttributes => { return new Attributes({ name: "attributes" }); },
      cursorShowGamePos: (): ICursorShowGamePos => {
         return IsBrowser() ?
            (isRelease ?
               new NoopService() : // hide cursor pos in releases.
               new CursorShowGamePos({ name: "cursorShowGamePos" })) :
            new NoopService();
      },
      fps: (): IFps => {
         const { fpsStats } = this.settings.settings; // assumes settings has been initialized.
         return IsBrowser() ?
            (fpsStats ? new Fps({ app: this, name: "fps" }) : new NoopService()) :
            new NoopService();
      },
      fullscreen: (): IFullscreen => {
         const { fullscreen } = this.settings.settings; // assumes settings has been initialized.
         return IsBrowser() ?
            (fullscreen ?
               new Fullscreen({ name: "fullscreen" }) :
               new MockFullscreen({ name: "mockFullscreen" })) :
            new MockFullscreen({ name: "mockFullscreen" });
      },
      gameSpeed: () => {
         const { gameSpeedSlider } = this.settings.settings; // assumes settings has been init:ed.
         return IsBrowser() ?
            (gameSpeedSlider ? new GameSpeed({ name: "gameSpeed" }) : new NoopService()) :
            new NoopService();
      },
      outsideHider: (): IOutsideHider => {
         const { outsideHider } = this.settings.settings; // assumes settings has been initialized.
         return IsBrowser() ?
            (outsideHider ? new OutsideHider({ name: "hider" }) : new NoopService()) :
            new NoopService();
      },
      pseudoRandom: (): IPseudoRandom => { return new PseudoRandom({ name: "pseudoRandom" }); },
   };

   /* Step 2 of initialization.
    * 
    * The rules are essentially:
    * 1. In constructor you init what you can without using other services (as dependencies).
    * 2. If you need other services to init, then do that initialization in the Init function */
   public Init = async () => {
      const {
         attributes,
         // collisions,
         enemies,
         events, eventsCollisions,
         gameLoop, gamepad, graphics,
         highscore,
         input,
         pseudoRandom,
         gameData,
         settings,
      } = this;

      /* Order of initialization usually don't matter.
       * Unfortunately GamaData has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await gameData.Init();

      // We want this first so that it can subscribe to shit and record last frame ASAP before
      // the next frame.
      await this.e2eTest.Init();
      await this.init.cursorShowGamePos();
      await settings.Init();
      await input.Init({
         events
      });
      await gameLoop.Init();
      await this.init.fps();
      // Note order of init: input -> collisions -> enemies -> graphics
      // Maybe another order would make more sense?
      // The current order: you move an enemy into a collision group, then you check for collisions
      // then enemies reponds to the collisions (in Enemies.tick), then all enemies clear their
      // `collidedWithCollisionTypesThisFrame`.
      await this.collisions.Init({
         attributes,
         enemies,
         events,
         eventsCollisions,
      });
      await enemies.Init({
         attributes,
         events,
         eventsCollisions,
         graphics,
         gameData,
         gamepad,
         input,
         pseudoRandom,
         settings,
      });
      await gamepad.Init();
      await this.events.Init();
      await this.eventsCollisions.Init();
      await this.init.gameSpeed();
      await this.graphics.Init();
      await this.ui.Init({
         gameLoop,
         highscore,
         input,
         settings,
         gameData,
      });
      await this.highscore.Init({
         gameData,
      });
      await this.init.fullscreen();
      await this.init.outsideHider();
      await this.init.attributes();
      await this.init.pseudoRandom();
   };

   /* Contains init functions keyed by service.
    * I think I have this public object here so that the init become exposed to the outside world.
    * TODO: Force sort this object alphabetically */
   public init = {
      attributes: async (): Promise<void> => { await this.attributes.Init(); },
      cursorShowGamePos: async (): Promise<void> => {
         const { fullscreen } = this;
         await this.cursorShowGamePos.Init({
            fullscreen,
         });
      },
      fps: async (): Promise<void> => { await this.fps.Init(); },
      fullscreen: async (): Promise<void> => { await this.fullscreen.Init(); },
      gameSpeed: async (): Promise<void> => {
         const { gameLoop, settings } = this;
         await this.gameSpeed.Init({
            gameLoop,
            settings,
         });
      },
      outsideHider: async (): Promise<void> => { await this.outsideHider.Init(); },
      pseudoRandom: async (): Promise<void> => { await this.pseudoRandom.Init(); },
   };
}