import type { TRandomInt } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

import { BrowserDriver } from "../drivers/BrowserDriver/index.ts";
import { IsBrowser } from "../drivers/BrowserDriver/IsBrowser.ts";

export const isObject = (value: unknown): value is Partial<Record<string, unknown>> => {
   return typeof value === "object";
};
export const isNumber = (value: unknown): value is number => {
   return typeof value === "number";
};
export const isString = (value: unknown): value is string => {
   return typeof value === "string";
};
export const isBoolean = (value: unknown): value is boolean => {
   return typeof value === "boolean";
};
export const isRandomIntParam = (value: unknown): value is TRandomInt => {
   return typeof value === "object" && value !== null && "min" in value;
};

export const assertNumber = (value: unknown): number => {
   if(!isNumber(value)) {
      const error = `assertNumber: ${JSON.stringify(value)} is not of type "number"`;
      BrowserDriver.Alert(error);
      throw new Error(error);
   }
   return value;
};

export const assertString = (value: unknown): string => {
   if(!isString(value)) {
      const error = `assertString: ${JSON.stringify(value)} is not of type "string"`;
      BrowserDriver.Alert(error);
      throw new Error(error);
   }
   return value;
};

export const isHTMLDivElement = (value: unknown): value is HTMLDivElement => {
   if(!IsBrowser()) {
      return false;
   }
   // eslint-disable-next-line no-undef
   return value instanceof window.HTMLDivElement;
};

export const isHTMLInputElement = (value: unknown): value is HTMLInputElement => {
   if(!IsBrowser()) {
      return false;
   }
   // eslint-disable-next-line no-undef
   return value instanceof window.HTMLInputElement;
};