import type { Vector as TVector } from "@/math/bezier.ts";

import { resolutionHeight, resolutionWidth } from "@/consts.ts";

export const createIsOutsideScreen = (margin: number) => {
   const left = -margin;
   const right = resolutionWidth + margin;
   const top = -margin;
   const bottom = resolutionHeight + margin;

   return  ({ x, y }: TVector): boolean => {
      return x < left || x > right || y < top || y > bottom;
   };
};
