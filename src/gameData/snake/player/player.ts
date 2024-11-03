import type { TAction } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   attr,
   createGameObject,
   forever,
   fork,
   spawn,
   wait
} from "../../utils/utils.ts";
import { speedFactor } from "./speedFactor.ts";

const snakeSize = 17;

/**
 * `left`, `right` rotates the player.
 * `up` accelerates the player in the direction it is facing.
 * down accelerates player in backward direction.
 */
const defaultDirectionalControlsActions: TAction[] = [
   // rotation
   fork(forever(
      { type: AT.waitForInput, pressed: ["left"] },
      { type: AT.decr, attribute: "moveDirectionAngle", amount: 3.5 },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["right"] },
      { type: AT.incr, attribute: "moveDirectionAngle", amount: 3.5 },
      { type: AT.waitNextFrame },
   )),

   // acceleration
   // fork(forever(
   //    { type: AT.waitForInput, pressed: ["up"] },
   //    { type: AT.incr, attribute: "speed", amount: 0.04 },
   //    { type: AT.waitNextFrame },
   // )),
   // fork(forever(
   //    { type: AT.waitForInput, pressed: ["down"] },
   //    { type: AT.incr, attribute: "speed", amount: -0.04 },
   //    { type: AT.waitNextFrame },
   // )),

   // every frame: move according to speed and direction.
   fork(forever(
      { type: AT.move_according_to_speed_and_direction },
      { type: AT.waitNextFrame },
   )),
];

/**
 * TODO: Comment.
 */
const dieWhenTouchScreenBorders: TAction[] = [
   fork(forever(
      // horizontal
      attr("x", { condition: "greaterThan", value: 357 - snakeSize/2, yes: [
         { type: AT.finishLevel },
         { type: AT.despawn },
      ] }),
      attr("x", { condition: "lessThan", value: 0 + snakeSize/2, yes: [
         { type: AT.finishLevel },
         { type: AT.despawn },
      ] }),

      // vertical
      attr("y", { condition: "greaterThan", value: 240 - snakeSize/2, yes: [
         { type: AT.finishLevel },
         { type: AT.despawn },
      ] }),

      attr("y", { condition: "lessThan", value: 0 + snakeSize/2, yes: [
         { type: AT.finishLevel },
         { type: AT.despawn },
      ] }),

      wait(1),
   )),
];

export const player = createGameObject({
   name: "player",
   diameter: snakeSize,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["apple"] },
         { type: AT.incr, gameObjectId: "global", attribute: "applesEaten" },
         { type: AT.addPoints, points: 100 },
         {
            type: AT.attrIf, // TODO: Split into a function `isEndGame` and increase ttl for apples
            condition: "greaterThanOrEqual",
            gameObjectId: "global",
            attrName: "applesEaten",
            value: 10,
            yes: [{ type: AT.incr, gameObjectId: "global", attribute: "ttl", amount: 60 }],
            no: [{ type: AT.incr, gameObjectId: "global", attribute: "ttl", amount: 45 }],
         },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["snakeBody"] },
         { type: AT.finishLevel },
         { type: AT.despawn },
      ),
      { type: AT.setAttribute, gameObjectId: "global", attribute: "ttl", value: 10 },
      { type: AT.setAttribute, gameObjectId: "global", attribute: "applesEaten", value: 0 },
      { type: AT.gfxSetColor, color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 90 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "circle" },
      { type: AT.incr, attribute: "speed", amount: 0.6 * speedFactor },
      // controls
      ...defaultDirectionalControlsActions,
      // setup screen wrapping
      ...dieWhenTouchScreenBorders,
      fork(forever(
         wait(Math.round(19/speedFactor)),
         spawn("snakeBody"),
      )),
   ]
});