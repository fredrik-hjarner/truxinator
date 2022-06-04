import type { Vector } from "../../../math/bezier";

export type TWait =              { type: "wait", frames: number};
export type TWaitUtilFrameNr =   { type: "wait_util_frame_nr", frameNr: number};
export type TRepeat =            { type: "repeat", times: number, actions: Action[] };
export type TShootDirection =    { type: "shoot_direction", dirX: number, dirY: number };
export type TShootTowardPlayer = { type: "shoot_toward_player" };
export type TShootBesidePlayer = { type: "shoot_beside_player", clockwiseDegrees: number };
export type TSetShotSpeed =      { type: "set_shot_speed", pixelsPerFrame: number };
// Moves relative to current position.
export type TMove =              { type: "move", movement: Vector, frames: number };
// Move to an absolute postion on screen.
export type TMoveToAbsolute =    { type: "move_to_absolute",
                                   moveTo: Partial<Vector>, frames: number };
export type TSetPosition =       { type: "set_position", x: number, y: number };
export type TMoveBezier =        { type: "move_bezier", bend: Vector, end: Vector, frames: number };
export type TSetSpeed =          { type: "set_speed", x: number, y: number };
export type TRotateAroundPoint = { type: "rotate_around_point",
                                   point: Vector, degrees: number, frames: number };

export type Action =
  /**
   * Common
   */
  TWait |
  TWaitUtilFrameNr |
  TRepeat |
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
  TMoveToAbsolute |
  TSetPosition |
  TMoveBezier |
  TSetSpeed |
  TRotateAroundPoint;
