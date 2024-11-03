import type { TGameObject } from "@/gameTypes/TGameObject.ts";

import { createGameObject, forever, spawn, wait } from "@/gameData/utils/utils.ts";
import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

export const parallax: TGameObject = createGameObject({
   name: "parallax",
   diameter: 240,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetColor, color: "black" },
      { type: AT.gfxSetShape, shape: "square" },
      { type: AT.gfxFillScreen },
      spawn("layer1"),
      spawn("layer2"),
      spawn("layer3"),
   ],
});

export const layer1: TGameObject = createGameObject({
   name: "layer1",
   diameter: 240,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "layer1.png" },
      { type: AT.gfxFillScreen },
      forever(
         wait(1),
         { type: AT.gfxScrollBg, x: 0.3 }
      )
   ],
});

export const layer2: TGameObject = createGameObject({
   name: "layer2",
   diameter: 240,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "layer2.png" },
      { type: AT.gfxFillScreen },
      forever(
         wait(1),
         { type: AT.gfxScrollBg, x: 1 }
      )
   ],
});

export const layer3: TGameObject = createGameObject({
   name: "layer3",
   diameter: 240,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "layer3.png" },
      { type: AT.gfxFillScreen },
      forever(
         wait(1),
         { type: AT.gfxScrollBg, x: 1.5 }
      )
   ],
});