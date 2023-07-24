import type { TGameObject } from "@/gameTypes/TGameObject";
import type { TAction } from "@/App/services/Enemies/actions/actionTypes";

import { ActionType as AT } from "@/App/services/Enemies/actions/actionTypes";
import {
   createGameObject,
   forever,
   fork,
   spawn,
} from "@/gameData/utils";

const dist = 27;

const rotate = ({ x, y }: { x?: number, y?: number }): TAction => ({
   type: AT.rotate_around_relative_point,
   degrees: -360 * 15,
   frames: 200 * 4.0 * 15,
   point: { x, y }
});

export const spinningDots: TGameObject = createGameObject({
   name: "spinningDots",
   hp: 9999,
   diameter: 5,
   onDeathAction: spawn("roundExplosion"),
   actions: [
      { type: AT.setAttribute, attribute: "collisionType", value: "none" },
      { type: AT.gfxSetShape, shape: "none" },
      { type: AT.gfxSetShape, shape: "stage2/circle.png" },
      { type: AT.gfxSetColor, color: "aqua" },
      // center
      spawn("dot", {
         actions: [
            fork(forever(
               { type: AT.moveDelta, x: -0.55 },
               { type: AT.waitNextFrame },
            )),
         ]
      }),

      // in-right
      spawn("dot", {
         x: dist,
         actions: [
            fork(forever(
               { type: AT.moveDelta, x: -0.55 },
               { type: AT.waitNextFrame },
            )),
            fork(rotate({ x: -dist }))
         ]
      }),
      // out-right
      spawn("dot", {
         x: dist*2,
         actions: [
            fork(forever(
               { type: AT.moveDelta, x: -0.55 },
               { type: AT.waitNextFrame },
            )),
            fork(rotate({ x: -(dist*2) }))]
      }),

      // in-left
      spawn("dot", {
         x: -dist,
         actions: [
            fork(forever(
               { type: AT.moveDelta, x: -0.55 },
               { type: AT.waitNextFrame },
            )),
            fork(rotate({ x: dist }))]
      }),
      // out-left
      spawn("dot", {
         x: -(dist*2),
         actions: [
            fork(forever(
               { type: AT.moveDelta, x: -0.55 },
               { type: AT.waitNextFrame },
            )),
            fork(rotate({ x: dist*2 }))]
      }),
      { type: AT.despawn }
   ]
});