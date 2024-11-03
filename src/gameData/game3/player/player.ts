import type { TAction } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, forever, fork, wait } from "../../utils/utils.ts";

type TCreateShotArgs = { moveDeltaX: number, moveDeltaY: number };

const createShot = ({ moveDeltaX, moveDeltaY }: TCreateShotArgs): TAction => ({
   type: AT.spawn, enemy: "playerShot",
   actions: [
      fork(forever(
         { type: AT.moveDelta, x: moveDeltaX, y: moveDeltaY },
         { type: AT.waitNextFrame }
      ))
   ]
});

const trippleShot: TAction[] = [
   createShot({ moveDeltaX: 0, moveDeltaY: -9 }),
   createShot({ moveDeltaX: 1.5, moveDeltaY: -9 }),
   createShot({ moveDeltaX: -1.5, moveDeltaY: -9 }),
   wait(8),
];

const laser: TAction[] = [
   { type: AT.spawn, enemy: "playerLaser", y: 15 },
   { type: AT.spawn, enemy: "playerLaser", y: 10 },
   { type: AT.spawn, enemy: "playerLaser", y: 5 },
   { type: AT.spawn, enemy: "playerLaser", y: 0 },
   { type: AT.spawn, enemy: "playerLaser", y: -5 },
   { type: AT.spawn, enemy: "playerLaser", y: -10 },
   wait(3),
];

export const player = createGameObject({
   name: "player",
   diameter: 20,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: true },
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
      { type: AT.setAttribute, attribute: "boundToWindow", value: true },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "diamondShield" },
      fork(forever(
         { type: AT.waitForInput, pressed: ["shoot"], notPressed: ["laser"] },
         ...trippleShot,
      )),
      fork(forever(
         { type: AT.waitForInput, pressed: ["laser"] },
         ...laser
      )),
   ]
});