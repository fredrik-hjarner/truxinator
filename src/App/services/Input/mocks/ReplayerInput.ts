import type { IGameEvents } from "../../Events/IEvents";

import type { TInitParams } from "../../IService";
import type { ButtonsPressed, IInput } from "../IInput";

import { getFrame } from "../../GameState.ts";

type THistory = {
   inputs: Partial<{ [frame: number]: Partial<ButtonsPressed> }>
};

type TConstructor = {
   name: string;
};

/**
 * A Input that replays input that were already recorded.
 * Imports the replay.ts file and simply runs the same inputs.
 */
export class ReplayerInput implements IInput {
   // vars
   public readonly name: string;
   /**
    * Keep track of which frame it is "locally" in this object.
    * the current frame comes with the "frame_tick" event.
    * Since we want as few dependencies as possible we want to ONLY be dependent on the Events
    * service and NOT also have to grab FrameCount off the GameLoop service directly.
    */
   private frameCount = 0;
   // From file. Pre-recorded.
   private replay!: THistory;

   // deps/services
   private events!: IGameEvents;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async (deps?: TInitParams) => {
      this.replay = (await import("./replay.ts")).replay as THistory;

      // TODO: Better type checking
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.events = deps?.events!;

      this.events.subscribeToEvent(this.name, (event) => {
         switch(event.type) {
            case "frame_tick":
               this.frameCount = getFrame();
               break;
            default:
               // NOOP
         }
      });
   };

   public get ButtonsPressed(): ButtonsPressed {
      const frame = `${this.frameCount}`;
      const allFalse = {
         start: false, down: false, left: false, right: false, shoot: false, laser: false, up: false
      };
      if(!(frame in this.replay.inputs)) {
         return allFalse;
      }
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const buttonsPressed: ButtonsPressed = {...allFalse, ...this.replay.inputs[frame]};
      return buttonsPressed;
   }
}
