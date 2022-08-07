/**
 * Interfaces
 */
import type { IInput } from "./services/Input/IInput";
import type { IGameLoop } from "./services/GameLoop/IGameLoop";
import type { IFps } from "./services/Fps/IFps";
import type { IGraphics } from "./services/Graphics/IGraphics";
import type { IPoints } from "./services/Points/IPoints";
import type { IUI } from "./services/UI/IUI";
import type {
   IEventsCollisions,
   IEventsPoints, IGameEvents, IUiEvents, TCollisionsEvent, TGameEvent, TPointsEvent, TUiEvent
} from "./services/Events/IEvents";
import type { IGameSpeed } from "./services/GameSpeed/IGameSpeed";
import type { IFullscreen } from "./services/Fullscreen/IFullscreen";
import type { IParallax } from "./services/Parallax/IParallax";
import type { IE2eTest } from "./services/E2eTest/IE2eTest";
import type { IOutsideHider } from "./services/OutsideHider/IOutsideHider";

/**
 * Services
 */
import { Enemies } from "./services/Enemies/Enemies";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fps } from "./services/Fps/Fps";
import { Input } from "./services/Input/Input";
import { GamePad } from "./services/GamePad/GamePad";
import { Collisions } from "./services/Collisions/Collisions";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Events } from "./services/Events/Events";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GameSpeed } from "./services/GameSpeed/GameSpeed";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Points } from "./services/Points/Points";
import { Highscore } from "./services/Highscore/Highscore";
import { Yaml } from "./services/Yaml/Yaml";
import { Graphics } from "./services/Graphics/Graphics";
import { UI } from "./services/UI/UI";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fullscreen } from "./services/Fullscreen/Fullscreen";
import { Parallax } from "./services/Parallax/Parallax";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { E2eTest } from "./services/E2eTest/E2eTest";
import { Settings } from "./services/Settings/Settings";
import { OutsideHider } from "./services/OutsideHider/OutsideHider";

/**
 * "Mocks"/Service variations
 */
import { NoopService } from "./services/NoopService";
import { ReplayerInput } from "./services/Input/mocks/ReplayerInput";
import { MockGraphics } from "./services/Graphics/MockGraphics";
import { NodeGameLoop } from "./services/GameLoop/variants/NodeGameLoop";
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReqAnimFrameGameLoop } from "./services/GameLoop/variants/ReqAnimFrameGameLoop";
import { MockFps } from "./services/Fps/variants/MockFps";
import { E2eRecordEvents } from "./services/E2eTest/variants/E2eRecordEvents";

/**
 * Other
 */
import { IsBrowser } from "../drivers/BrowserDriver";

export class App {
   // types here should not be IService but rather something that implements IService.
   // TODO: also all types should NOT be concrete types, but interfaces.
   public e2eTest: IE2eTest;
   public settings: Settings;
   public input: IInput;
   public gameLoop: IGameLoop;
   public fps: IFps;
   public enemies: Enemies;
   public gamepad: GamePad;
   public collisions: Collisions;
   public events: IGameEvents;
   public eventsCollisions: IEventsCollisions;
   /**
    * only listened to by the UI & UI Scenes,
    * other services send messages over eventsUi so that the UI know when to update.
    */
   public eventsUi: IUiEvents;
   public eventsPoints: IEventsPoints;
   public gameSpeed: IGameSpeed;
   public points: IPoints;
   public highscore: Highscore;
   public yaml: Yaml;
   public graphics: IGraphics;
   public ui: IUI;
   public fullscreen: IFullscreen;
   public parallax: IParallax;
   public outsideHider: IOutsideHider;

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
      const {
         gameSpeedSlider, fpsStats, outsideHider, autoplay
      } = this.settings.settings;

      this.e2eTest = IsBrowser() ?
         // new NoopService({ name: "e2e" }) :
         new E2eRecordEvents({ name: "e2e" }) :
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

