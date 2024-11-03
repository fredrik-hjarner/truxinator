import type { IService } from "../IService.ts";
import type { TCollisions } from "../Collisions/Collisions.ts";

export interface IEnemies extends IService {
   storeCollisions: (collisions: TCollisions) => void;
}
