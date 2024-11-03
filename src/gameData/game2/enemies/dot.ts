import type { TGameObject } from "@/gameTypes/TGameObject.ts";

import {
   createGameObject,
   forever,
   fork,
   spawn,
   wait,
} from "@/gameData/utils/utils.ts";
import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

export const dot: TGameObject = createGameObject({
   name: "dot",
   hp: 20,
   diameter: 20,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         spawn("roundExplosion"),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetShape, shape: "stage2/circle.png" },
   ]
});