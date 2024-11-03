import type { IGraphics, TGraphicsAction, TGraphicsResponse } from "../IGraphics";

export class MockGraphics implements IGraphics {
   public name: string;

   public constructor() {
      this.name = "mockGraphics";
   }

   public Init = async () => {
      // noop
   };

   public Dispatch = (_: TGraphicsAction): TGraphicsResponse => {
      // noop
      return { type: "responseVoid" };
   };

   public destroy = () => {
      // noop
   };
}
