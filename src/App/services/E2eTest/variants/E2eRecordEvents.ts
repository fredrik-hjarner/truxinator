import type {
   IGameEvents, TGameEvent,
} from "../../Events/IEvents";
import type { IE2eTest } from "../IE2eTest";
import type { TInitParams } from "../../IService";

import { gameState, sendDiffToDevTools, setFrame } from "../../GameState.ts";
import { enableReduxDevTools } from "@/consts.ts";

type THistory = Partial<{
   [gameObjectId: string]: unknown // hp
}>[];

type TConstructor = {
   name: string
}

/**
 * Record all attributes. Subscribe as first subscriber to gameLoop. Immediately when next_frame
 * happens, record all attributes `event.frameNr - 1`.
 */
export class E2eRecordEvents implements IE2eTest {
   public readonly name: string;

   // local history (what actually happened)
   // Store it later in file that has, so to speak, been pre-recorded.
   private history: THistory = [];

   // deps/services
   private events!: IGameEvents;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Replace typecast with type guard.
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      this.events = deps?.events!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

      // TODO: These are not unsubscribed to.
      this.events.subscribeToEvent(this.name, this.onEvent);
   };

   private onEvent = (event: TGameEvent) => {
      if (event.type === "gameOver") {
         console.log("E2eRecordEvents.history:");
         console.log(this.history);
         // TODO: Should it destruct itself or something here?
      }
      if (event.type === "frame_tick") {
         const lastFrame = event.frameNr - 1;
         // (first frame is frame nr 1 though)
         if(lastFrame < 0) {
            return;
         }
         if(!this.history[lastFrame]) { // TODO: really if-case not needed should always be set {}.
            this.history[lastFrame] = {};
         }
         // grab attributes and store them in history.
         for (const [gameObjectId, attribute] of Object.entries(gameState.gameObjects)) {
            this.history[lastFrame][gameObjectId] = attribute?.hp;
         }

         // TODO: Shouldn't be here but whatever.
         if(enableReduxDevTools) {
            setFrame(lastFrame);
            sendDiffToDevTools();
         }
      }
   };
}