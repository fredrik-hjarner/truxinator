import type { TGameObject } from "@/gameTypes/TGameObject.ts";

import {
   createGameObject, forever, fork, parallelAll, repeat, setSpeed, spawn, wait
} from "@/gameData/utils/utils.ts";
import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

export const nonShootingAimer: TGameObject = createGameObject({
   name: "nonShootingAimer",
   hp: 1,
   diameter: 22,
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.setAttribute, attribute: "pointsOnDeath", value: 25 },
         spawn("roundExplosion"),
         { type: AT.despawn },
      ),
      setSpeed(1.6),
      parallelAll(
         repeat(26.25, [
            { type: AT.rotate_towards_player },
            wait(8)
         ]),
         forever(
            { type: AT.move_according_to_speed_and_direction },
            { type: AT.waitNextFrame }
         )
      )
   ]
});