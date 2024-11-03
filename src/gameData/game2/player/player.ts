import type { TGameObject } from "../../../gameTypes/TGameObject";
import type { TAction } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";

import { ActionType as AT } from "../../../App/services/GameObjectManager/actions/actionTypes.ts";
import { createGameObject, forever, fork, wait } from "../../utils/utils.ts";

type TCreateShotArgs = { moveDeltaX: number, moveDeltaY: number };

const createShot = ({ moveDeltaX, moveDeltaY }: TCreateShotArgs): TAction => ({
   type: AT.spawn,
   enemy: "playerShot",
   actions: [
      fork(forever(
         { type: AT.moveDelta, x: moveDeltaX, y: moveDeltaY },
         { type: AT.waitNextFrame }
      ))
   ]
});

const trippleShot: TAction[] = [
   createShot({ moveDeltaY: 0, moveDeltaX: 9 }),
   wait(8),
];

export const player: TGameObject = createGameObject({
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
         { type: AT.finishLevel },
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
      { type: AT.setMoveDirection, degrees: 90 },
      wait(1),
      { type: AT.gfxSetShape, shape: "stage2/player.png" },
      fork(forever(
         { type: AT.waitForInput, pressed: ["shoot"], notPressed: ["laser"] },
         ...trippleShot,
      )),
   ]
});