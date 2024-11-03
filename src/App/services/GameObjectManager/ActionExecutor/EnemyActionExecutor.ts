import type {
   TAction, TInputButton, TNumber, TRotateAroundAbsolutePoint, TRotateAroundRelativePoint, TString
} from "../actions/actionTypes.ts";
import type { IAttributes, TAttrValue } from "../../Attributes/IAttributes.ts";
import type { IInput } from "../../Input/IInput.ts";
import type { GamePad } from "../../GamePad/GamePad.ts";
import type { Enemy } from "../Enemy.ts";
import type { IPseudoRandom } from "../../PseudoRandom/IPseudoRandom.ts";

import { ActionType as AT } from "../actions/actionTypes.ts";
import { Vector } from "../../../../math/Vector.ts";
import { Angle } from "../../../../math/Angle.ts";
import { GeneratorUtils } from "../../../../utils/GeneratorUtils.ts";
import { ifAttr } from "./helpers/if.ts";
import { createIsOutsideScreen } from "./helpers/createIsOutsideScreen.ts";

// TODO: Would be nice with a commment here.
const rotateAroundPoint = function*(
   currAction: TRotateAroundAbsolutePoint | TRotateAroundRelativePoint,
   pointToPosVector: Vector,
   actionHandler: TActionHandler
): Generator<void, void, void> {
   const stepDegrees = currAction.degrees / currAction.frames;
   for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
      const prevDegrees = stepDegrees * (passedFrames-1);
      const currDegrees = stepDegrees * passedFrames;

      const prevRotated = pointToPosVector.rotateClockwise(Angle.fromDegrees(prevDegrees));
      const currRotated = pointToPosVector.rotateClockwise(Angle.fromDegrees(currDegrees));

      const delta = Vector.fromTo(prevRotated, currRotated);
      actionHandler({ type: AT.moveDelta, x: delta.x, y: delta.y });
      yield;
   }
};

type TActionHandler = (action: TAction) => void;

type TEnemyActionExecutorArgs = {
   // The actions to execute. Executes them in sequence.
   // You can execute things in parallel with special compound actions like parallelRace.
   actions: TAction[];
   actionHandler: TActionHandler;
   enemy: Enemy;
   input: IInput;
   gamepad: GamePad;
}

export class EnemyActionExecutor {
   // deps/services
   private input: IInput;
   private gamepad: GamePad;

   private actionHandler: (action: TAction) => void;
   private enemy: Enemy;
   private attrs: IAttributes; // attribute service for convenience.
   private pseudoRandom: IPseudoRandom;
   // The only reason I don't have only ONE generator is because of the `fork` action.
   // `fork` creates/adds a new generator. I think that's the only way it could work really.
   public generators: Generator<void, void, void>[];

   public constructor(params: TEnemyActionExecutorArgs) {
      const { actions, actionHandler, enemy, input, gamepad } = params;
      this.actionHandler = actionHandler;
      this.enemy = enemy;
      this.attrs = enemy.enemies.attributes; // for convenience.
      this.pseudoRandom = enemy.enemies.pseudoRandom; // for convenience.
      this.input = input;
      this.gamepad = gamepad;
      this.generators = [this.makeGenerator(actions)];
   }

   /**
    * Execute one single actions by itself.
    * Executes the action one frame then throws away the generator.
    * Only useful for special cases.
    * @returns true if done, else false.
    */
   public ExecuteOneAction = (action: TAction): boolean => {
      const generator = this.makeGenerator([action]);
      const { done } = generator.next();
      return !!done;
   };

   // TODO: Maybe I should clear up generators that have status `done`.
   // Return true when all generators have finished, i.e. no actions left ot execute.
   public ProgressOneFrame(): boolean {
      const prevGeneratorsLength = this.generators.length;
      // Seems that if a generator pushes to this.generators then then map will not be affected,
      // because map seems to clone the array. Otherwise .slice() would be needed.
      const nexts = this.generators.map(g => {
         return g.next();
      });
      if(this.enemy.despawned){
         return true;
      }
      const generatorsLength = this.generators.length;
      if(prevGeneratorsLength === generatorsLength) {
         /**
          * During the execution more generators can be added,
          * so only if the number has not been changed can we make assumptions about all generators
          * having finished or not.
          * But... couldn't one generator be added and another one deleted, +1 -1 = 0 ??
          * hm though can generators even ever be deleted?? I don't think so.
          */
         const allDone = nexts.every(next => next.done);
         return allDone;
      }
      return false;
   }

