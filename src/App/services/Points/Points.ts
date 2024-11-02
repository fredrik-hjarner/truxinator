import type { App } from "../../App";
import type { TGameEvent, TPointsEvent } from "../Events/IEvents";
import type { IPoints } from "./IPoints";

type TConstructor = {
   app: App;
   name: string
}

export class Points implements IPoints {
   private readonly app: App;
   public readonly name: string;
   public points: number;

   public constructor({ app, name }: TConstructor) {
      this.app = app;
      this.name = name;
      this.points = 0;
   }

   // eslint-disable-next-line @typescript-eslint/require-await
   public Init = async () => {
      this.app.events.subscribeToEvent(this.name, this.onEvent);
      this.app.eventsPoints.subscribeToEvent(this.name, this.onEvent);
   };

   /**
    * Private
    */

   private onEvent = (event: TGameEvent | TPointsEvent) => {
      switch(event.type) {
         case "add_points": {
            this.points += event.points;
            // console.log(`${event.enemy}: ${event.points}pts`);
            // this.updatePoints();
            break;
         }
         case "gameOver":
            // unsub because we dont want to get in here again.
            this.app.events.unsubscribeToEvent(this.name);
            break;
         default:
            // NOOP
      }
   };

}