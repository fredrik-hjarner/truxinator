import type { IEnemyJson } from "../../../gameTypes/IEnemyJson";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import { createGameObject, forever, parallelRace, spawn, wait } from "../../utils";

export const playerLaser: IEnemyJson = createGameObject({
   name: "playerLaser",
   hp: 1,
   diameter: 5,
   onDeathAction: spawn("explosion"),
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: -0.2 },
      { type: AT.setAttribute, attribute: "points", value: 0 },
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
