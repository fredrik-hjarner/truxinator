/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TAction, TSetPosition } from "../actions/actionTypes.ts";

import { describe, it, expect } from "vitest";

import { ActionType as AT } from "../actions/actionTypes.ts";
import { EnemyActionExecutor } from "../ActionExecutor/EnemyActionExecutor.ts";

const input: any = undefined;
const gamepad: any = undefined;

describe("move", () => {
   const enemy: any = {
      getPosition: () => ({ x: 0, y: 0 })
   };

   // TODO: Can't handle frames being zero. Fix.
   it.skip("move one pixel over zero frame. expect moved and not progressed frame.", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         input,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         gamepad,
         actions: [{
            type: AT.move,
            x: 1,
            y: 0,
            frames: 0
         }]
      }).generators[0];

      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(1);
   });

   it("move one pixel over one frame. expect progressed one frame. expect moved.", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         input,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         gamepad,
         actions: [{
            type: AT.move,
            x: 1,
            y: 0,
            frames: 1
         }]
      }).generators[0];

      // move, also will yield
      expect(generator.next().done).toBe(false);
      // expect the move to have happened.
      expect(recordedActions.length).toBe(1);
      // next time will be done because nothing to do
      expect(generator.next().done).toBe(true);
      // expect no more actions to have been happened.
      expect(recordedActions.length).toBe(1);
   });

   it("move 2 pixel over 2 frame.", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         input,
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         gamepad,
         actions: [{
            type: AT.move,
            x: 2,
            y: 0,
            frames: 2
         }]
      }).generators[0];

      // 1st move.
      expect(generator.next().done).toBe(false);
      // expect x to be 1.
      expect((recordedActions[0] as TSetPosition).x).toBe(1);
      // 2nd move
      expect(generator.next().done).toBe(false);
      // expect x to be 1.
      expect((recordedActions[1] as TSetPosition).x).toBe(1);
      // expect done since no more actions
      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(2);
   });
});

export { };