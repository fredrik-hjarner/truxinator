import type { ButtonsPressed, IInput, TKey } from "./IInput";
import type { IGameEvents } from "../Events/IEvents";
import type { TInitParams } from "../IService";

import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { getFrame } from "../GameState.ts";

type TConstructor = {
   name: string;
};

export class Input implements IInput {
   // deps/services
   private events!: IGameEvents;

   // vars
   public readonly name: string;
   private history: {
      inputs: {
         [frame: string]: ButtonsPressed;
      };
      score: number;
   };
   private buttonsPressed: ButtonsPressed = {
      start: false,
      shoot: false,
      laser: false,
      left: false,
      right: false,
      up: false,
      down: false,
   };
   /**
    * onKeyUpCallback seems to be used by UI exclusively. 
    */
   public onKeyUpCallback?: (key: TKey) => void;
   /**
    * Keep track of which frame it is "locally" in this object.
    * the current frame comes with the "frame_tick" event.
    * Since we want as few dependencies as possible we want to ONLY be dependent on the Events
    * service and NOT also have to grab FrameCount off the GameLoop service directly.
    */
   private frameCount = 0;

   public constructor({ name }: TConstructor) {
      this.name = name;
      this.history = { inputs: {}, score: 0 };
      BrowserDriver.WithWindow(window => {
         window.document.onkeydown = this.handleKeyDown;
         window.document.onkeyup = this.handleKeyUp;
      });
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      // TODO: Better type checking.
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      this.events = deps?.events!;

      this.events.subscribeToEvent(this.name, (event) => {
         switch(event.type) {
            // TODO: Grabbing the frameNr like this might be retarded instead of grabbing it
            // directly from GameLoop.
            case "frame_tick":
               this.frameCount = getFrame();
               break;
         }
      });
   };

   public onGameOver = () => {
      console.log("Input.history:");
      console.log(this.history);
   };

   public get ButtonsPressed(): ButtonsPressed {
      //#region push to history
      const frame = this.frameCount;
      const buttonsPressed = { ...this.buttonsPressed };
      const wasPressed = Object.values(buttonsPressed).includes(true);
      if(wasPressed) {
         for (const k of Object.keys(buttonsPressed)) {
            if(k === "laser" || k === "shoot" || k === "up" ||
               k === "down" || k === "left" || k === "right" ||
               k === "start") {
               if(buttonsPressed[k] === false) {
                  delete buttonsPressed[k];
               }
            }
         }
         // TODO: Hm. If ButtonsPressed is called several times in the same frame, it will be
         // overwritten. Would be more consistent if I grabbed the input once per frame though
         // that might risk missing some inputs (probably not as 60fps should be enough).
         this.history.inputs[frame] = buttonsPressed;
      }
      //#endregion
      return this.buttonsPressed;
   }

   // reset() {
   //    this.buttonsPressed = {
   //       space: false,
   //       left: false,
   //       right: false,
   //       up: false,
   //       down: false,
   //    };
   // }

   private handleKey = (e: KeyboardEvent, value: boolean): TKey | undefined => {
      switch (e.keyCode) {
         case 13:
            // Enter
            this.buttonsPressed.start = value;
            // TODO: This is pretty ugly should have a "map" or something.
            return "start";
         case 32:
            // Space
            this.buttonsPressed.shoot = value;
            return "shoot";
         case 17:
            // Ctrl
            this.buttonsPressed.laser = value;
            return "laser";
         case 37:
            // Left
            this.buttonsPressed.left = value;
            return "left";
         case 38:
            // Up
            this.buttonsPressed.up = value;
            return "up";
         case 39:
            // Right
            this.buttonsPressed.right = value;
            return "right";
         case 40:
            // Down
            this.buttonsPressed.down = value;
            return "down";
            // case 27:
            //   // Escape
            //   this.buttonsPressed[Button.RESET] = value;
            //   break;
         default:
            return undefined;
      }
   };

   private handleKeyDown = (e: KeyboardEvent) => {
      this.handleKey(e, true);
   };

   private handleKeyUp = (e: KeyboardEvent) => {
      const effectedKey =this.handleKey(e, false);
      if(effectedKey !== undefined) {
         this.onKeyUpCallback?.(effectedKey);
      }
   };
}
