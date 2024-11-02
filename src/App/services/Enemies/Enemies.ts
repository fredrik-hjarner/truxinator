import type { Vector as TVector } from "../../../math/bezier";
import type { IService, TInitParams } from "../IService";
import type { GameData } from "../GamaData/GameData";
import type { TGameObject } from "../../../gameTypes/TGameObject";
import type {
   IEventsCollisions, IGameEvents, TCollisionsEvent, TGameEvent
} from "../Events/IEvents";
import type { IGraphics } from "../Graphics/IGraphics";
import type { GamePad } from "../GamePad/GamePad";
import type { IInput } from "../Input/IInput";
import type { Settings } from "../Settings/Settings";
import type { TAction } from "./actions/actionTypes.ts";
import type { IAttributes } from "../Attributes/IAttributes";
import type { IPseudoRandom } from "../PseudoRandom/IPseudoRandom.ts";

import { ActionType as AT } from "./actions/actionTypes.ts";
import { Enemy } from "./Enemy.ts";

export class Enemies implements IService {
   public readonly name: string;
   public enemies: { [gameObjectId: string]: Enemy };
   // Just so that player does not have to be found every time.
   private memoizedPlayer?: Enemy;

   // deps/services
   private gameData!: GameData;
   public events!: IGameEvents;
   public eventsCollisions!: IEventsCollisions;
   public graphics!: IGraphics;
   public input!: IInput;
   public gamepad!: GamePad;
   public settings!: Settings;
   public attributes!: IAttributes;
   public pseudoRandom!: IPseudoRandom;

   /**
    * Public
    */
   public constructor({ name }: { name: string }) {
      this.name = name;
      this.enemies = {};
   }

   /**
    * Init runs after bootstrap.
    * If it needs to use things on app dont do that in the constructor
    * since the order on they are added to app makes a difference in
    * that case.
    */
   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async (deps?: TInitParams) => {
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      // TODO: Better type checking.
      this.events = deps?.events!;
      this.eventsCollisions = deps?.eventsCollisions!;
      this.gameData = deps?.gameData!;
      this.graphics = deps?.graphics!;
      this.input = deps?.input!;
      this.gamepad = deps?.gamepad!;
      this.settings = deps?.settings!;
      this.attributes = deps?.attributes!;
      this.pseudoRandom = deps?.pseudoRandom!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

      this.events.subscribeToEvent(this.name, this.handleEvent);
      this.eventsCollisions.subscribeToEvent(this.name, this.handleEvent);
   };

   public Spawn = (
      { enemy, position, prependActions=[], parentId }:
      { enemy: string, position: TVector, prependActions?: TAction[], parentId?: string }
   ) => {
      // console.log(`Enemies.Spawn: enemy: ${enemy}`);
      // console.log(`Spawn ${enemy} at ${JSON.stringify(position)}`);
      const enemyJson = this.gameData.GetEnemy(enemy);
      // console.log(`Enemies.Spawn: enemyJson.name: ${enemyJson.name}`);

      // action that sets the parentId attribute to hold what gameObject spawned this GameObject.
      const parentIdAction = (parentId ?
         [{ type: AT.setAttribute, attribute: "parentId", value: parentId } as const]:
         []
      );

      /**
       * prepend the actions that the parent sent. this allow parent some control over it's spawn.
       * also add die-when-outside-screen behaviour too all spawns.
       */
      const newEnemyJson: TGameObject = {
         ...enemyJson,
         actions: [
            ...parentIdAction,
            ...prependActions,
            ...enemyJson.actions
         ]
      };
      // console.log(`Enemies.Spawn: newEnemyJson.name: ${newEnemyJson.name}`);
      // console.log(
      //    `Enemies.Spawn: enemies before push: ${this.enemies.map(e => e.id).toString()}`
      // );
      /**
       * TODO: There "used to" be is a bug here.
       * What can happen is that an Enemy's constructor executes a bunch of code that never fully
       * completes. The consequence is that the enemy is never added to the enemies array!!!!
       * 
       * "Fixed" by moving the OnFrameTick() call to after the push (used to be called at end of
       * Enemy's constructor).
       */
      const newEnemyInstance = new Enemy(this, position, newEnemyJson);
      this.enemies[newEnemyInstance.id] = newEnemyInstance;
      // console.log(
      //    `Enemies.Spawn: enemies after push: ${this.enemies.map(e => e.id).toString()}`
      // );
      // Execute one frame. This is important if the enemy has some initialization that it needs
      // have to have run, otherwise initialization (with actions) would be delayed one frame from
      // being constructed/added via constructor.
      newEnemyInstance.OnFrameTick();
   };

   public get player(): Enemy {
      if(this.memoizedPlayer !== undefined) {
         return this.memoizedPlayer;
      }

      const player = Object.values(this.enemies).find(e =>
         this.attributes.getAttribute({
            gameObjectId: e.id,
            attribute: "collisionType"
         }) as string === "player"
      );
      if(player === undefined) {
         throw new Error("Enemies.getPlayer: Player was not found");
      }
      this.memoizedPlayer = player;
      return player;
   }

   // TODO: Push this down into Enemy, so that onFramTick and OnCollisions can be private
   private handleEvent = (event: TGameEvent | TCollisionsEvent) => {
      switch(event.type) {
         // TODO: Should send frameNumber/FrameCount as paybload in frame_tick event.
         case "frame_tick": {
            /**
             * Spawn the spawner on the first frame
             */
            if(event.frameNr === 1) {
               /**
                * The "spawner" enemy is not a normal enemy.
                * It can do everything that an enemy can do, but it's
                * primary purpose is to auto-spawn at [0, 0] and
                * be resposible for spawning enemies.
                */
               this.Spawn({ enemy: "spawner", position: { x:0, y: 0 } });
            }

            /**
             * TODO: Here we see that the first tick happens immediately at spawn so I could,
             * if I wanted to, actually set everything in the actions as actions such as set
             * hp, set_position etc. Dunno if I want to do it like that though.
             */
            // console.log(`Enemies.tick: enemies:`, this.enemies.map(e => e.id));
            for (const enemy of Object.values(this.enemies)) {
               enemy.OnFrameTick();
            }
            break;
         }
         case "collisions": // max 1 collision event per frame. Collisions service only emits 1 evt
            for (const [enemyId, collisionTypes] of Object.entries(event.collisions)) {
               const enemy = this.enemies[enemyId];
               if(enemy) {
                  // TODO: new code. I want to store the collision types that the enemy collided
                  // with on the enemy for ONE frame (the generator function reads these).
                  enemy.collidedWithCollisionTypesThisFrame = [
                     ...new Set([...enemy.collidedWithCollisionTypesThisFrame, ...collisionTypes])
                  ];
               }
            }
            break;
         default:
            // NOOP
      }
   };
}