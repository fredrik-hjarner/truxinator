import type {
   TAction, TAttrIf, TFork, TMoveToAbsolute, TNumber, TRandomInt, TRepeat, TSetShotSpeed, TSetSpeed,
   TSpawn, TWait, TparallelAll, TparallelRace
} from "../../App/services/Enemies/actions/actionTypes.ts";
import type { TGameObject } from "@/gameTypes/TGameObject";

import { ActionType as AT } from "../../App/services/Enemies/actions/actionTypes.ts";

export const col = {
   "-1" : -36,
   0 : 0,
   1 : 36,
   2 : 71,
   3 : 107,
   4 : 143,
   5 : 179,
   6 : 214,
   7 : 250,
   8 : 286,
   9 : 321,
   10 : 357,
   11 : 393
};

export const row = {
   "-1" : -24,
   0 : 0,
   1 : 24,
   2 : 48,
   3 : 72,
   4 : 96,
   5 : 120,
   6 : 144,
   7 : 168,
   8 : 192,
   9 : 216,
   10 : 240,
   11 : 264
};

type TAttrParams = {
   condition?: TAttrIf["condition"];
   value: TAttrIf["value"];
   yes?: TAttrIf["yes"];
   no?: TAttrIf["no"];
};
export function attr(
   attrName: TAttrIf["attrName"], { condition="equals", value, yes, no }: TAttrParams
): TAttrIf {
   return {
      condition,
      type: AT.attrIf,
      attrName,
      value: value,
      yes,
      no
   };
}

export function forever(...actions: TAction[]): TRepeat {
   return {
      type: AT.repeat,
      times: 100_000_000,
      actions
   };
}

export function fork(...actions: TAction[]): TFork {
   return {
      type: AT.fork,
      actions
   };
}

type TMoveToAbsParams = { x?: number, y?: number, frames: number};
export const moveToAbsolute = ({ x, y, frames }: TMoveToAbsParams): TMoveToAbsolute => ({
   type: AT.moveToAbsolute,
   moveTo: { x, y },
   frames
});

export const parallelAll = (...actions: (TAction|TAction[])[]): TparallelAll => ({
   type: AT.parallelAll,
   actionsLists: actions.map(acns => Array.isArray(acns) ? acns : [acns])
});

export function parallelRace(...actions: (TAction|TAction[])[]): TparallelRace {
   return {
      type: AT.parallelRace,
      actionsLists: actions.map(acn => Array.isArray(acn) ? acn : [acn])
   };
}

export const repeat = (times: TNumber, actions: TAction[]): TRepeat => ({
   type: AT.repeat,
   times,
   actions
});

export const setSpeed = (pixelsPerFrame: number): TSetSpeed => ({
   type: AT.setSpeed,
   pixelsPerFrame
});

export type TSpawnParams = {
   x?: number | TRandomInt;
   y?: number | TRandomInt;
   actions?: (TAction)[]
}
export const spawn = (enemy: string, params?: TSpawnParams): TSpawn => ({
   type: AT.spawn,
   enemy,
   x: params?.x,
   y: params?.y,
   actions: params?.actions
});

export const setShotSpeed = (pixelsPerFrame: number): TSetShotSpeed => ({
   type: AT.setShotSpeed,
   pixelsPerFrame
});

export const thrice = (...actions: TAction[]): TRepeat => repeat(3, actions);

export const twice = (...actions: TAction[]): TRepeat => repeat(2, actions);

export const wait = (frames: TNumber): TWait => ({ type: AT.wait, frames });

