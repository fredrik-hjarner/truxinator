import type { TGameObject } from "@/gameTypes/TGameObject.ts";

import { createGameObject, wait } from "@/gameData/utils/utils.ts";
import { ActionType as AT } from "@/App/services/GameObjectManager/actions/actionTypes.ts";

// TODO: What was the purpose of this enemy? It does not seem to be in use.
export const traceDot: TGameObject = createGameObject({
   name: "traceDot",
   hp: 9999,
   diameter: 5,
   actions: [
      wait(3 * 60),
      { type: AT.despawn }
   ]
});