      this.fps = IsBrowser() ?
         (fpsStats ?
            new Fps({ app: this, name: "fps" }) :
            new MockFps({ app: this, name: "fps" })
         ) :
         new MockFps({ app: this, name: "fps" });

      this.enemies = new Enemies({ name: "enemies" });

      this.gamepad = new GamePad({ name: "gamePad" });

      this.collisions = new Collisions({ name: "collisions" });

      this.events =           new Events<TGameEvent>({ app: this, name: "events" });
      this.eventsCollisions = new Events<TCollisionsEvent>({ app: this, name: "eventsCollisions" });
      this.eventsUi =         new Events<TUiEvent>({ app: this, name: "eventsUi" });
      this.eventsPoints =     new Events<TPointsEvent>({ app: this, name: "eventsPoints" });

      this.gameSpeed = IsBrowser() ?
         (gameSpeedSlider ?
            new GameSpeed({ name: "gameSpeed" }) :
            new NoopService({ name: "gameSpeed" })
         ) :
         new NoopService({ name: "gameSpeed" });

      this.points = new Points({ app: this, name: "points" });

      this.highscore = new Highscore({ name: "highscore" });

      this.yaml = new Yaml({ name: "yaml" });

      this.graphics = IsBrowser() ?
         new Graphics({ name: "graphics" }) :
         new MockGraphics({ name: "mockGraphics" });

      this.ui = IsBrowser() ?
         new UI({ name: "ui" }) :
         new NoopService({ name: "mockUi" });

      this.fullscreen = this.construct.fullscreen();

      this.parallax = IsBrowser() ?
         new Parallax({ name: "parallax" }) :
         new NoopService({ name: "parallax" });

      this.outsideHider = IsBrowser() ?
         (outsideHider ?
            new OutsideHider({ name: "hider" }) :
            new NoopService({ name: "hider" })
         ) :
         new NoopService({ name: "hider" });
   }

   /**
    * Contains construction functions keyed by service.
    */
   public construct = {
      fullscreen: (): IFullscreen => {
         const { fullscreen } = this.settings.settings; // assumes settings has been initialized.
   
         return IsBrowser() ?
            (fullscreen ?
               new Fullscreen({ name: "fullscreen" }) :
               new NoopService({ name: "fullscreen" })
            ) :
            new NoopService({ name: "fullscreen" });
      }
   };

   /**
    * Step 2 of initialization.
    * 
    * The rules are essentially:
    * 1. In constructor you init what you can without using other services (as dependencies).
    * 2. If you need other services to init, then do that initialization in the Init function.
    */
   public Init = async () => {
      const {
         collisions,
         enemies,
         events, eventsCollisions, eventsPoints, eventsUi,
         gameLoop, gamepad, graphics,
         highscore,
         input,
         points,
         yaml,
         settings,
      } = this;

      /**
       * Order of initialization usually don't matter.
       * Unfortunately Yaml has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await yaml.Init();

      await settings.Init();
      await this.e2eTest.Init({
         collisions, // only to be able to write out performance stats.
         events,
         eventsCollisions,
         eventsPoints,
      });
      await input.Init({
         events
      });
      await gameLoop.Init();
      await this.fps.Init();
      await enemies.Init({
         events,
         eventsCollisions,
         eventsPoints,
         graphics,
         yaml,
         input,
         gamepad
      });
      await gamepad.Init();
      await this.collisions.Init({
         enemies,
         events,
         eventsCollisions,
      });
      await this.events.Init();
      await this.eventsCollisions.Init();
      await this.eventsPoints.Init();
      await this.eventsUi.Init();
      await this.gameSpeed.Init({
         gameLoop,
         settings,
      });
      await this.points.Init();
      await this.graphics.Init();
      await this.ui.Init({
         events,
         eventsUi,
         gameLoop,
         highscore,
         input,
         points,
         settings,
      });
      await this.highscore.Init();
      await this.fullscreen.Init();
      await this.parallax.Init({
         events,
      });
      await this.outsideHider.Init();
   };
}