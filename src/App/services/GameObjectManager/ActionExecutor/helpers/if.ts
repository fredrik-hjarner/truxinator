import type { TAttrIf } from "../../actions/actionTypes.ts";
import type { TAttrValue } from "../../../Attributes/IAttributes.ts";

// Helper function to deal with attribute if checks.
type TIfAttrParams = { attrValue: TAttrValue } & Pick<TAttrIf, "condition" | "value">;
export function ifAttr({ attrValue, condition, value }: TIfAttrParams): boolean {
   switch(condition) {
      case "equals":
         return attrValue === value;
      case "greaterThan":
         return attrValue > value;
      case "lessThan":
         return attrValue < value;
      case "greaterThanOrEqual":
         return attrValue >= value;
      case "lessThanOrEqual":
         return attrValue <= value;
      default:
         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
         throw new Error(`Unknown condition: ${condition}`);
   }
}