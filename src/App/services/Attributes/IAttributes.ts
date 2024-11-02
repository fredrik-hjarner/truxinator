import type { LiteralUnion } from "type-fest";
import type { IService } from "../IService";
import type { IDestroyable } from "../../../utils/types/IDestroyable";

/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 */
export type TAttrValue = string | number | boolean;

/**
 * to aid with autocompletion for attriubte keys/names.
 * TODO: Move this and similar up into gameTypes folder, because thats where
 * types that are needed to created a game/stage/level should go.
 */
export type TAttrName = LiteralUnion<
   "pointsOnDeath" |
   "parentId" |
   "collisionType" |
   "boundToWindow",
   string
>

export type TAttributes = {
   gameObjects: Partial<{
      [gameObjectId: string]: Partial<{
         // how many points you get when this dies.
         pointsOnDeath: number;
         // stores the id of the GameObject that is the parent, i.e. the one that created this child
         parentId: string;
         // hp?: number;
         // maxHp?: number;
         /**
          * TODO: The type of collision type should prolly be somewhere else since it is needed in
          * other places
          */
         /**
          * Different things can and can't collide with each other.
          * none, enemy, enemyBullet, player, playerBullet.
          * (may add groundEnemy later).
          * TODO: Update comment!!!!!
          */
         collisionType: LiteralUnion<"none", string>;
         // If should not be allowed to leave the game window. Player should be contrained to window
         boundToWindow: boolean;
         [attribute: string]: TAttrValue;
      }>
   }>
};

export type TGameObjectIdAndAttrParams = { gameObjectId: string, attribute: string };
export type TGetAttrParams = { gameObjectId: string, attribute: string };
export type TSetAttrParams = { gameObjectId: string, attribute: string, value: TAttrValue };
export type TIncrDecrAttrParams = { gameObjectId: string, attribute: string, amount: number };

export interface IAttributes extends IService, IDestroyable {
   setAttribute: ({ gameObjectId, attribute, value }: TSetAttrParams) => void;
   getAttribute: (params: TGameObjectIdAndAttrParams) => TAttrValue;
   getNumber: (params: TGameObjectIdAndAttrParams) => number;
   getString: (params: TGameObjectIdAndAttrParams) => string;
   getBool: (params: TGameObjectIdAndAttrParams) => boolean;
   incr: (params: TIncrDecrAttrParams) => void;
   decr: (params: TIncrDecrAttrParams) => void;
   removeGameObject: (gameObjectId: string) => void;
}
