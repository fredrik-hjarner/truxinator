import type { TGameObject } from "../../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, fork, spawn } from "../../utils/utils.ts";

export const playerShot: TGameObject = createGameObject({
   name: "playerShot",
   hp: 1,
   diameter: 5,
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["enemy"] },
         spawn("explosion"),
         { type: AT.despawn },
      ),
      { type: AT.setAttribute, attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: -0.5 },
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.gfxSetColor, color: "aqua" },
   ],
});
