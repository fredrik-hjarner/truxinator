import type { App } from "../../App";
import type { TCollisions } from "../Collisions/Collisions";
import type { IService } from "../IService";

/***********
 * Generic *
 ***********/

export type TEventCallback<TEvent> = (event: TEvent) => void;

export type TEventSubscribers<TEvent> = {
   [ key: string]: TEventCallback<TEvent>
}

export interface IEvents<TEvent> extends IService {
   app: App;
   name: string;
   subscribeToEvent: (nameOfSubscriber: string, callback: TEventCallback<TEvent>) => void
   unsubscribeToEvent: (nameOfSubscriber: string) => void
   dispatchEvent: (event: TEvent) => void
}

/**************
 * GameEvents *
 **************/

// TODO: I really want to remove the frame_tick event.
type TEventFrameTick = { type: "frame_tick" };

export type TGameEvent = TEventFrameTick; // signals next frame has come

export type TGameEventCallback =  TEventCallback<TGameEvent>;
export type TGameEventSubscribers = TEventSubscribers<TGameEvent>
export type IGameEvents = IEvents<TGameEvent>;


/********************
 * EventsCollisions *
 ********************/

export type TCollisionsEvent =
   // when collisions happen.
   { type: "collisions", collisions: TCollisions };

export type TCollisionsEventCallback =  TEventCallback<TCollisionsEvent>;
export type TCollisionsEventSubscribers = TEventSubscribers<TCollisionsEvent>;
export type IEventsCollisions = IEvents<TCollisionsEvent>;
