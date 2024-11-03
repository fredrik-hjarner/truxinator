import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, forever, fork, repeat, spawn, wait } from "../utils/utils.ts";
import { col, row } from "./common.ts";

export const stage5: TGameObject = createGameObject({
   name: "stage5",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.gfxSetShape, shape: "none" },
      spawn("aqua", { x: col[1], y: row[3] }),
      spawn("executor", { x: col[2], y: row[5] }),
      spawn("shotSpeedFromHp", { x: col[3], y: row[5] }),
      spawn("repeatFromHp", { x: col[4], y: row[5] }),
      spawn("parent", { x: col[7], y: row[5] }),
   ],
});

// Proves that attribute getter work with wait action.
export const shotSpeedFromHp: TGameObject = createGameObject({
   name: "shotSpeedFromHp",
   diameter: 20,
   hp: 50,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setShotSpeed, pixelsPerFrame: 1.8 },
      forever(
         wait({ attr: "hp" }),
         { type: AT.shootDirection, x: 0, y: -1 },
      )
   ],
});

// Proves that attribute getter work with repeat action.
export const repeatFromHp: TGameObject = createGameObject({
   name: "repeatFromHp",
   diameter: 20,
   hp: 50,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setShotSpeed, pixelsPerFrame: 1.8 },
      forever(
         repeat({ attr: "hp" }, [
            wait(1)
         ]),
         { type: AT.shootDirection, x: 0, y: -1 },
      )
   ],
});

export const executor: TGameObject = createGameObject({
   name: "executor",
   diameter: 30,
   hp: 100_000,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "green" },
      forever(
         { type: AT.setAttribute, gameObjectId: "global", attribute: "aquaShoot", value: true },
         wait(1),
         { type: AT.setAttribute, gameObjectId: "global", attribute: "aquaShoot", value: false },
         wait(35),
      )
   ],
});

export const aqua: TGameObject = createGameObject({
   name: "aqua",
   diameter: 30,
   hp: 100_000,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "aqua" },
      { type: AT.setShotSpeed, pixelsPerFrame: 2 },
      forever(
         { type: AT.waitUntilAttrIs, gameObjectId: "global", attr: "aquaShoot", is: true },
         { type: AT.shootDirection, x: 0, y: 1 },
         wait(1),
      )
   ],
});

/**
 * Proves that children have parents (parentId is stored in attribute "parentId" on the child).
 * Shooting on 
 */
export const child: TGameObject = createGameObject({
   name: "child",
   diameter: 20,
   hp: 100_000,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "aqua" },
      { type: AT.waitUntilAttrIs, gameObjectId: { attr: "parentId" }, attr: "hp", is: 0 },
      { type: AT.setAttribute, attribute: "hp", value: 0 },
   ],
});
export const parent: TGameObject = createGameObject({
   name: "parent",
   diameter: 25,
   hp: 5,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "red" },
      spawn("child", { x: -30,   y: -30 }),
      spawn("child", { x: 0,     y: -30 }),
      spawn("child", { x: 30,    y: -30 }),
   ],
});