import type { TAction } from "../../App/services/GameObjectManager/actions/actionTypes.ts";
import type { TSpawnParams } from "../utils/utils.ts";

import { ActionType as AT } from "../../App/services/GameObjectManager/actions/actionTypes.ts";
import {
   attr,
   createGameObject,
   forever,
   fork,
   spawn,
   wait,
} from "../utils/utils.ts";

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

const createAsteroidFragment = (speed: number, angle: number): TSpawnParams => ({
   x: 0,
   y: 0,
   actions: [
      { type: AT.setMoveDirection, degrees: angle },
      fork({
         type: AT.move,
         x: 1000 * Math.cos(angle * Math.PI / 180),
         y: 1000 * Math.sin(angle * Math.PI / 180),
         frames: 8000 / speed
      }),
   ]
});

const createExplosionEffect = (fragmentCount: number, fragmentType: string, speed: number) => {
   const fragments = [];
   for (let i = 0; i < fragmentCount; i++) {
      const angle = (360 / fragmentCount) * i;
      fragments.push(spawn(fragmentType, createAsteroidFragment(speed, angle)));
   }
   return fragments;
};

export const asteroid = createGameObject({
   name: "asteroid",
   diameter: 24,
   hp: 3,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         ...createExplosionEffect(6, "smallAsteroid", 1),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "red" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: 10 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // Set random movement direction and speed
      fork({
         type: AT.move,
         x: { min: -2000, max: 2000 },
         y: { min: -2000, max: 2000 },
         frames: 10000,
      }),
      // The following line is just a hack to hide the asteroid initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "octagon" },
      // setup screen wrapping
      ...screenWrapActions,
   ]
});

export const smallAsteroid = createGameObject({
   name: "smallAsteroid",
   diameter: 17,
   hp: 2,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         ...createExplosionEffect(4, "tinyAsteroid", 1.3),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "red" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: 10 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "octagon" },
      // setup screen wrapping
      ...screenWrapActions,
   ]
});

export const tinyAsteroid = createGameObject({
   name: "tinyAsteroid",
   diameter: 8,
   hp: 2,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(forever(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.decr, attribute: "hp" },
         wait(1),
      )),
      fork(
         { type: AT.waitUntilAttrIs, attr: "hp", is: 0 },
         ...createExplosionEffect(3, "tinyAsteroidFragment", 1.6),
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "red" },
      // TODO: setMoveDirection might be a stupid name for the
      // action and the way it works might also be stupid.
      // cuz every tick the gfx rotation is set to moveDirection,
      // which is contra-intuitive. Should prolly not be set
      // automaticallt on tick, but need to be set explicitly.
      { type: AT.setMoveDirection, degrees: 0 },
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: 10 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      // The following line is just a hack to hide the player initially.
      { type: AT.gfxSetShape, shape: "none" },
      wait(1),
      { type: AT.gfxSetShape, shape: "octagon" },
      // setup screen wrapping
      ...screenWrapActions,
   ]
});

export const tinyAsteroidFragment = createGameObject({
   name: "tinyAsteroidFragment",
   diameter: 8,
   hp: 1,
   options: { despawnWhenOutsideScreen: false, defaultDirectionalControls: false },
   actions: [
      fork(
         { type: AT.waitUntilCollision, collisionTypes: ["playerBullet"] },
         { type: AT.despawn },
      ),
      { type: AT.gfxSetColor, color: "red" },
      { type: AT.setAttribute, attribute: "pointsOnDeath", value: 10 },
      { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
      { type: AT.setAttribute, attribute: "boundToWindow", value: false },
      { type: AT.gfxSetShape, shape: "circle" },
      ...screenWrapActions,
   ]
});
