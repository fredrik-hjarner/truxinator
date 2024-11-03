import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   // forever,
   fork,
   spawn,
   // wait
} from "../utils/utils.ts";

export const shot: TGameObject = createGameObject({
   name: "shot",
   hp: 1,
   diameter: 5,
   options: { despawnMargin: 5 },
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["player"] },
         spawn("explosion"),
         { type: AT.despawn },
      ),
      { type: AT.setAttribute, attribute: "collisionType", value: "enemyBullet" },
      { type: AT.gfxSetShape, shape: "circle" },
   ]
});
