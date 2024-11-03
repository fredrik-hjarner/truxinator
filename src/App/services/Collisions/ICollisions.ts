
import type { IService } from "../IService";
import type { TCollisions } from "./Collisions";

// TODO: Should maybe not extend IService at all
// at least the Update and onGameOver (i.e. not universally
// common methods on that interface) sucks.
export interface ICollisions extends IService {
   calculateCollisions: () => TCollisions;
}