import type { App } from "../../App";
import type {
   IGraphics, TGraphics_Release, TGraphics_SetColor, TGraphics_SetDiameter, TGraphics_SetHealth,
   TGraphics_SetPosition, TGraphics_SetShape, TGraphicsAction, TGraphicsResponse, THandle,
   TResponse_AskForElement, TResponse_Void, TShape
} from "./IGraphics";

import { resolutionWidth, zIndices } from "../../../consts";
import { px } from "../../../utils/px";
import { uuid } from "../../../utils/uuid";
import { Vector as TVector } from "../../../math/bezier";
import { BrowserDriver } from "../../../drivers/BrowserDriver";

type TGraphicsElement = {
   handle: string; // Unique identifier used as handle for this specifc GraphicsElement.
   inUse: boolean // If the GraphicsElement is in use, or if it is free to give away.
   element: HTMLDivElement;
   index: number;
   shape: TShape;
   diameter: number;
}

type TConstructor = { app: App; name: string };

export class Graphics implements IGraphics {
   public app: App;
   public name: string;
   private elementPool: TGraphicsElement[];
   private static poolSize = 50;

   constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.elementPool = this.initElementPool();
   }

   Init = async () => {
      // noop
   };

   public Dispatch = (action: TGraphicsAction): TGraphicsResponse => {
      switch(action.type) {
         case "actionAskForElement":
            return this.actionAskForElement();
         case "actionSetPosition":
            return this.actionSetPosition(action);
         case "actionSetDiameter":
            return this.actionSetDiameter(action);
         case "actionSetHealth":
            return this.actionSetHealth(action);
         case "actionRelease":
            return this.actionRelease(action);
         case "actionSetColor":
            return this.actionSetColor(action);
         case "actionSetShape":
            return this.actionSetShape(action);
      }
   };

   private getRestingPlace = (i: number): TVector => {
      // const i = this.elementPool.findIndex(e => e.handle === element.handle);
      const column = Math.floor(i /10);
      const row = i % 10;
      const x = 20 + resolutionWidth + 10 * column;
      const y = 20 + 0 + 10 * row;
      return { x, y };
   };

   private initElementPool = (): TGraphicsElement[] => {
      return Array(Graphics.poolSize).fill(0).map((_, i) =>
         this.initOneElement(i)
      );
   };

   private reset = (ge: TGraphicsElement) => {
      const { x, y } = this.getRestingPlace(ge.index);
      const color = "orange";
      const diameter = 5;
      const radius = diameter/2;

      const top = y - radius;
      const left = x - radius;
   
      /** TODO: Remove duplication */
      ge.element.style.position = "fixed";
      ge.element.style.boxSizing = "border-box";
      ge.element.style.borderColor = color;
      ge.element.style.borderStyle = "solid";
      ge.element.style.borderWidth = px(radius); // filled
      ge.element.style.width = px(diameter);
      ge.element.style.height = px(diameter);
      ge.element.style.top = px(top);
      ge.element.style.left = px(left);
      ge.element.style.borderRadius = px(5000);
      ge.element.style.zIndex = zIndices.graphicsEngineElements;
   };

   private initOneElement = (i: number): TGraphicsElement => {
      const { x, y } = this.getRestingPlace(i);
      const color = "orange";
      const diameter = 5;
      const radius = diameter/2;

      const handle = `${uuid()}`;
      const top = y - radius;
      const left = x - radius;
   
      /** TODO: Remove duplication */
      const element = BrowserDriver.WithWindow(window => {
         const element = window.document.createElement("div");
         element.id = handle;
         element.style.position = "fixed";
         element.style.boxSizing = "border-box";
         element.style.borderColor = color;
         element.style.borderStyle = "solid";
         element.style.borderWidth = px(radius); // filled
         element.style.width = px(diameter);
         element.style.height = px(diameter);
         element.style.top = px(top);
         element.style.left = px(left);
         element.style.borderRadius = px(5000);
         element.style.zIndex = zIndices.graphicsEngineElements;
         window.document.body.appendChild(element);
         return element;
      }) as HTMLDivElement;

      return { handle, inUse: false, element, index: i, shape: "circle", diameter: 5 };
   };

   // Helper that finds and assert that an element exists and is in use.
   private findExistingAndInUse = (handle: THandle): TGraphicsElement => {
      const element = this.elementPool.find(element => element.handle === handle);
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
      const unusedElement = this.elementPool.find(element => !element.inUse);
      if(unusedElement) {
         unusedElement.inUse = true;
         return { type: "responseAskForElement", handle: unusedElement.handle };
      }
      BrowserDriver.Alert("Graphics: All elements are in use!");
      throw new Error("Graphics: All elements are in use!");
   };

   private actionSetPosition =
      ({ handle, x, y }: Omit<TGraphics_SetPosition,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const diameter = parseFloat(element.element.style.width);
         const radius = diameter/2;
         if(x !== undefined) {
            element.element.style.left = px(x - radius);
         }
         if(y !== undefined) {
            element.element.style.top = px(y - radius);
         }
         return { type: "responseVoid" };
      };

   private actionSetDiameter =
      ({ handle, diameter }: Omit<TGraphics_SetDiameter,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const oldRadius = element.diameter/2;
         const radius = diameter/2;
         const delta = radius - oldRadius;
         const style = element.element.style;
         style.width = px(diameter);
         style.height = px(diameter);
         style.left = px(parseFloat(style.left) - delta);
         style.top = px(parseFloat(style.top) - delta);

         element.diameter = diameter;
         return { type: "responseVoid" };
      };

   private actionSetHealth =
      ({ handle, healthFactor }: Omit<TGraphics_SetHealth,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         const radius = parseFloat(element.element.style.width)/2;
         element.element.style.borderWidth = px(radius * healthFactor);
         return { type: "responseVoid" };
      };

   private actionRelease =
      ({ handle }: Omit<TGraphics_Release,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);

         // Put back in resting position and reset styles.
         this.reset(element);
         
         element.inUse = false;
         return { type: "responseVoid" };
      };
   
   private actionSetColor =
      ({ handle, color }: Omit<TGraphics_SetColor,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         element.element.style.borderColor = color;
         return { type: "responseVoid" };
      };

   private actionSetShape =
      ({ handle, shape }: Omit<TGraphics_SetShape,"type">): TResponse_Void => {
         const element = this.findExistingAndInUse(handle);
         if(element.shape === shape) {
            return { type: "responseVoid" };
         }
         switch(shape) {
            case "circle": {
               element.element.style.borderRadius = px(5000);
               break;
            }
            case "square": {
               // element.style.position = "fixed";
               // element.style.boxSizing = "border-box";
               // element.style.borderColor = color;
               // element.style.borderStyle = "solid";
               // element.style.borderWidth = px(radius); // filled
               // element.style.width = px(diameter);
               // element.style.height = px(diameter);
               // element.style.top = px(top);
               // element.style.left = px(left);
               element.element.style.borderRadius = px(0);
               break;
            }
            case "triangle": {
               const dia = element.diameter;
               element.element.style.borderRadius = px(0);
               element.element.style.width = px(0);
               element.element.style.height = px(0);
               element.element.style.borderTopWidth = px(0);
               element.element.style.borderLeft = `${px(dia/2)} solid transparent`;
               element.element.style.borderRight = `${px(dia/2)} solid transparent`;
               element.element.style.borderBottom = `${px(dia)} solid red`;
               element.element.style.transform =
                  `translateX(${px(-dia/2)}) translateY(${px(-dia/2)})`;
               break;
            }
         }
         element.shape = shape;
         return { type: "responseVoid" };
      };
}
