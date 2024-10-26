/* eslint-disable import/no-default-export */
import type { TGame } from "@/gameTypes/TGame";

import { explosion, roundExplosion } from "../utils/effects.ts";
import { player } from "./player/player.ts";
import { playerShot } from "./player/playerShot.ts";
import { shot } from "./shot.ts";
import { spawner } from "./spawner.ts";
import { layer1, layer2, layer3, parallax } from "./parallax/parallax.ts";
import { asteroid, smallAsteroid, tinyAsteroid, tinyAsteroidFragment } from "./asteroid.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";
import { asteroidSpawner } from "./asteroidSpawner.ts";

const startScreen: string = IsBrowser() ? (await import("./startScreen.png")).default : "";

const game: TGame = {
   name: "3. Asteroids",

   startScreenImageUrl: startScreen,

   gameObjects: [
      player,
      playerShot,
      parallax,
      layer1,
      layer2,
      layer3,
      explosion,
      roundExplosion,
      shot,
      asteroid,
      smallAsteroid,
      tinyAsteroid,
      tinyAsteroidFragment,
      asteroidSpawner,

      spawner,
   ]
};

export default game;
