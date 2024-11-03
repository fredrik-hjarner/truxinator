import type { IService } from "../IService";
import type { TCollisions } from "../Collisions/Collisions";

export interface IEnemies extends IService {
   storeCollisions: (collisions: TCollisions) => void;
}
