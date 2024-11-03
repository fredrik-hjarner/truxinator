import type { TGameObject } from "../../gameTypes/TGameObject";

import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   // fork,
   spawn,
   // wait
} from "../utils/utils.ts";

export const spawner: TGameObject = createGameObject({
   name: "spawner",
   diameter: 20,
   hp: 9999,
   actions: [
      // fork(
      //    wait(100),
      //    { type: "finishLevel" }
      // ),
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      // { wait: 1 },
      spawn("player", { x: 178.5, y: 220 }),
      spawn("pacifistStage")
   ]
});
