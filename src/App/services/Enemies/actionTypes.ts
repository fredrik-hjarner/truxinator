import type { Vector } from "../../../math/bezier";
import type { TShortFormAction as TSFAction } from "./actionTypesShortForms";

export type TWait =                { type: "wait", frames: number };
export type TWaitNextFrame =       { type: "waitNextFrame" };
export type TWaitUtilFrameNr =     { type: "wait_util_frame_nr", frameNr: number};
export type TRepeat =              { type: "repeat", times: number, actions: TSFAction[] };
export type TShootDirection =      { type: "shootDirection", x: number, y: number };
export type TShootTowardPlayer =   { type: "shoot_toward_player" };
export type TShootBesidePlayer =   { type: "shoot_beside_player", degrees: number };
export type TSetShotSpeed =        { type: "setShotSpeed", pixelsPerFrame: number };
// Moves relative to current position.
export type TMove =                { type: "move", frames: number } & Partial<Vector>;
// A very atomic action.
export type TMoveDelta =           { type: "moveDelta", x?: number, y?: number }
// Move to an absolute postion on screen.
export type TMoveToAbsolute =      { type: "moveToAbsolute",
moveTo: Partial<Vector>, frames: number };
export type TSetPosition =         { type: "set_position", x: number, y: number };
export type TSetSpeed =            { type: "setSpeed", pixelsPerFrame: number };
export type TRotateAroundAbsolutePoint =
{ type: "rotate_around_absolute_point",
point:Partial<Vector>, degrees:number, frames:number };
export type TRotateAroundRelativePoint =
{ type: "rotate_around_relative_point",
point:Partial<Vector>, degrees:number, frames:number };
/**
 * Like Promise.race.
 * Executes TAction lists in parallell, stops when any one of them has finished.
 */
export type TParallellRace       = { type: "parallellRace", actionsLists: TSFAction[][] };
export type TParallellAll        = { type: "parallellAll", actionsLists: TSFAction[][] };
export type TRotateTowardsPlayer = { type: "rotate_towards_player" };
export type TMoveAccordingToSpeedAndDirection = { type: "move_according_to_speed_and_direction" };
// Spawns an enemy.
export type TSpawn = { type: "spawn", enemy: string, x: number, y: number, flags?: string[] };
// Simple if case. Executes yes if true. Executs no when false.
export type TFlag = { type: "flag", flagName: string, yes?: TSFAction[], no?: TSFAction[] };
/**
 * Mirroring mirrors an axis.
 * If you have an enemy that moves like another enemy, except
 * that every x movement is inverted then try mirrorX.
 */
export type TMirrorX = { type: "mirrorX", value: boolean };
export type TMirrorY = { type: "mirrorY", value: boolean };
/**
 * The only purpose for this is to "flatten" arrays in YAML.
 * The action simple executes the actions sent to it. As simple as that.
 */
export type TDo = { type: "do", acns: TSFAction[] };

export type TAction =
   /**
    * Utils
    */
   TWait |
   TWaitNextFrame| 
   TWaitUtilFrameNr |
   TRepeat |
   TParallellRace |
   TParallellAll |
   TDo |
   /**
   * Shooting
   */
   TSetShotSpeed |
   TShootDirection |
   TShootTowardPlayer |
   TShootBesidePlayer |
   /**
   * Movement
   */
   TMove |
   TMoveDelta |
   TMoveToAbsolute |
   TSetPosition |
   TSetSpeed |
   TRotateAroundAbsolutePoint |
   TRotateAroundRelativePoint |
   TRotateTowardsPlayer |
   TMoveAccordingToSpeedAndDirection |
   /**
   * Spawning
   */
   TSpawn |
   /**
    * Control/Conditions/Flags
    */
   TFlag |
   /**
    * Mirroring
    */
   TMirrorX |
   TMirrorY;
