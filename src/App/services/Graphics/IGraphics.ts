import type { LiteralUnion } from "type-fest";
import type { IService } from "../IService.ts";
import type { IDestroyable } from "../../../utils/types/IDestroyable.ts";
import type { ActionType as AT } from "../GameObjectManager/actions/actionTypes.ts";

export type THandle = string;

export type TShape = LiteralUnion<
   "none" |
   "circle" |
   "square" |
   "triangle" |
   "diamondShield" |
   "octagon" |
   "explosion" |
   "roundExplosion",
   /**
    * fallback case. allows to set ANY image. actually I should probably remove all others and
    * just have this one.
    */
   string
>;

/***********
 * Actions *
 ***********/
// Asks the Graphics Engine for a graphics element if you want one.
export type TGfx_AskForElement = { type: AT.gfxAskForElement };
export type TGfx_SetPosition = {
   type: AT.gfxSetPosition,
   handle: THandle, x?: number, y?: number
};
export type TGfx_SetDiameter = {
   type: AT.gfxSetDiameter,
   handle: THandle, diameter: number
};
// Releases a GraphicsElement, so it's free for other to pick up/ask for/claim.
export type TGfx_Release = { type: AT.gfxRelease, handle: THandle };
export type TGfx_SetColor = {
   type: AT.gfxSetColor,
   handle: THandle, color: string
};
export type TGfx_SetShape = {
   type: AT.gfxSetShape,
   handle: THandle, shape: TShape
};
export type TGfx_SetRotation = {
   type: AT.gfxSetRotation,
   handle: THandle, degrees: number
};
// TODO: This seems to be unused. Unclear purpose.
export type TGfx_SetScale = {
   type: AT.gfxSetScale,
   handle: THandle, scale: number
};
// scrolls the background by x, y.
export type TGfx_ScrollBg = {
   type: AT.gfxScrollBg,
   handle: THandle, x?: number, y?: number
};
// make gfx cover the whole screen
export type TGfx_FillScreen = {
   type: AT.gfxFillScreen,
   handle: THandle
};

export type TGraphicsAction =
   TGfx_AskForElement | TGfx_SetPosition | TGfx_SetDiameter | TGfx_Release | TGfx_SetColor |
   TGfx_SetShape | TGfx_SetRotation | TGfx_SetScale | TGfx_ScrollBg | TGfx_FillScreen;

/**
 * When you run commands via a yaml file,the handle does not need to be sent in
 * because the enemy itself knows/has it's own graphics handle, so it is
 * unnecesary to add.
 */
export type TGraphicsActionWithoutHandle =
   // TGfx_AskForElement | // not allowed to run as command from yaml
   Omit<TGfx_SetPosition, "handle"> |
   Omit<TGfx_SetDiameter, "handle"> |
   // Omit<TGfx_Release, "handle"> | // not allowed to run as command from yaml
   Omit<TGfx_SetColor, "handle"> |
   Omit<TGfx_SetShape, "handle"> |
   Omit<TGfx_SetRotation, "handle"> |
   Omit<TGfx_SetScale, "handle"> |
   Omit<TGfx_ScrollBg, "handle"> |
   Omit<TGfx_FillScreen, "handle">;

/*************
 * Responses *
 *************/
// Returns a handle to the element.
export type TResponse_AskForElement = {
   type: "responseAskForElement", handle: THandle,
}
export type TResponse_Void = { type: "responseVoid" };

export type TGraphicsResponse = TResponse_AskForElement | TResponse_Void;

export interface IGraphics extends IService, IDestroyable {
   Dispatch(action: TGraphicsAction): TGraphicsResponse;
}