   /**
    * Private
    */

   // Some utils for controls. I should probably refactor this somehow.
   private leftPressed = () => this.input.ButtonsPressed.left || this.gamepad.left;
   private rightPressed = () => this.input.ButtonsPressed.right || this.gamepad.right;
   private upPressed = () => this.input.ButtonsPressed.up || this.gamepad.up;
   private downPressed = () => this.input.ButtonsPressed.down || this.gamepad.down;

   private shootPressed = () => this.input.ButtonsPressed.shoot || this.gamepad.shoot;
   private laserPressed = () => this.input.ButtonsPressed.laser || this.gamepad.laser;
   // TODO: Why do I have no start on gamepad??
   private startPressed = () => this.input.ButtonsPressed.start;

   // convenience method to shorten code a bit and reduce code duplication.
   private getAttribute = (params: { gameObjectId?: string, attribute: string }): TAttrValue => {
      return this.attrs.getAttribute({
         gameObjectId: params.gameObjectId ?? this.enemy.id, // default to THIS enemy.
         attribute: params.attribute,
      });
   };
   /** Get/extract a hardcoded number or an attribute */
   // TODO: I should also have another one here for PseudoRandom.randomInt.
   private getNumber = (param: TNumber): number => {
      if (typeof param === "number") { return param; }
      if ("attr" in param) {
         return this.attrs.getNumber({
            gameObjectId: param.gameObjectId ?? this.enemy.id,
            attribute: param.attr
         });
      }
      // else is a random number
      return this.pseudoRandom.randomInt(param.min, param.max);
   };
   /** Get/extract a hardcoded string or an attribute */
   private getString = (param: TString): string => {
      if (typeof param === "string") { return param; }
      return this.attrs.getString({
         gameObjectId: param.gameObjectId ?? this.enemy.id,
         attribute: param.attr
      });
   };

   // Util to check if a specfic button is pressed.
   private isButtonPressed = (button: TInputButton): boolean => {
      switch(button) {
         case "left": return this.leftPressed();
         case "right": return this.rightPressed();
         case "up": return this.upPressed();
         case "down": return this.downPressed();

         case "shoot": return this.shootPressed();
         case "laser": return this.laserPressed();
         case "start": return this.startPressed();
      }
   };

