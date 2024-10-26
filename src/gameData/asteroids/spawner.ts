import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes.ts";
import {
   col,
   createGameObject,
   row,
   spawn,
} from "../utils/utils.ts";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   options: { despawnWhenOutsideScreen: false },
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      spawn("parallax"),
      spawn("player", { x: col[5], y: row[5] }),
      spawn("asteroidSpawner"),
   ],
});
