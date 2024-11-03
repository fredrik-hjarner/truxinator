import type { TGameObject } from "@/gameTypes/TGameObject";
import type { TAction } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   forever,
   fork,
   parallelAll,
   repeat,
   spawn,
   wait,
} from "@/gameData/utils/utils.ts";
import { col } from "../common.ts";

const shootInAll8Directions = (shootSpeed: number): TAction[] => [
   // blink to signal it's about to shoot
   { type: AT.gfxSetColor, color: "aqua" },
   { type: AT.wait, frames: 10 },
   { type: AT.gfxSetColor, color: "red" },
   { type: AT.wait, frames: 10 },

   { type: AT.setShotSpeed, pixelsPerFrame: shootSpeed },

   { type: AT.shootDirection, x: 1, y: -1 },
   { type: AT.shootDirection, x: 1, y: 0 },
   { type: AT.shootDirection, x: 1, y: 1 },
   { type: AT.shootDirection, x: 0, y: 1 },
   { type: AT.shootDirection, x: -1, y: 1 },
   { type: AT.shootDirection, x: -1, y: 0 },
   { type: AT.shootDirection, x: -1, y: -1 },
   { type: AT.shootDirection, x: 0, y: -1 },
];

const shotsAtPlayer: TAction[] = [
   repeat(4, [
      { type: AT.setShotSpeed, pixelsPerFrame: 0.9 },
      { type: AT.shootTowardPlayer }, 
      { type: AT.wait, frames: 70 }
   ]),

   repeat(10, [
      { type: AT.setShotSpeed, pixelsPerFrame: 1.0 },
      { type: AT.shootTowardPlayer }, 
      { type: AT.wait, frames: 28 }
   ]),

   repeat(16, [
      { type: AT.setShotSpeed, pixelsPerFrame: 1.1 },
      { type: AT.shootTowardPlayer }, 
      { type: AT.wait, frames: 8 }
   ]),

   forever(
      { type: AT.setShotSpeed, pixelsPerFrame: 1.1 },
      { type: AT.shootTowardPlayer }, 
      { type: AT.wait, frames: 8 }
   ),
];

const shootingPattern: TAction[] = [
   parallelAll(
      shotsAtPlayer,
      [
         wait(7 * 60),
         repeat(5, [
            ...shootInAll8Directions(0.8),
            { type: AT.wait, frames: 300 }
         ]),
         forever(
            ...shootInAll8Directions(0.8),
            { type: AT.wait, frames: 150 }
         ),
      ]
   )
];

const movePattern: TAction[] = [
   { type: AT.moveToAbsolute, frames: 60 * 7.5, moveTo: { x: col[5] }}
];

export const boss: TGameObject = createGameObject({
   name: "boss",
   hp: 100_000, // immortal.
   diameter: 40,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         spawn("bossCorpse"),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetShape, shape: "stage2/circle.png" },
      ...movePattern,
      { type: AT.setAttribute, attribute: "hp", value: 70 }, // In fact make it immortal until now.
      parallelAll(
         shootingPattern
      )
   ]
});