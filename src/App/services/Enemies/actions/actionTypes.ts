import type { Vector } from "../../../../math/bezier";
import type { TGraphicsActionWithoutHandle } from "../../Graphics/IGraphics";
import type { TAttrName, TAttrValue } from "../../Attributes/IAttributes";

/**
 * Action type enum.
 * It's often the best to have consts instead of strings. "Find all references" works better in IDE.
 * Enums are cool in one way: According to TS you are not allowed to assign a string to an enum,
 * so it forces you to use the enum everywhere which is great!
 */
export enum ActionType {
   addPoints = "addPoints", // TODO: Just temporary. I have to figure out how to handle points later
   wait = "wait",
   waitNextFrame = "waitNextFrame",
   waitUntilFrameNr = "wait_util_frame_nr",
   repeat = "repeat",
   shootDirection = "shootDirection",
   shootTowardPlayer = "shoot_toward_player",
   shoot_beside_player = "shoot_beside_player",
   shootAccordingToMoveDirection = "shootAccordingToMoveDirection",
   setShotSpeed = "setShotSpeed",
   move = "move",
   moveDelta = "moveDelta",
   moveToAbsolute = "moveToAbsolute",
   set_position = "set_position",
   setSpeed = "setSpeed", // TODO: Remove
   rotate_around_absolute_point = "rotate_around_absolute_point",
   rotate_around_relative_point = "rotate_around_relative_point",
   parallelRace = "parallelRace",
   parallelAll = "parallelAll",
   rotate_towards_player = "rotate_towards_player",
   move_according_to_speed_and_direction = "move_according_to_speed_and_direction",
   spawn = "spawn",
   mirrorX = "mirrorX",
   mirrorY = "mirrorY",
   do = "do",
   despawn = "despawn",
   waitTilOutsideScreen = "waitTilOutsideScreen",
   waitTilInsideScreen = "waitTilInsideScreen",
   fork = "fork",
   setMoveDirection = "setMoveDirection", // TODO: remove. deprecated.
   waitForInput = "waitForInput",
   finishLevel = "finishLevel",
   waitUntilCollision = "waitUntilCollision",
   
   /**
    * Attributes
    */
   setAttribute = "setAttribute",
   attrIf = "attrIf",
   incr = "incr",
   decr = "decr",
   waitUntilAttrIs = "waitUntilAttrIs",
   
   /**
    * GFX
    */
   gfxSetPosition = "gfxSetPosition",
   gfxSetDiameter = "gfxSetDiameter",
   gfxSetColor = "gfxSetColor",
   gfxSetShape = "gfxSetShape",
   gfxSetRotation = "gfxSetRotation",
   gfxSetScale = "gfxSetScale",
   gfxScrollBg = "gfxScrollBg",
   gfxFillScreen = "gfxFillScreen",

   /**
    * GFX that is only used internally by the engine.
    */
   gfxAskForElement = "gfxAskForElement",
   gfxRelease = "gfxRelease",

   /**
    * Log
    */
   log = "log",
}

/**
 * Attribute getters.
 * Used to get the value of an attribute an inject that into an action that would otherwise take
 * a integer, float, bool, or string. This is to make stuff more dynamic and flexible.
 */
type TAttrGetter = Readonly<{ gameObjectId?: string, attr: TAttrName }>;

// Allows to ranomize a param where the action's param is a number.
export type TRandomInt = Readonly<{ min: number, max: number }>;

/**
 * Types for primitive values.
 * Instead of using "bool" use TBool (etc) so that an action can either take a hardcoded value
 * or get the value from an attribute.
 */
export type TNumber = Readonly<number | TAttrGetter | TRandomInt>;
export type TString = Readonly<string | TAttrGetter>;
export type TBool = Readonly<boolean | TAttrGetter>;

/** Action types */
export type TWait =                Readonly<{ type: ActionType.wait, frames: TNumber }>;
export type TWaitNextFrame =       Readonly<{ type: ActionType.waitNextFrame }>;
export type TWaitUtilFrameNr =     Readonly<{ type: ActionType.waitUntilFrameNr, frameNr: number}>;
export type TRepeat =              Readonly<{ type: ActionType.repeat,
                                                times: TNumber, actions: TAction[] }>;
export type TShootDirection =      Readonly<{ type: ActionType.shootDirection,
                                                x: number, y: number }>;
