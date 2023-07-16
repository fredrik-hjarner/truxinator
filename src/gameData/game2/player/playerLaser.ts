import type { IEnemyJson } from "../../../App/services/Enemies/enemyConfigs/IEnemyJson";

import { forever, parallelRace, spawn, wait } from "../../utils";

export const playerLaser: IEnemyJson = {
   name: "playerLaser",
   hp: 1,
   diameter: 5,
   onDeathAction: spawn("explosion"),
   actions: [
      { type: "setAttribute", attribute: "collisionType", value: "playerBullet" },
      // TODO: is points really necessary for this?
      { type: "setAttribute", attribute: "pointsOnDeath", value: -0.2 },
      { type: "setAttribute", attribute: "points", value: 0 },
      { type: "gfxSetShape", shape: "square" },
      { type: "gfxSetColor", color: "aqua" },
      parallelRace(
         forever(
            { type: "moveDelta", x: 30 },
            { type: "waitNextFrame" },
         ),
         [
            wait(8),
            { type: "despawn" }
         ]
      )
   ]
};
