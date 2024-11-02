import type {
   IAttributes,
   TAttrValue,
   TGameObjectIdAndAttrParams,
   TGetAttrParams,
   TIncrDecrAttrParams,
   TSetAttrParams
} from "./IAttributes.ts";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { gameState, getAttribute, setAttribute } from "../GameState.ts";

type TConstructor = {
   name: string;
}

export class Attributes implements IAttributes {
   // vars
   public readonly name: string;

   public constructor({ name }: TConstructor) {
      this.name = name;
   }

   public Init = async () => {
      // NOOP
   };

   public destroy = () => {
      // NOOP
   };

   private getAndAssertAttribute = ({ gameObjectId, attribute }: TGetAttrParams): TAttrValue => {
      const value = getAttribute(gameObjectId, attribute);
      if(value === undefined){
         const msg = `Attribute:  Attribute "${attribute}" does not exist.`;
         console.warn(msg);
      }
      return value!;
   };

   public setAttribute = ({ gameObjectId, attribute, value }: TSetAttrParams) => {
      setAttribute(gameObjectId, attribute, value);
   };

   public getAttribute = (params: TGameObjectIdAndAttrParams): TAttrValue => {
      return this.getAndAssertAttribute(params);
   };

   public getNumber = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): number => {
      const value = getAttribute(gameObjectId, attribute);
      if(typeof value !== "number"){
         const msg = `Attributes.getNumber: "${attribute}" expected to be number but is ${value}.`;
         console.error(msg);
      }
      return value as number;
   };

   public getString = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): string => {
      const value = getAttribute(gameObjectId, attribute);
      if(typeof value !== "string"){
         const msg = `Attributes.getString: "${attribute}" expected to be string but is ${value}.`;
         console.error(msg);
      }
      return value as string;
   };

   public getBool = ({ gameObjectId, attribute }: TGameObjectIdAndAttrParams): boolean => {
      return !!getAttribute(gameObjectId, attribute);
   };

   public incr = (params: TIncrDecrAttrParams) => {
      const attr = this.getAndAssertAttribute(params);
      if(typeof attr !== "number") {
         const msg =
            "Attribute.incr: Tried to increment " +
            `${params.attribute} which is of type ${typeof params.attribute}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      const newValue = (attr as number) + params.amount;
      setAttribute(params.gameObjectId, params.attribute, newValue);
   };

   public decr = (params: TIncrDecrAttrParams) => {
      const attr = this.getAndAssertAttribute(params);
      if(typeof attr !== "number") {
         const msg =
            "Attribute.decr: Tried to decrement" +
            `${params.attribute} which is of type ${typeof params.attribute}`;
         BrowserDriver.Alert(msg);
         throw new Error(msg);
      }
      const newValue = (attr as number) - params.amount;
      setAttribute(params.gameObjectId, params.attribute, newValue);
   };

   public removeGameObject = (gameObjectId: string) => {
      delete gameState.gameObjects[gameObjectId];
   };
}

