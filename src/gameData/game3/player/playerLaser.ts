import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, forever, fork, parallelRace, spawn, wait } from "../../utils/utils.ts";

export const playerLaser: TGameObject = createGameObject({
   name: "playerLaser",
   hp: 1,
   diameter: 5,
   options: { despawnMargin: 5 },
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["enemy"] },
         spawn("explosion"),
         { type: AT.despawn },
      ),
      { type: AT.setAttribute, attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: -0.2 },
      { type: AT.gfxSetShape, shape: "square" },
      { type: AT.gfxSetColor, color: "aqua" },
      parallelRace(
         forever(
            { type: AT.moveDelta, y: -30 },
            { type: AT.waitNextFrame },
         ),
         [
            wait(8),
            { type: AT.despawn }
         ]
      )
   ]
});
