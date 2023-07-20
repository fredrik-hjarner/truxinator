/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TAction } from "../actions/actionTypes";

import { describe, it, expect } from "vitest";

import { EnemyActionExecutor } from "../EnemyActionExecutor";

const input: any = undefined;
const gamepad: any = undefined;

describe("parallelRace", () => {
   const enemy: any = {
      getPosition: () => ({ x: 0, y: 0 })
   };

   it("empty actions list. exect no exception. expect done", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => {
         recordedActions.push(action);
      };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         input,
         gamepad,
         actions: [{
            type: "parallelRace",
            actionsLists: [[]]
         }]
      }).generators[0];

      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(0);
   });

   it("One empty action list. Expect no recordedActions. Expect immediate done.", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         input,
         gamepad,
         actions: [{
            type: "parallelRace",
            actionsLists: [
               [],
               [
                  { type: "setSpeed", pixelsPerFrame: 1 }
               ]
            ]
         }]
      }).generators[0];

      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(1);
   });

   it("Expect shorter list to shortcut", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         input,
         gamepad,
         actions: [{
            type: "parallelRace",
            actionsLists: [[
               { type: "setSpeed", pixelsPerFrame: 1 }
            ], [
               { type: "waitNextFrame" },
               { type: "setSpeed", pixelsPerFrame: 1 }
            ]]
         }]
      }).generators[0];

      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(1);
   });

   it("Expect shorter list to shortcut. Test2", () => {
      const recordedActions: TAction[] = [];
      const actionHandler = (action: TAction) => { recordedActions.push(action); };

      const generator = new EnemyActionExecutor({
         enemy,
         actionHandler,
         input,
         gamepad,
         actions: [{
            type: "parallelRace",
            actionsLists: [[
               { type: "waitNextFrame" },
               { type: "setSpeed", pixelsPerFrame: 1 }
            ], [
               { type: "waitNextFrame" },
               { type: "waitNextFrame" },
               { type: "setSpeed", pixelsPerFrame: 1 }
            ]]
         }]
      }).generators[0];

      expect(generator.next().done).toBe(false);
      expect(recordedActions.length).toBe(0);
      expect(generator.next().done).toBe(true);
      expect(recordedActions.length).toBe(1);
   });
});

export { };