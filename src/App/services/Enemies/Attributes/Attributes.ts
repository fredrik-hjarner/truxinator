/**
 * End-user should be able to set attributes, they will be like variables,
 * that is why they need to be able to be of different types.
 * undefined will essentially be equal to "unsetting" an attribute.
 */
export type TAttributeValue = string | number | boolean;

export type TAttribute = Attribute;

class Attribute {
   public value: TAttributeValue;
   public type: "string" | "number" | "boolean";
   
   constructor(value: TAttributeValue) {
      this.value = value;
      const type = typeof value;
      if(type === "string" || type === "number" || type === "boolean") {
         this.type = type;
      } else {
         throw new Error(
            `Attribute.constructor: typeof value was "${type}" which is not an allowed type.`
         );
      }
   }
}

export class Attributes {
   // Observe!! Object types like this should be in Partial<> to signal that keys may not exist.
   private attributes: Partial<Record<string, Attribute>> = {};

   public SetAttribute = (params: { name: string, value: TAttributeValue }) => {
      const {name, value} = params;
      this.attributes[name] = new Attribute(value);
   };

   public UnsetAttribute = (name: string) => {
      if(!(name in this.attributes)){
         throw new Error(
            `UnsetAttribute: Tried to unset an attribute "${name}" that does not exist.`
         );
      }
      delete this.attributes[name];
   };

   public GetAttribute = (name: string): Attribute => {
      const attr = this.attributes[name];
      if(attr === undefined) {
         throw new Error(
            `GetAttribute: Tried to get an attribute "${name}" that does not exist.`
         );
      }
      return attr;
   };
}