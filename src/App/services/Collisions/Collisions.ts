import type { GameObjectManager } from "../GameObjectManager/GameObjectManager.ts";
import type { IService, TInitParams } from "../IService";
import type { IAttributes } from "../Attributes/IAttributes";

import { BrowserDriver } from "../../../drivers/BrowserDriver/index.ts";
import { assertString } from "@/utils/typeAssertions.ts";
// import { resolutionHeight, resolutionWidth } from "@/consts";

export type PosAndRadiusAndId = {x: number, y: number, Radius: number, id: string };

/**
 * Object containing all collisions.
 * Keyed by gameObjectId.
 * The value is an array of `collisionTypes` that the gameObjects it collided with have.
 */
export type TCollisions = {
   [gameObjectId: string]: string[];
};

type TConstructor = {
   name: string;
}

// const isOutsideOfScreen = (x: number, y: number, radius: number): boolean => {
//    return x < -radius || x > resolutionWidth + radius ||
//       y < -radius || y > resolutionHeight + radius;
// };

export class Collisions implements IService {
   // vars
   public readonly name: string;
   // adds the time, every frame, it took for collision detection. 
   public accumulatedTime = 0;
   
   // deps/services
   private gameObjectManager!: GameObjectManager;
   private attributes!: IAttributes;

   /**
   * Public
   */
   public constructor(params: TConstructor) {
      this.name = params.name;
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
      this.gameObjectManager = deps?.gameObjectManager!;
      this.attributes = deps?.attributes!;
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */
   };

   public calculateCollisions = (): TCollisions => {
      const startTime = BrowserDriver.PerformanceNow();

      // variable in which to store all collisions.
      const collisions: TCollisions = {};

      const enemiesThatCanCollide = Object.values(this.gameObjectManager.enemies)
         .filter((enemy) => {
            const collisionType = this.attributes.getAttribute({
               gameObjectId: enemy.id,
               attribute: "collisionType"
            });
            return collisionType !== "none";
         });

      for (const enemy1 of enemiesThatCanCollide) {
         collisions[enemy1.id] = [];

         for(const enemy2 of enemiesThatCanCollide) {
            if(enemy1.id === enemy2.id) {
               continue; // dont check collision with self.
            }

            const collided = this.calcCollision({
               doesThis: enemy1,
               collideWithThis: enemy2
            });

            if(collided) {
               const collisionType = assertString(
                  this.attributes.getAttribute({
                     gameObjectId: enemy2.id,
                     attribute: "collisionType"
                  })
               );
               // seems I only record one of each collision type. so if player collides with two
               // enemies then only the first one is recorded pretty much.
               collisions[enemy1.id] = [...new Set(
                  [...collisions[enemy1.id], collisionType]
               )];
            }
         }

      }

      const endTime = BrowserDriver.PerformanceNow();
      this.accumulatedTime += endTime - startTime;

      // console.log("collisions:", collisions);

      return collisions;
   };

   /**
    * Private
    */
   private calcCollision = (
      params: { doesThis: PosAndRadiusAndId, collideWithThis: PosAndRadiusAndId }
   ): boolean => {
      const { doesThis, collideWithThis } = params;
      
      // Subtracting from minDistance if a hack to cause lower hit "box".
      // TODO: Would be better to use attributes for this, like "hitBoxRadius" or something.
      // Though to begin with figuring out a good number for the hack.
      const minDistance = (doesThis.Radius + collideWithThis.Radius) * 0.9;
      const xDist = doesThis.x - collideWithThis.x;
      const yDist = doesThis.y - collideWithThis.y;
      const distance = Math.hypot(xDist, yDist);
      if(distance <= minDistance) {
         return true;
      }

      return false;
   };
}
