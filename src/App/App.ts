import { Enemies } from "./services/Enemies/Enemies";
import { GameLoop } from "./services/GameLoop/GameLoop";
import { Input } from "./services/Input/Input";
import { Player } from "./services/Player/Player";
import { Shots } from "./services/Shots/Shots";
import { GamePad } from "./services/GamePad/GamePad";
import { Collisions } from "./services/Collisions/Collisions";
import { Events } from "./services/Events/Events";
import { GameSpeed } from "./services/GameSpeed/GameSpeed";
import { Points } from "./services/Points/Points";
import { GameOver } from "./services/GameOver/GameOver";
import { Yaml } from "./services/Yaml/Yaml";

export class App {
   input: Input;
   gameLoop: GameLoop;
   player: Player;
   playerShots: Shots;
   enemyShots: Shots;
   enemies: Enemies;
   gamepad: GamePad;
   collisions: Collisions;
   events: Events;
   gameSpeed: GameSpeed;
   points: Points;
   gameOver: GameOver;
   yaml: Yaml;

   /**
    * Step 1 of initialization
    */
   constructor() {
      /**
       * Constuct services
       */
      this.input = new Input({ app: this, name: "input" });
      this.gameLoop = new GameLoop(this);
      this.player = new Player(this); // TODO: player should also have name
      this.playerShots = new Shots(
         this,
         // TODO: actually dont need name, could use uuid().
         { name: "playerShots", maxShots: 3*3, color: "aqua", poolIndex: 0 }
      );
      this.enemyShots = new Shots(
         this,
         { name: "enemyShots", maxShots: 25, color: "red", poolIndex: 1 }
      );
      this.enemies = new Enemies(this, { name: "enemies" });
      this.gamepad = new GamePad();
      this.collisions = new Collisions(this);
      this.events = new Events({ app: this, name: "events" });
      this.gameSpeed = new GameSpeed({ app: this, name: "gameSpeed" });
      this.points = new Points({ app: this, name: "points" });
      this.gameOver = new GameOver({ app: this, name: "gameOver" });
      this.yaml = new Yaml({ app: this, name: "yaml" });
   }

   /**
    * Step 2 of initialization
    */
   Init = async () => {
      /**
       * Order of initialization usually don't matter.
       * Unfortunately Yaml has to init early since it needs to, right now, fetch
       * yaml async. Enemies needs to be available at least when Enemies service tries to use them.
       */
      await this.yaml.Init();
      this.input.Init();
      this.player.Init();
      this.playerShots.Init();
      this.enemyShots.Init();
      this.enemies.Init();
      this.collisions.Init();
      this.points.Init();
      this.gameOver.Init();
   };
}