export type TShootTowardPlayer =   Readonly<{ type: ActionType.shootTowardPlayer }>;
export type TShootBesidePlayer =   Readonly<{ type: ActionType.shoot_beside_player,
                                                degrees: number }>;
export type TShootAccordingToMoveDirection = Readonly<{
   type: ActionType.shootAccordingToMoveDirection;
   shot?: string; // allows to specify which shot GameObject to use. default is "shot".
}>;
export type TSetShotSpeed =        Readonly<{ type: ActionType.setShotSpeed,
                                                pixelsPerFrame: number }>;
// Moves relative to current position.
export type TMove = Readonly<{
   type: ActionType.move,
   frames: number,
   x?: TNumber,
   y?: TNumber
}>;
// A very atomic action.
export type TMoveDelta =           Readonly<{ type: ActionType.moveDelta, x?: number, y?: number }>
// Move to an absolute postion on screen.
export type TMoveToAbsolute =      Readonly<{ type: ActionType.moveToAbsolute,
                                                moveTo: Partial<Vector>, frames: number }>;
// TODO: Make it possible to randomize the position maybe
export type TSetPosition =         Readonly<{ type: ActionType.set_position,
                                                x: number, y: number }>;
// TODO: Remove TSetSpeed
export type TSetSpeed =            Readonly<{ type: ActionType.setSpeed, pixelsPerFrame: number }>;
export type TRotateAroundAbsolutePoint = Readonly<{
   type:ActionType.rotate_around_absolute_point, point:Partial<Vector>, degrees:number,frames:number
}>;
export type TRotateAroundRelativePoint = Readonly<{
   type:ActionType.rotate_around_relative_point, point:Partial<Vector>, degrees:number,frames:number
}>
/**
 * Like Promise.race.
 * Executes TAction lists in parallel, stops when any one of them has finished.
 */
export type TparallelRace       = Readonly<{ type: ActionType.parallelRace,
                                                actionsLists: TAction[][] }>;
export type TparallelAll        = Readonly<{ type: ActionType.parallelAll,
                                                actionsLists: TAction[][] }>;
export type TRotateTowardsPlayer = Readonly<{ type: ActionType.rotate_towards_player }>;
export type TMoveAccordingToSpeedAndDirection =
                                       { type: ActionType.move_according_to_speed_and_direction };
// Spawns an enemy. actions are prepended to the actions of the particular enemy.
// TODO: Maybe I should allow PseudoRandom.randomInt here?
export type TSpawn = {
   type: ActionType.spawn,
   enemy: string,
   x?: number | TRandomInt,
   y?: number| TRandomInt,
   actions?: TAction[]
};
// Simple if-equals case. Executes yes if true. Executs no when false.
export type TAttrIf = {
   type: ActionType.attrIf, gameObjectId?: string, attrName: TAttrName,
   condition: "equals" | "lessThan" | "greaterThan" | "lessThanOrEqual" | "greaterThanOrEqual",
   value: TAttrValue, yes?: TAction[], no?: TAction[]
};
// Increments an attribute. Obviously will blow up if trying to increment a non-number.
export type TIncrement =
{ type: ActionType.incr, gameObjectId?: string, attribute: TAttrName, amount?: number };
// Decrements an attribute. Obviously will blow up if trying to increment a non-number.
export type TDecrement =
{ type: ActionType.decr, gameObjectId?: string, attribute: TAttrName, amount?: number };

/**
 * Mirroring mirrors an axis.
 * If you have an enemy that moves like another enemy, except
 * that every x movement is inverted then try mirrorX.
 */
export type TMirrorX = { type: ActionType.mirrorX, value: boolean };
export type TMirrorY = { type: ActionType.mirrorY, value: boolean };
/**
 * Enemy despawns.
 * An example of when this should be used is when an enemy despawns outside of the screen,
 */
export type TDespawn = { type: ActionType.despawn };
/**
 * Attributes can be either some predefined thing by me such as hp, collisionType, etc.
 * or it could be  end-user specified variable with any type.
 */
export type TSetAttribute = {
   type: ActionType.setAttribute,
   gameObjectId?: string,
   attribute: TAttrName,
   value: TAttrValue | TRandomInt
};
/**
 * Waits until Enemy is outside the screen/game window.
 * margin is how many pixels the GameObject needs to be outside the screen.
 */