type TCreateGameObjectParams = {
   name: string;
   hp: number; // TODO: | "invincible"
   diameter: number;
   actions: TAction[];
   /**
   * One action that is executed immediately when an enemy reaches 0 hp.
   * MUST take at most 1 frame to execute.
   * The reason for this is that the enemy has died and is
   * being removed from the system. If you need to do more than 1 action then you may spawn a
   * new GameObject and have those actions in that GameObject, I call this concept
   * "spawning a corpse".
   */
   // onDeathAction?: TAction | undefined; // TODO: Remove? oOrder of execution was unclear.
   /**
    * TODO: Comment.
    * TODO: Make this required to force me to update code.
    * TODO: This does not look finished see collisionType further down.
    */
   collisionType?: "player" | "playerBullet" | "enemy" | "enemyBullet" | "none";


   /**
    * Some options.
    * TODO: Move these up to root level and make them mandatory to set. It is convenient to have
    * them optional, for now, but it is also easy to forget to set them.
    * */
   options?: {
      /** If true then the GameObject will be removed when it moves outside the screen. */
      despawnWhenOutsideScreen?: boolean;
      /** Despawns the GameObject when it's these many pixels outside of the screen */
      despawnMargin?: number;
      /** setup default (player) directional controls */
      defaultDirectionalControls?: boolean;
   }
}
/**
 * A function I made as a middle layer to make so I would need to make fewer changes to gameObjects
 * when adding the functionality for a player to have several lives.
 * What I need is to remove the onDeathActions internally in the code and manage that manually
 * with actions (and attriubutes).
 * TODO: Maybe this should be removed when it is no longer needed??
 */
export function createGameObject(params: TCreateGameObjectParams): TGameObject {
   const despawnWhenOutsideScreen = params.options?.despawnWhenOutsideScreen ?? true;
   const despawnMargin = params.options?.despawnMargin;
   const defaultDirectionalControls = params.options?.defaultDirectionalControls ?? false;

   // TODO: This does not look finished see collisionType above.
   // const collisionType = params.collisionType ?? "none";

   const defaultDirectionalControlsActions: TAction[] = defaultDirectionalControls ? [
      // cardinal
      fork(forever(
         // notPressed is set because I don't want this to trigger for diagonal movement.
         { type: AT.waitForInput, pressed: ["left"], notPressed: ["up", "down"] },
         { type: AT.moveDelta, x: -2.35 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         // notPressed is set because I don't want this to trigger for diagonal movement.
         { type: AT.waitForInput, pressed: ["right"], notPressed: ["up", "down"] },
         { type: AT.moveDelta, x: 2.35 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         // notPressed is set because I don't want this to trigger for diagonal movement.
         { type: AT.waitForInput, pressed: ["up"], notPressed: ["left", "right"] },
         { type: AT.moveDelta, y: -2.35 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         // notPressed is set because I don't want this to trigger for diagonal movement.
         { type: AT.waitForInput, pressed: ["down"], notPressed: ["left", "right"] },
         { type: AT.moveDelta, y: 2.35 },
         { type: AT.waitNextFrame }
      )),

      // diagonal
      fork(forever(
         { type: AT.waitForInput, pressed: ["up", "left"] },
         { type: AT.moveDelta, x: -2.35/Math.SQRT2, y: -2.35/Math.SQRT2 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         { type: AT.waitForInput, pressed: ["up", "right"] },
         { type: AT.moveDelta, x: 2.35/Math.SQRT2, y: -2.35/Math.SQRT2 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         { type: AT.waitForInput, pressed: ["down", "left"] },
         { type: AT.moveDelta, x: -2.35/Math.SQRT2, y: 2.35/Math.SQRT2 },
         { type: AT.waitNextFrame }
      )),
      fork(forever(
         { type: AT.waitForInput, pressed: ["down", "right"] },
         { type: AT.moveDelta, x: 2.35/Math.SQRT2, y: 2.35/Math.SQRT2 },
         { type: AT.waitNextFrame }
      )),
   ] : [];

   const despawnWhenOutsideScreenAction: TAction[] = despawnWhenOutsideScreen ? [{
      type: AT.fork,
      actions: [
         { type: AT.waitTilInsideScreen }, // TODO: This should take a margin argument.
         { type: AT.waitTilOutsideScreen, margin: despawnMargin },
         { type: AT.despawn }
      ]
   }] : [];

   return {
      name: params.name,
      diameter: params.diameter,
      actions: [
         // Set some default attributes.
         { type: AT.setAttribute, attribute: "pointsOnDeath", value: 0 },
         { type: AT.setAttribute, attribute: "collisionType", value: "enemy" },
         { type: AT.setAttribute, attribute: "boundToWindow", value: false },
         { type: AT.setAttribute, attribute: "hp", value: params.hp },
         { type: AT.setAttribute, attribute: "maxHp", value: params.hp },
         // Set default player controls.
         ...defaultDirectionalControlsActions,
         // Setup despawning when GameObject moves out of the screen.
         ...despawnWhenOutsideScreenAction,
         // "Normal" actions
         ...params.actions
      ]
   };
}