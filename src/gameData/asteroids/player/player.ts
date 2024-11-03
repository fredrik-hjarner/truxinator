import type { TAction } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   attr,
   createGameObject,
   forever,
   fork,
   wait
} from "../../utils/utils.ts";

/**
 * `left`, `right` rotates the player.
 * `up` accelerates the player in the direction it is facing.
 * down accelerates player in backward direction.
 */
const defaultDirectionalControlsActions: TAction[] = [
   // rotation
   fork(forever(
      { type: AT.waitForInput, pressed: ["left"] },
      { type: AT.decr, attribute: "moveDirectionAngle", amount: 3.0 },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["right"] },
      { type: AT.incr, attribute: "moveDirectionAngle", amount: 3.0 },
      { type: AT.waitNextFrame },
   )),

   // acceleration
   fork(forever(
      { type: AT.waitForInput, pressed: ["up"] },
      { type: AT.incr, attribute: "speed", amount: 0.04 },
      { type: AT.waitNextFrame },
   )),
   fork(forever(
      { type: AT.waitForInput, pressed: ["down"] },
      { type: AT.incr, attribute: "speed", amount: -0.04 },
      { type: AT.waitNextFrame },
   )),

   // every frame: move according to speed and direction.
   fork(forever(
      { type: AT.move_according_to_speed_and_direction }, // TODO: This is what does not work.
      { type: AT.waitNextFrame },
   )),
];

/**
 * Screen wrap like in the real Asteroids game.
 * When the player goes outside the screen, it appears on the other side.
 */
const screenWrapActions: TAction[] = [
   fork(forever(
      // horizontal
      attr("x", { condition: "greaterThan", value: 357, yes: [
         { type: AT.setAttribute, attribute: "x", value: 0 },
      ] }),
      attr("x", { condition: "lessThan", value: 0, yes: [
         { type: AT.setAttribute, attribute: "x", value: 357 },
      ] }),

      // vertical
      attr("y", { condition: "greaterThan", value: 240, yes: [
         { type: AT.setAttribute, attribute: "y", value: 0 },
      ] }),

      attr("y", { condition: "lessThan", value: 0, yes: [
         { type: AT.setAttribute, attribute: "y", value: 240 },
      ] }),

      wait(1),
   )),
];

export const player = createGameObject({
   name: "player",
   diameter: 17,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["enemy", "enemyBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         { type: AT.finishLevel }, // TODO: finishLevel should maybe be called gameOver.
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "aqua" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "collisionType", value: "player" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "diamondShield" },
      { type: AT.setShotSpeed, pixelsPerFrame: 5 },
      fork(forever(
         { type: AT.waitForInput, pressed: ["shoot"] },
         { type: AT.shootAccordingToMoveDirection, shot: "playerShot" },
         wait(10),
      )),
      // controls
      ...defaultDirectionalControlsActions,
      // setup screen wrapping
      ...screenWrapActions,
   ]
});