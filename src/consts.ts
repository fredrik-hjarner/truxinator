/**
 * This is the width of the stage!
 */
export const resolutionWidth = 357; // confirmed correct!

// This is the resolution height of Tatsujin for PC Engine.
export const resolutionHeight = 240; // confirmed correct!

// Calculations happen every frame, no more o less.
const frameRate = 60;
export const millisPerFrame = 1000 / frameRate;

// const playerSpeedPerFrame = [
//    // zero upgrades
//    2.35 // confirmed correct!
// ] as const;

// export const framesBewteenPlayerShots = 8;
// export const playerShotSpeed = 9;

// export const enemyShotSpeed = 3;

// TODO: Add more/all z indices.
export const zIndices = {
   gameHide: "1",
   graphicsEngineElements: "0", // Set to "0" to hide behind gameHide.
   ui: "2"
} as const;

export const enableReduxDevTools = false;