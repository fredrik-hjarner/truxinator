import type { TGameObject } from "../../gameTypes/TGameObject";

import {
   createGameObject,
   spawn,
   wait
} from "../utils/utils.ts";
import { col, row } from "./common.ts";
import { aimersWave } from "./waves/aimers.ts";
import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

export const stage: TGameObject = createGameObject({
   name: "stage",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },

      // aimers wave
      wait(1 * 60),
      aimersWave,
      wait(1 * 60),

      // spinner wave 1
      spawn("spinningDots", { x: col[12], y: row[5] }),
      wait(8 * 60),

      // spinner wave 2
      spawn("spinningDots", { x: col[12], y: row[3] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[7] }),
      wait(8 * 60),

      // spinner wave 3
      spawn("spinningDots", { x: col[12], y: row[1] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[5] }),
      wait(1.5 * 60),
      spawn("spinningDots", { x: col[12], y: row[9] }),

      wait(60 * 6),
      spawn("boss", { x: col[12], y: row[5] }),
   ]
});
