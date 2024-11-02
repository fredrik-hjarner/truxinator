import type { TAttributes, TAttrValue } from "./Attributes/IAttributes";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";

type TGameState = {
   frame: number;
   gameObjects: TAttributes["gameObjects"];
};

export let gameState: TGameState = {
   frame: 0,
   gameObjects: {}
};

/* eslint-disable */
let devTools: any;

BrowserDriver.WithWindow((window) => {
   if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect();
      devTools.init(gameState);
   }
});
/* eslint-enable */

export function setFrame(frame: number): void {
   gameState = {
      ...gameState,
      frame
   };
}

export function getAttribute(gameObjectId: string, attribute: string): TAttrValue | undefined {
   return gameState.gameObjects[gameObjectId]?.[attribute];
}

export function setAttribute(gameObjectId: string, attribute: string, value: TAttrValue): void {
   // console.log("Setting attribute:", gameObjectId, attribute, value);
   // Create entirely new state object
   gameState = {
      ...gameState,
      gameObjects: {
         ...gameState.gameObjects,
         [gameObjectId]: {
            ...gameState.gameObjects[gameObjectId],
            [attribute]: value
         }
      }
   };
}

export function sendDiffToDevTools(): void {
   /* eslint-disable */
   if (devTools) {
      // console.log("Sending game state to Redux DevTools:", gameState);
      devTools.send("UPDATE", gameState);
   }
   /* eslint-enable */
}
