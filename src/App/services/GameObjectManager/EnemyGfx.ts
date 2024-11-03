import type { Vector as TVector } from "../../../math/bezier.ts";
import type {
   IGraphics, TGraphicsActionWithoutHandle , TResponse_AskForElement
} from "../Graphics/IGraphics.ts";

import { ActionType as AT } from "./actions/actionTypes.ts";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";

type TConstructor = {
   graphics: IGraphics; // Graphics service;
   x: number;
   y: number;
   diameter: number;
}

export class EnemyGfx {
   private graphics: IGraphics;
   private gfxHandle: string; // handle to graphics element.

   public constructor(args: TConstructor){
      const { graphics, x, y, diameter } = args;

      this.graphics = graphics;

      this.gfxHandle =
         (this.graphics.Dispatch({ type:AT.gfxAskForElement }) as TResponse_AskForElement).handle;
      this.graphics.Dispatch({ type:AT.gfxSetPosition, handle: this.gfxHandle, x, y });
      this.graphics.Dispatch({ type:AT.gfxSetDiameter, handle: this.gfxHandle, diameter });
      this.graphics.Dispatch({ type:AT.gfxSetColor, handle: this.gfxHandle, color: "red" });
      this.graphics.Dispatch({ type:AT.gfxSetShape, handle: this.gfxHandle, shape:"diamondShield"});
   }

   public setPosition = ({ x, y }: TVector) => {
      this.graphics.Dispatch({ type:AT.gfxSetPosition, handle: this.gfxHandle, x, y });
   };

   public release = () => {
      this.graphics.Dispatch({ type: AT.gfxRelease, handle: this.gfxHandle });
   };

   public setRotation = ({ degrees }: { degrees: number }) => {
      this.graphics.Dispatch({ type: AT.gfxSetRotation, handle: this.gfxHandle, degrees: degrees });
   };

   public dispatch = (action: TGraphicsActionWithoutHandle) => {
      switch(action.type) {
         case AT.gfxSetColor:
         case AT.gfxSetDiameter:
         case AT.gfxSetPosition:
         case AT.gfxSetRotation:
         case AT.gfxSetShape:
         case AT.gfxSetScale:
         case AT.gfxScrollBg:
         case AT.gfxFillScreen:
            this.graphics.Dispatch({ ...action, handle: this.gfxHandle });
            break;
         default:
            BrowserDriver.Alert(
               `${(action as {type: string}).type} not handled in EnemyGfx.dispatch!\n` +
               `The full offending action:\n` +
               `${JSON.stringify(action, null, 2)}`
            );
      }
   };
}