import type { App } from "../../App";

import { firstMiniBossShootActions } from "./enemyConfigs/firstMiniBoss/shootActions";
import {
  firstMiniBossMoveActions1,
  firstMiniBossMoveActions2
} from "./enemyConfigs/firstMiniBoss/moveActions";
import { resolutionWidth } from "../../../consts";
import { Enemy } from "./Enemy";
import { uuid } from "../../../utils/uuid";

export class Enemies {
  app: App;
  enemies: Enemy[];
  name: string;

  /**
   * Public
   */
  constructor(app: App, { name }: { name: string }) {
    this.app = app;
    this.name = name;
    this.enemies = [
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.333,
        origY: -20,
        hp: 120,
        actionLists: [
          firstMiniBossShootActions,
          firstMiniBossMoveActions1
        ]
      }),
      new Enemy(app, {
        id: uuid(),
        origX: resolutionWidth*0.666,
        origY: -20,
        hp: 120,
        actionLists: [
          firstMiniBossShootActions,
          firstMiniBossMoveActions2
        ]
      }),
    ];
  }
  
  /**
   * Init runs after bootstrap.
   * If it needs to use things on app dont do that in the constructor
   * since the order on they are added to app makes a difference in
   * that case.
   */
  Init = () => {
    this.app.events.subscribeToEvent(
      this.name,
      event => {
        switch(event.type) {
          case 'frame_tick':
            this.enemies.forEach(enemy => {
              enemy.OnFrameTick();
            });
            break;
          case 'collisions':
            this.enemies.forEach(enemy => {
              enemy.OnCollisions(event.collisions);
            });
            break;
        }
      }
    );
  };
}