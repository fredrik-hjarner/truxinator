import type { TAction } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   createGameObject,
   fork,
   wait
} from "../../utils/utils.ts";
import { speedFactor } from "./speedFactor.ts";

const shrinkDiameter = (diameter: number, waitAmount: number): TAction[] => [
   { type: AT.setAttribute, attribute: "diameter", value: diameter },
   { type: AT.gfxSetDiameter, diameter },
   wait(waitAmount),
];

const size = 15;
const w = Math.round(8 / speedFactor);
const shrinkAmount = 0.5;

const shrinkAndDie: TAction[] = [
   wait({ gameObjectId: "global", attr: "ttl" }),
   ...shrinkDiameter(size - shrinkAmount, w),
   ...shrinkDiameter(size - 2*shrinkAmount, w),
   ...shrinkDiameter(size - 3*shrinkAmount, w),
   ...shrinkDiameter(size - 4*shrinkAmount, w),
   ...shrinkDiameter(size - 5*shrinkAmount, w),
   ...shrinkDiameter(size - 6*shrinkAmount, w),
   ...shrinkDiameter(size - 7*shrinkAmount, w),
   { type: AT.despawn },
];

export const snakeBody = createGameObject({
   name: "snakeBody",
   diameter: size,
   hp: 1,
   // onDeathAction: { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      { type: AT.gfxSetColor, color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(Math.round(4/speedFactor)),
      fork(
         wait(Math.round(30/speedFactor)),
         { type: AT.setAttribute, attribute: "collisionType", value: "snakeBody" },
      ),
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.incr, attribute: "speed", amount: 0 },
      ...shrinkAndDie,
   ]
});