   private *makeGenerator(actions: TAction[] = []): Generator<void, void, void> {
      let currIndex = 0;
      const nrActions = actions.length;

      while(currIndex < nrActions) { // if index 1 & nr 2 => kosher
         const currAction = actions[currIndex];
         switch(currAction.type) {
            case AT.waitForInput: {
               const pressed = currAction.pressed;
               const notPressed = currAction.notPressed ?? [];

               while(!(
                  // every button in pressed must be pressed.
                  pressed.every(this.isButtonPressed) &&
                  // if some button in notPressed is pressed then return false.
                  !notPressed.some(this.isButtonPressed)
               )) { yield; }

               break;
            }

            case AT.waitUntilAttrIs: {
               const { gameObjectId, attr, is } = currAction;
               while(this.getAttribute({
                  gameObjectId: gameObjectId ? this.getString(gameObjectId) : undefined,
                  attribute: attr
               }) !== is) {
                  yield;
               }
               break;
            }

            case AT.waitUntilCollision: {
               const { collisionTypes } = currAction;
               // on the enemy collidedWithCollisionTypesThisFrame is stored. should/is(?) removed
               // after each frame? yes it is.
               while(!this.enemy.collidedWithCollisionTypesThisFrame.some(collisionType =>
                  collisionTypes.includes(collisionType)
               )) {
                  yield;
               }
               break;
            }

            case AT.setAttribute: {
               const { gameObjectId: GOID, attribute, value } = currAction;
               // TODO: Maybe I could use this.getNumber here to reuse code?
               if(typeof value === "object" && "min" in value) {
                  this.attrs.setAttribute({
                     gameObjectId: GOID ?? this.enemy.id,
                     attribute,
                     value: this.pseudoRandom.randomInt(value.min, value.max),
                  });
               } else {
                  this.attrs.setAttribute({gameObjectId: GOID ?? this.enemy.id, attribute, value });
               }
               break;
            }

            // See the explanation in comments to the action type definition itself.
            case AT.fork: {
               // Create a new generator for the fork to allow it to execute parallely.
               // NOTE: If the generator is added to the back or the front makes a big difference!!
               const generator = this.makeGenerator(currAction.actions);
               // this.generators.push(generator);
               // instead of pushing place the new generator next to last in the array, i.e. last of
               // the forked generators but before the "original" generator (orig. actions array).
               // This keeps the order of the forks in order but let's the original actions run last
               this.generators.splice(this.generators.length-1, 0, generator);
               // execute once, otherwise the first forked action would execute next frame.
               generator.next();
               break;
            }

            case AT.parallelRace: {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.parallelRace(generators);
               break;
            }

            case AT.parallelAll: {
               const generators = currAction.actionsLists.map(acns => this.makeGenerator(acns));
               yield* GeneratorUtils.parallelAll(generators);
               break;
            }

            case AT.repeat: {
               const times = this.getNumber(currAction.times);
               yield*  GeneratorUtils.Repeat({
                  makeGenerator: () => this.makeGenerator(currAction.actions),
                  times,
               });
               break;
            }

            case AT.attrIf: {
               const {
                  attrName: attribute, condition, gameObjectId, value, yes, no
               } = currAction;
               const attrValue = this.getAttribute({ gameObjectId, attribute });
               const result = ifAttr({ attrValue, condition, value });
               yield* this.makeGenerator(result ? yes : no);
               break;
            }

            case AT.waitNextFrame: 
               yield;
               break;

            case AT.wait:
               for(let i=0; i<this.getNumber(currAction.frames); i++) { yield; }
               break;

            case AT.waitTilInsideScreen: {
               const margin = 0; // was 20
               const isOutsideScreen = createIsOutsideScreen(margin);
               while(isOutsideScreen(this.enemy.getPosition())) { yield; }
               break;
            }

            case AT.waitTilOutsideScreen: {
               const { margin = 30 } = currAction;
               const isOutsideScreen = createIsOutsideScreen(margin);
               while(!isOutsideScreen(this.enemy.getPosition())) { yield; }
               break;
            }

            case AT.move: {
               const moveX = currAction.x !== undefined ? this.getNumber(currAction.x) : 0;
               const moveY = currAction.y !== undefined ? this.getNumber(currAction.y) : 0;
               const stepX = moveX / currAction.frames;
               const stepY = moveY / currAction.frames;
               /**
                * Start from 1 so that first step is not zero progression, but first step of 
                * progression.
                * Allow passedFrames to go up to (include) currActon.frames, i.e. if 4 then
                * allow passedFrames to go all the way up to 4.
                */
               for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
                  this.actionHandler({ type: AT.moveDelta, x: stepX, y: stepY });
                  yield;
               }
               break;
            }

            case AT.moveToAbsolute: {
               const startPos = this.enemy.getPosition();
               const { moveTo } = currAction;
               const moveX = moveTo.x !== undefined ? moveTo.x - startPos.x : 0;
               const moveY = moveTo.y !== undefined ? moveTo.y - startPos.y : 0;
               const stepX = moveX / currAction.frames;
               const stepY = moveY / currAction.frames;
               for(let passedFrames=1; passedFrames<=currAction.frames; passedFrames++) {
                  this.actionHandler({ type: AT.moveDelta, x: stepX, y: stepY });
                  yield;
               }
               break;
            }

            case AT.rotate_around_relative_point: {
               const pointX = currAction.point.x ?? 0;
               const pointY = currAction.point.y ?? 0;
               const pointToPosVector = new Vector(-pointX, -pointY);
               yield* rotateAroundPoint(currAction, pointToPosVector, this.actionHandler);
               break;
            }

            case AT.rotate_around_absolute_point: {
               const startPos = this.enemy.getPosition();
               const pointX = currAction.point.x ?? startPos.x;
               const pointY = currAction.point.y ?? startPos.y;
               const pointToPosVector = Vector.fromTo(
                  new Vector(pointX, pointY),
                  new Vector(startPos.x, startPos.y),
               );
               yield* rotateAroundPoint(currAction, pointToPosVector, this.actionHandler);
               break;
            }
            
            case AT.log:
               console.log(`LogAction: ${currAction.msg}`);
               break;

            default:
               this.actionHandler(currAction);
         }
         currIndex++;
      }
   }
}
