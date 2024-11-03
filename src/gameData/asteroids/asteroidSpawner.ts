import type { TAction } from "../../App/services/GameObjectManager/actions/actionTypes.ts";

import { resolutionHeight, resolutionWidth } from "@/consts.ts";

import { ActionType as AT } from "../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   forever,
   // fork,
   spawn,
   wait
} from "../utils/utils.ts";

const spawnAsteroid = (): TAction => spawn(
   "asteroid", {
      x: { min: 0, max: resolutionWidth },
      y: { min: 0, max: resolutionHeight }
   },
);

export const asteroidSpawner = createGameObject({
   name: "asteroidSpawner",
   diameter: 1,
   hp: 9999,
   actions: [
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      forever(
         spawnAsteroid(),
         wait(60*4),
      ),
   ]
});