export type TWaitTilOutsideScreen = { type: ActionType.waitTilOutsideScreen, margin?: number };
// Waits until Enemy is inside the screen/game window
export type TWaitTilInsideScreen = { type: ActionType.waitTilInsideScreen };
/**
 * Fork is like fork in C essentially. The actions in fork executes separately
 * (in a separate generator) i.e. these actions won't delay other actions.
 * Usually you can get the same behaviour with `paralllelAll`/`parallelRace` but in some situations
 * the parallel actions aren't really an option (such as when you prepend actions when spawning
 * a new enemy and you want those actions to not delay the enemy's own actions, but rather
 * execute in parallel to them). I.e. fork delay the actions following it zero frames to,
 * while parallelAll/parallelRace have to finish before the next action after can be executed.
 */
export type TFork = {
   type: ActionType.fork,
   // order: "prepend" | "append", // Hm, not sure I need this now.
   actions: TAction[]
};
/**
 * Set only the move direction. Only specific some move actions care about the direction which 
 * gotta be called to move in the direction set with this action.
 */
// TODO: remove TMoveDirection. deprecated
export type TMoveDirection = Readonly<{ type: ActionType.setMoveDirection, degrees: number }>;
// Yields until the attribute has the value set in is.
export type TWaitUntilAttrIs = Readonly<{
   type: ActionType.waitUntilAttrIs, gameObjectId?: TString, attr: TAttrName, is: TAttrValue
}>;

/**
 * TODO: Move this type and makes use of it in Input.ts. It does not look right to have it here.
 */
export type TInputButton =
   "up" | "down" | "left" | "right" |
   "laser" | "shoot" | "start";
/**
 * Waits until the user presses a button.
 * @param pressed The buttons to wait for until they are pressed.
 * @param notPressed These buttons must not be pressed.
 *    notPressed exists because it allows you to wait for a button to be released, or to
 *    handle directional buttons specially.
 */
export type TWaitForInput = Readonly<{
   type: ActionType.waitForInput,
   pressed: TInputButton[],
   notPressed?: TInputButton[]
}>;

// Signals that the level has been finished, so trigger this when end boss dies or something similar
export type TFinishLevel = Readonly<{ type: ActionType.finishLevel }>;

// Action to console.log, so you can debug actions.
export type TLog = Readonly<{ type: ActionType.log, msg: string }>;

// Waits until the GameObject collides with a GameObject with one of the collisionTypes.
export type TWaitUntilCollision = Readonly<{
   type: ActionType.waitUntilCollision,
   collisionTypes: string[],
}>;

export type TAddPoints = Readonly<{ type: ActionType.addPoints, points: number }>;

export type TAction = Readonly<
   /**
    * Utils
    */
   TWait |
   TWaitNextFrame| 
   TWaitUtilFrameNr |
   TRepeat |
   TparallelRace |
   TparallelAll |
   TFork |
   /**
   * Shooting
   */
   TSetShotSpeed |
   TShootDirection |
   TShootTowardPlayer |
   TShootBesidePlayer |
   TShootAccordingToMoveDirection |
   /**
   * Movement
   */
   TMove |
   TMoveDelta |
   TMoveToAbsolute |
   TSetPosition |
   TSetSpeed | // TODO: Remove.
   TRotateAroundAbsolutePoint |
   TRotateAroundRelativePoint |
   TRotateTowardsPlayer |
   TMoveAccordingToSpeedAndDirection |
   TMoveDirection | // TODO: remove. deprecated.
   /**
    * Controls/input
    */
   TWaitForInput |
   /**
   * Spawning/Life cycle
   */
   TSpawn |
   TDespawn |
   TWaitTilOutsideScreen |
   TWaitTilInsideScreen |
   /**
    * Control/Conditions/Attributes
    */
   TAttrIf |
   TSetAttribute |
   TIncrement |
   TDecrement |
   TWaitUntilAttrIs |
   TFinishLevel |
   /**
    * Collisions
    */
   TWaitUntilCollision |
   /**
    * Mirroring
    */
   TMirrorX |
   TMirrorY |
   /**
    * And also all Graphics actions
    * I remove the handles because the enemy that executes the actions has the handle already.
    */
   TGraphicsActionWithoutHandle |
   /**
    * Log
    */
   TLog |
   /**
    * Temporary. Remove later.
    */
   TAddPoints
>;
