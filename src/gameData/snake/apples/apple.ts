import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   fork,
   wait
} from "../../utils/utils.ts";

export const apple = createGameObject({
   name: "apple",
   diameter: 12,
   hp: 1,
   // onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["player"] },
         { type: AT.despawn }
      ),
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "apple" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.incr, attribute: "speed", amount: 0 },
      wait(60 * 10),
      { type: AT.despawn },
   ]
});