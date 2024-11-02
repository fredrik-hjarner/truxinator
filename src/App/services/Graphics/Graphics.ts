import type {
   IGraphics, TGfx_FillScreen, TGfx_Release, TGfx_ScrollBg, TGfx_SetColor,
   TGfx_SetDiameter,
   TGfx_SetPosition, TGfx_SetRotation, TGfx_SetScale, TGfx_SetShape, TGraphicsAction,
   TGraphicsResponse, THandle, TResponse_AskForElement, TResponse_Void
} from "./IGraphics";
import type { Vector as TVector } from "../../../math/bezier";

import { ActionType as AT } from "../Enemies/actions/actionTypes.ts";
import { resolutionWidth } from "../../../consts.ts";
import { uuid } from "../../../utils/uuid.ts";
import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { GraphicsElement } from "./GraphicsElement.ts";

type TGfxPoolEntry = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   inUse: boolean // If the GraphicsElement is in use, or if it is free to give away.
   element: GraphicsElement;
   /**
    * I think only needed for calculating "resting place" i.e. where they are placed when not used.
    * Should probably not be used/have any affect in production.
    */
   index: number;
}

type TGfxPool = Partial<{ [handle: string]: TGfxPoolEntry }>;

export class Graphics implements IGraphics {
   public readonly name: string;
   private elementPool: TGfxPool;
   private static readonly poolSize = 150;

   public constructor() {
      this.name = "Graphics"; // TODO: I could probably remove the name, I dont think its needed.
      this.elementPool = this.initElementPool();
   }

   public destroy = () => {
      /**
       * Unsubscribe from events.
       */
      
      /**
        * reset vars
        */
      for (const element of Object.values(this.elementPool)) {
         if(element !== undefined) {
            element.element.destroy();
         }
      }
      this.elementPool = {};

      /**
        * Destroy elements
        */
   };

   public Init = async () => {
      // noop
   };

   public Dispatch = (action: TGraphicsAction): TGraphicsResponse => {
      switch(action.type) {
         case AT.gfxAskForElement:
            return this.actionAskForElement();
         case AT.gfxSetPosition:
            return this.actionSetPosition(action);
         case AT.gfxSetDiameter:
            return this.actionSetDiameter(action);
         case AT.gfxRelease:
            return this.actionRelease(action);
         case AT.gfxSetColor:
            return this.actionSetColor(action);
         case AT.gfxSetShape:
            return this.actionSetShape(action);
         case AT.gfxSetRotation:
            return this.actionSetRotation(action);
         case AT.gfxSetScale:
            return this.actionSetScale(action);
         case AT.gfxScrollBg:
            return this.actionScrollBg(action);
         case AT.gfxFillScreen:
            return this.actionFillScreen(action);
         default: {
            // eslint-disable-next-line
            // @ts-ignore
            const errMsg = `unknown action type: ${action.type}`; // eslint-disable-line
            BrowserDriver.Alert(errMsg); 
            throw new Error(errMsg);
         }
      }
   };

   private getRestingPlace = (i: number): TVector => {
      const column = Math.floor(i /10);
      const row = i % 10;
      const x = 20 + resolutionWidth + 10 * column;
      const y = 20 + 0 + 10 * row;
      return { x, y };
   };

   private initElementPool = (): TGfxPool => {
      const arr100 = Array(Graphics.poolSize).fill(0);
      const result: TGfxPool = {};
      for (const [i] of arr100.entries()) {
         const element = this.initOneElement(i);
         result[element.handle] = element;
      }
      return result;
   };

   private initOneElement = (i: number): TGfxPoolEntry => {
      const { x, y } = this.getRestingPlace(i);
      return {
         handle: `${uuid("guid")}`,
         inUse: false,
         element: new GraphicsElement(x, y),
         index: i,
      };
   };

   // Helper that finds and assert that an element exists and is in use.
   private findExistingAndInUse = (handle: THandle): TGfxPoolEntry => {
      const element = this.elementPool[handle];
      if(!element) {
         BrowserDriver.Alert(`Graphics: No GraphicsElement with handle "${handle}"!`);
         throw new Error(`Graphics: No GraphicsElement with handle "${handle}"!`);
      }
      if(!element.inUse) {
         BrowserDriver.Alert(`Graphics: Trying to set position for unused handle "${handle}"!`);
         throw new Error(`Graphics: Trying to set position for unused handle "${handle}"!`);
      }
      return element;
   };

   private actionAskForElement = (): TResponse_AskForElement => {
      const unusedElement = Object.values(this.elementPool)
         .find((element) => !(element!).inUse);
      if(unusedElement) {
         unusedElement.inUse = true;
         return { type: "responseAskForElement", handle: unusedElement.handle };
      }
      BrowserDriver.Alert("Graphics: All elements are in use!");
      throw new Error("Graphics: All elements are in use!");
   };

   private actionSetPosition =
      ({ handle, x, y }: Omit<TGfx_SetPosition,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         if(x !== undefined) {
            gfxEntry.element.setX(x);
         }
         if(y !== undefined) {
            gfxEntry.element.setY(y);
         }
         return { type: "responseVoid" };
      };

   private actionSetDiameter =
      ({ handle, diameter }: Omit<TGfx_SetDiameter,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setDiameter(diameter);
         return { type: "responseVoid" };
      };

   private actionRelease =
      ({ handle }: Omit<TGfx_Release,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);

         // Put back in resting position and reset styles.
         const { x, y } = this.getRestingPlace(gfxEntry.index);
         gfxEntry.element.reset(x, y);
         gfxEntry.inUse = false;
         return { type: "responseVoid" };
      };
   
   private actionSetColor =
      ({ handle, color }: Omit<TGfx_SetColor,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setColor(color);
         return { type: "responseVoid" };
      };

   private actionSetShape =
      ({ handle, shape }: Omit<TGfx_SetShape,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setShape(shape);
         return { type: "responseVoid" };
      };

   private actionSetRotation =
      ({ handle, degrees }: Omit<TGfx_SetRotation,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setRotation(degrees);
         return { type: "responseVoid" };
      };

   private actionSetScale =
      ({ handle, scale }: Omit<TGfx_SetScale,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.setScale(scale);
         return { type: "responseVoid" };
      };

   // scrolls the background by amount.
   private actionScrollBg =
      ({ handle, x, y }: Omit<TGfx_ScrollBg,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.scrollBg({ x, y });
         return { type: "responseVoid" };
      };
   
   // Sizes the element to cover the whole screen area be positionend at top right corner.
   private actionFillScreen =
      ({ handle }: Omit<TGfx_FillScreen,"type">): TResponse_Void => {
         const gfxEntry = this.findExistingAndInUse(handle);
         gfxEntry.element.fillScreen();
         return { type: "responseVoid" };
      };
}
