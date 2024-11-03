import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, fork, spawn, wait } from "../../utils/utils.ts";

export const kamikaze: TGameObject = createGameObject({
   name: "kamikaze",
   diameter: 20,
   hp: 1,
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         spawn("kamikazeCorpse"),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetShape, shape: "octagon" },
      { type: AT.gfxSetColor, color: "red" },
      wait(90),
      // { type: "die" },
   ],
});

export const kamikazeCorpse: TGameObject = createGameObject({
   name: "kamikazeCorpse",
   diameter: 20,
   hp: 1,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.setShotSpeed, pixelsPerFrame: 0.9 },
      { type: AT.shootDirection, x: 1, y: -1 },
      { type: AT.shootDirection, x: 1, y: 0 },
      { type: AT.shootDirection, x: 1, y: 1 },
      { type: AT.shootDirection, x: 0, y: 1 },
      { type: AT.shootDirection, x: -1, y: 1 },
      { type: AT.shootDirection, x: -1, y: 0 },
      { type: AT.shootDirection, x: -1, y: -1 },
      { type: AT.shootDirection, x: 0, y: -1 },
      { type: AT.despawn },
   ],
});
