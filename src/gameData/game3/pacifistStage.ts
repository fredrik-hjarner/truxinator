import type { TGameObject } from "../../gameTypes/TGameObject";
import type { TSpawn } from "../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT} from "../../App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, repeat, wait } from "../utils/utils.ts";

const sinusLeft: TSpawn = {
   type: AT.spawn, enemy: "sinus",
   x: 75,
   y: -20,
};

const sinusRight: TSpawn = {
   type: AT.spawn, enemy: "sinus",
   x: 280,
   y: -20,
   actions: [
      { type: AT.setAttribute, attribute: "right", value: true }
   ],
};

const sinuses = repeat(5, [
   sinusLeft, wait(70),
   sinusRight, wait(70),
]);

export const pacifistStage: TGameObject = createGameObject({
   name: "pacifistStage",
   diameter: 20,
   hp: 9999,
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      wait(120),
      sinuses,
   ],
});
