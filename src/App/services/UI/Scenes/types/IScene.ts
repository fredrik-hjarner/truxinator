import type { IUI } from "../../IUI";

export interface IScene {
   ui: IUI;
   // Allows to send in whatever. Has to be typechecked afterwards.
   render(props?: unknown): void
   destroy(): void
   // TODO: Hm this is only used by Game.ts. render does more. update only updates the score.
   // this could probably be improved.
   update?(): void
}
