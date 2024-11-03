import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import { attr, createGameObject, forever, fork, wait } from "../utils/utils.ts";
import { col, row } from "./common.ts";

export const stage3: TGameObject = createGameObject({
   name: "stage3",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.spawn, enemy: "shapeShifter", x: col[5], y: row[5] },
      { type: AT.spawn, enemy: "healer", x: col[4], y: row[4] },
      { type: AT.spawn, enemy: "dehealer", x: col[6], y: row[4] },
   ]
});

export const shapeShifter: TGameObject = createGameObject({
   name: "shapeShifter",
   diameter: 30,
   hp: 100,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.spawn, enemy: "shapeShifter", y: -20 },
         { type: AT.despawn },
      ),
      forever(
         { type: AT.gfxSetShape, shape: "circle" },
         wait(60),
         { type: AT.gfxSetShape, shape: "square" },
         wait(60),
         { type: AT.gfxSetShape, shape: "triangle" },
         wait(60),
         { type: AT.gfxSetShape, shape: "diamondShield" },
         wait(60),
         { type: AT.gfxSetShape, shape: "octagon" },
         wait(60),
      )
   ]
});

export const healer: TGameObject = createGameObject({
   name: "healer",
   diameter: 30,
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
      { type: AT.setAttribute, attribute: "hp", value: 25 },
      forever(
         wait(10),
         attr("hp", {
            value: 50,
            no: [{ type: AT.incr, attribute: "hp" }]
         })
      )
   ]
});

export const dehealer: TGameObject = createGameObject({
   name: "dehealer",
   diameter: 30,
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
      forever(
         wait(10),
         { type: AT.decr, attribute: "hp" }
      )
   ]
});
