import type { TGameObject } from "../../../gameTypes/TGameObject";
import type { TAction } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   parallelAll,
   spawn,
   wait
} from "../../utils/utils.ts";


const explodeInAllDirections = (radius: number, _wait: number,): TAction[] => {
   return [
      // explosions in all directions
      spawn("roundExplosion", { x: -radius, y: 0 }),
      wait(_wait),
      wait(_wait),
      spawn("roundExplosion", { x: radius, y: 0 }),
      wait(_wait),
      spawn("roundExplosion", { x: 0, y: -radius }),
      wait(_wait),
      spawn("roundExplosion", { x: 0, y: radius }),
      spawn("roundExplosion", { x: -radius, y: -radius }),
      spawn("roundExplosion", { x: radius, y: radius }),
      wait(_wait),
      spawn("roundExplosion", { x: -radius, y: radius }),
      spawn("roundExplosion", { x: radius, y: -radius }),
   ];
};

export const bossCorpse: TGameObject = createGameObject({
   name: "bossCorpse",
   diameter: 18,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "explosion" },
      parallelAll(
         explodeInAllDirections(8, 3),
         explodeInAllDirections(24, 5),
         explodeInAllDirections(16, 15),
      ),
      { type: AT.wait, frames: 60 * 3 },
      { type: AT.finishLevel }
   ],
});
