import type { TAttributes, TAttrValue } from "./Attributes/IAttributes";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";

type TGameState = {
   frame: number;
   gameObjects: TAttributes["gameObjects"];
   points: number;
};

export let gameState: TGameState = {
   frame: 0,
   gameObjects: {},
   points: 0,
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

export function getFrame(): number {
   return gameState.frame;
}
export function setFrame(frame: number): void {
   gameState = { ...gameState, frame };
}
export function incrementFrame(): void {
   gameState = {
      ...gameState,
      frame: gameState.frame + 1
   };
}

/* POINTS */
export function getPoints(): number {
   return gameState.points;
}
export function setPoints(points: number): void {
   gameState = { ...gameState, points };
}
export function incrementPoints(points: number) {
   gameState = {
      ...gameState,
      points: gameState.points + points,
   };
}

/* ATTRIBUTES */
export function getAttribute(gameObjectId: string, attribute: string): TAttrValue | undefined {
   return gameState.gameObjects[gameObjectId]?.[attribute];
}
export function setAttribute(gameObjectId: string, attribute: string, value: TAttrValue): void {
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
