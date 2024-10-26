* Move out as much as possible from ActionExecutor by generalizing both "move" and "move_bezier".
Both functions that the original state first and saves it, then measures progess then sends the
original state and the progress to Enemy (that iself executes the stuff).

* Maybe I could have ADVANCED and SIMPLE actions, where ADVANCED actions are transformed into
SIMPLE actions. SIMPLE actions are executed by the game engine and the ADVANCED actions are "utils".
If I had simple actions such as NOOP which would just wait a frame, then I think it would be
easier to do some kind of RUN AHEAD functionality.

* Maybe have a ActionPreprocessor that simplifies actions, for example expands repeat actions, or
turns all rotate around point actions into individual set_position actions, or turns all absolute
moves into relative moves (dunno, can maybe simplify things, maybe.)

* I could do it as css and have position: relative/absolute with relative as default,
that would make relative/absolute positioning actions more coherent.

* Have private constructors, and use a Construct method instead that can be async.

* Rename Enemy to GameObject, and Enemies to GameObjectManager.

* Make simple Type Guards for integers. booleans, strings and place them in some util folder.

* Add events (subs and dispatches) declaration to IService to require services to specificy what
they subscribe to and what they dispatch. Throw runtime error when it tried to do something it has
not declared!!
Nah, it might be better to have every event in it's own service (i.e. event channel).

* I should probably not send in `app`, but rather `deps: IService[]` into services.

* When an emepy has spawned it should probably execute it's EnemyExecutor (generators) once,
otherwise, if the enemy has setup actions, then it might exist for one frame in an uninitialized
state.

* Have action that waits until an attribute has a certain value.
It could also be done like this, if `return` would exit/finished/complete the current generator.
 { parallelRace: [[
   { forever: [
      { attr: x, is: 1, yes: [{ type: return }] },
      wait: 1
   ] },
]] }
in order for that to work though I'd have to reprogram GeneratorUtils.Repeat to only create ONE
generator (now it creates several thus only one would be killed)!

* Use my utils createShade and createText throughout the UI Scenes code.

* This is an abuse ` this.app.gameLoop.FrameCount` could most likely use the `frameNr` in the
`frame_tick` event instead, that way depenencies on `gameLoop` can be removed in some places.

* Confirm that reset.css is imported on PROD build cuz suspicious import path.

* Dont dispatch zero point events.

* TODO: Set correct button for laser on GamePad !!!

* Try/verify if Player can have more than 1 hp, which should be able to have.

* I want to play a demo of the game in the background of the menu, but that's gonna take work
to make it happen since I do not at all support any of that as of now.

* KeyDowns should trigger KeyDown events that UI can listen to, because that would be an easier and
more sensible way for several UI components to listen to Input.

* The Init funcs of services should prolly be all awaited with Promise.All for spd improvement.

* I could make it work with touch devices but having the ship move in max speed towards the cursor.
It would help if I could get the game to play in full fullscreen which PWA might help with??

* Overflowing GameHiders cause problem on mobile/touch devices, you can still scroll!!

* When something in UI is selected there should be a soft color animation that loops
on the selected thing.

* Implement a frame-speed-schedule, so I can rerun specific parts of the game very fast,
for example I might be interested in what happens in the frames 1000 to 1500.

* ~~Sometimes the onDeathAction explosion did not trigger, examine why and fix.~~
Solved with Date.Now().

* A "disableAutomaticOutsideOfScreenBehaviour" setting on enemies in case you dont want it.

* Explain or show better how to enter highscore name.

* Rename GameSpeed service to GameLoopControlUI or something like that.

* Some/many of the setting in Settings scene should be moved to a non-game-UI debug menu
(currently called GameSpeed service), this debug menu should be toggled with a DebugMenu setting
from the Settings scene.

* I should probably move GameSpeed stuff into a GameLoop variant (some stuff should not be moved
into a GameLoop though), since I would like to do a lot of stuff so maybe the extra coupling can
help, for example I would like to fast-forward to specific frames as soon as the game starts to
speed up development/debugging/testing of levels etc.

* all the names should actually not need to be input via contructor to a Service but can be a 
public/private field on respective service.

* Move Fps stats into GameSpeed service, then remove Fps stats service.

* I should have warning come up if trying to sub when already subbed.
I should have warning come up if trying to unsub when not subbed.

* Last finishing touches:
1. Hide the bullets on the left side of the game window.

---

**Make Enemy multi-threaded**

It might be good to make Enemy class multi-threaded, since it seems like that class is what takes
most time to run.

A thread would run a number of enemies, say if I had 3 threads one way would be to have
enemy1 on thread1, enemy2 on thread2, enemy3 on thread3, enemy4 on thread1, enemy2 on thread2 etc.
Or perhaps I need some count, the thread that has least enemies gets a newly spawned enemy.

It might be tricky to make it multi-threaded, but I can make it easier by preparing the code and
putting it into a state that will make it easier to make it multi-threaded.

Enemy communicates with `Graphics` service and also with `Enemies` service and `GameData`
(to get EnemyJson:s) (but communication with `GameData` could maybe be made indirect somehow),
prolly some more.

In order to make it multi-threaded I would have to run the `Enemy.OnFrameTick` function in a
WebWorker. Everything that `Enemy.OnFrameTick` want to do/affect, outside of itself,
it has to accumulate and send a message with all that stuff in the end to the main thread that will
execute all those things.

It is also important that the order is intact/consistent. So I would have to run every
Enemy WebWorker first and the when they are ALL done then execute what they wanted to do in the
same order as the enemies come in the enemies array.

When a new enemy needs to spawn, the WebWorker has to sendMessage with spawn type, the from outside
of the WebWorke there will be send in an EnemyJson into the WebWorker.

Input from `Input` and `GamePad` has to be sent in to the WebWorker before/on next frame when the
WebWorker starts it's stuff.

If collisions could be calculated before `Enemies` then they could also be sent in as input to the
WebWorker. Maybe I need to add a priority when subscribing to frame_tick so I have control over
order of execution.

The input to the WebWorker could be stored on a private class object IputToWebWorker or something.

One problem is how to handle the "player" as the player is somewhat magical and it has to be reached
by all WebWorkers.

---

* I temporary removed the DisplayControls scene, I should probably bring it back somehow.

* StartGame scene should change name to StartMenu.

* It would be nice to have a better logger so you could do `log = new Log().WithPrefix("GameData")`
to prefix all logs in for example the GameData service.

* I should probably remove `collisionType` and change it's name to only `type` I think that's a more
fitting name since otherwise I might end up using `collisionType` for things that are not even
collision related. At some point I might want to filter by type for example too.

* It would be better if the Scene:s where created anew with `new` on Scene swapping, maybe, because
then some vars would reset automatically. I had a problem with one var not having been reset in
destroy.

* Stage2 could be a pacifist run. You have a weapon, but every enemy you shoot explodes. There can
be different colors that explode in different directions. For example blue 4 in cardinal directions,
blue in diagonal and red in all 8.
I can record Neo XYX pacifist pattern and then just do something similar, by making sure that
enemies will not "cross" that path.

* Make E2eTester able to record per game as well, and ReplayerInput able to do so too.

* Update Controls scene to explain that keys vary by game but in general:
Weapons - W, A, S, D keys
Movement - Arrow keys

* rename the magical enemy `shot` to `defaultShot` because that is more explicit.

* I prolly should have an action to configure which shot is used when using the shooting actions,
for example one GameObject migh want to use the default `shot` but another one might want to use
another one.

* Experiment with GraphicsElement.commit and Graphics.commit to see if that make any difference
performance-wise. with cssText probably. I am probably gonna need a commit if I am going to do
something with canvas.

* Maybe I should have a GfxElementRenderer class that takes the data from the GfxElement and throws,
it also would need the context. That way I could maybe create several renderers or something.
I could have the "normal" renderer, but also a cached-OffscreenCanvas-renderer that keeps a cache
with keyed by stringified this.vars for all GameObjects.

* Invincibility should be set via attribute, that way an Enemy can manage it's own invincibility
frames if I also make a onHit callback action that can toggle invincibility on/off.

* In the future I would probably want more specific actions to end the game for example end it
in a success way but now I only have one type of "end of game" and that is Game Over.

* The shooting actions should prolly have to specify which shot to use instead of using the default
shot, since the default shot is a bit "magical".

* The way I imagine it to work is that users upload a
js-file to a backend, then the backend runs that js file to generate a json, then the frontend loads
that json (that is a level). So at no point does the frontend need zip or yaml.

* have internal state that keeps track of background scroll so that code does not have to grab from
DOM all the time (might be slow?).

* I have this code:
```
public OnFrameTick = () => {
   /* ... */
   this.gfx?.setRotation({ degrees: this.moveDirection.toVector().angle.degrees });
};
```
However this sucks. I don't want to tie grapical rotation to movement direction!!
One way to solve this would be to have a new action called `setGfxRotationFromMoveDirection` or
something like that or a `copyAttribute({ from: "movementDirection", to: "gfxRotation" })` action.

* I can actually control immediate children from a parent, i.e. children-parent relations.
I can do that via injecting actions into the child which (as currently coded) will run in a "fork"
and can execute forever so I could check make it (the child) do something based upon some 
attribute in the parent.
SO ACTUALLY, what I have a a relation from parent-to-child but NOT in the opposite direction?
No, I am hallucinating, the attributes that can be read in the actions on the child are only the
attributes on the child :/
Although if I dabble with "global attributes" I could "inject" the name of the parent into the child
or something like that.

* I could make enemies more "generic", perhaps, via injecting more of their
"special/specific/differing/alternative" behaviour. For example I could inject a "onHit" action
that would be executed when the enemy is hit.

* I should have a log action really so I can log before and after an enemy's action.

* I have to code to despawn stuff that gets out of screen, but that's hardcoded which sucks.
I need to have that be more dynamic. An example would be the player's bullets, they should be
despawned IMMEDIATELY when they get out of screen, but as it is now they despawn when they are
30 pixels outside of screen which makes it so that enemies can get hit by bullets that are not
visible on screen.

* I really need, in actions, to have it that argumets that are values also could be taken from
attributes. For example I might want to have a "moveDelta" action that takes a "x" argument, but
I might want to have that x be taken from an attribute instead of being hardcoded.

Maybe I should have attributes be specific types rather than have them allowed to be any type.
So like setAttribute({ type: "string", name: "x", value: "1" })
or setStringAttribute({ name: "x' value: "1" })
and getStringAttribute("x").

On first step to improve the attributes could be to create a new AttributeService class that holds
all attributes for all GameObjects. The data structure would be something like this:
```
{
   player-1: {
      floats: {
         "x": 1,
         "y": 2,
      },
      strings: {
         "weapon": "laser"
      }
   },
   "enemy-1": {
      /* ... */
   }
}
```
Power ups would just be something that when it collides with an enemy then it would set an attribute
(global or the player). However I don't have any onCollide callback yet.

* I could make it so that one can change the direction of the player's shooting, I would need more
buttons though.

* All positions should be standardized in action to `pos` and there should be a type `TPos`,
  and a `TPosDim` that is like `TString` in that they can either take a
  `{ x?: TPosDim, y?: TPosDim }` and `TPosDim` is
  `TNumber | { position: "relative" | "absolute", value: TNumber }`, although that looks a bit
  complicated so I dunno.

* Maybe every GameObject should auto-get a `type` attribute which is the `name`
  (inconsistent naming) set when creating a GameObject (IEnemyJSON) when creating a game/level.

* When I have most of the stuff in Attributes, I should use Attributes in e2e test instead:
  For every frame I would save a delta.

* What cool shit could I do with actions now?
     It would be cool if it was possible to give the player several lifes, like
     decrementing a counter and then fully die when it reaches zero.

   * Points could be entirely managed by enemies themselves (in onHit callback or something).

   * The intro screen could be a GameObject: It could render the Graphics and all.
     It could have timers. It could listen to space button.
     It could even be several images after each other.

   * I could have boss phases with something like this:
   ```
   [
      parallelRace(waitUntilAttrIs(flag, "phase2"), [some, actions]),
      parallelRace(waitUntilAttrIs(flag, "phase3"), [some, actions]),
   ]
   ```

* TODO: Now I have broken the player invincibility setting.

* I should make a tutorial series about how to create a (General Purpose) Game Engine. The tutorial
  series should be named "Creating A Pong Game Engine" where I should how to create a Game Engine
  supporting functionality that is needed to implement Pong (Graphics Engine that can draw text and
  rectangles, and Action Executor with GameObject with a few actions).

* I should do Snake, or a snake boss, or the player being a snake.

* The Graphics Engine should be able to render text. Maybe that could be separate from rendering
  images because it would not make sense that an image and a text would be the same
  (a GraphicsObject).

* Margin on WaitUntilOutsideScreen should probably be the diameter by default.

* There is a bug when you press UP + DOWN + RIGHT that you move faster then only RIGHT,
  this is because it does upRight + downRight at the same time.

* Add A fields to TGame that is named `bootstrapGameObject` that will replace the `spawner`.

* Bug. The reason why Parallax goes in the opposite direction is because the facing is down by
  default.

* How should I randomize values for say a position? I have a PseudoRandom service now, but how?

* I must be able to modify acceleration in order to do Asteroids.

* Make speed into an attribute.
   * remove setSpeed action since it will no longer be needed.
* Actually doing it like that is not correct... I need not to be able to set speed as a number,
but speed as a vector.

* Refactor this
`return assertNumber(this.attrs.getAttribute({ gameObjectId: this.id, attribute: "speed" }));`
in Enemy.ts. I should be able to be made shorter with a helper method, maybe.

* remove setMoveDirection as it is now an Attribute.

* I really need some kind of collisions layers and more dynamic/complex stuff around collisions like
onCollisions listeners and such.

* Rename BrowserDriver into EnvironmentDriver because Node and Deno are not browsers.
Might add some more stuff to it too, dunno.

* I'm running into performance problems. I need to move to "Off the Main Thread": Everything should
run in a separate thread, and it should communicate with the main thread to affect the DOM.
It can be really simple, just start everything in a new thread, and let say the graphics engine run
in the main thread (it already has commands which could be sent to main thread) or have some kind
of UiThread class or something with functions for manipulating DOM.

* Gather perf data in ReqAnimFrameGameLoop.ts. stats per frame. when reqamin started, ended, length,
number of executed frames and diff between excpected frames. store in some kind of object/array,
save as file then analyze it.

<!-- #region COLLISION_DETECTION -->

So how should the "new" collision detection system work?? Could it work if I had something like this
```
player.setAttribute("collisionType", player")
boss.setAttribute("collisionType", enemy")
enemyBullet.setAttribute("collisionType", "enemyBullet")
playerBullet.setAttribute("collisionType", "playerBullet")
speedUpgrade.setAttribute("collisionType", "speedUpgrade")

// First it removes all with collisionType === "none".

// Collision detection checks everything against everything else.
// Collision detection accumulate an object keyed by the first gameObjectId
// (it needs to run x**2 times. every one needs to be checked against every other).
Map([
   [gameObjectId, Set([ "enemyBullet", "speedUpgrade" ])],
])

player.waitUntilCollision({ collisionTypes: ["enemy","enemyBullet"], invincibilityFrames: 1 })
   -> decr("hp")
```

<!-- #endregion -->

* I must make e2e tests more robust by recording "state" per frame (probs attributes) instead of
events.

* If `collidedWithCollisionTypesThisFrame` are unique, then I could prolly change it to an object
  keyed by `collisionType` i.e. `Record<string, boolean>` or maybe a `Set`.

* 2024-09-27: I am in the process of updating collision detection. I have added ability to the
  engine to handle waiting until colliding with selected collision types. I need to update the stuff
  under GameData folder though so that the games start to work correctly again.

* 2024-09-28: Files containing errors only light up red when they are open. I want them to light
  up red in the VS Code Explorer (left pane file structure).

* 2024-09-29: New collision code seems to make it so that onDeath actions maybe trigger one frame
  too late. This is most visible with lasers as you can see the lasers explode above where they
  should explode/die.
  Oh I think know why this happens. It might happen because the onDeath action happens the next 
  frame because first hp is reduced to 0, but the code listening to the hp
  - 2024-09-29: Actually the explosion of the laser happened 2 frames later (2 framedss after
    collision) than before my recoding of the collision logic.
    I managed to make it from 2 frames delayed to 1 frame delayed now, but I should really try
    to make it so that the delay becomes zero.
  - 2024-09-30: Managed to solve THAT problem by running forks before the main line of actions,
    though I notice that the Graphics elements gets used up a lot faster for some reason...
    so there are still problems...
    Might just be "better" collision detecting or something... any way the lasers explode anim
    takes way too many frames.

* Idea: I should have all the state managed by redux maybe, so I have ALL the data easily available
  and the great Redux DevTools to to see deltas. Maybe look into Zustand.

* ~~Remove the Do action because it's not needed?~~

* Find ways to utilize `Bun` macros:
  - simple conversions
    - like degrees to radians or creations of Vectors n such maybe. 

* I seem to maybe have an assumption in the code that the last actions always is despawn. Maybe this
  could create a problem in some weird situation when it is not the last action.

* Use eslint flat config format of config file.

* use "plugin:@typescript-eslint/strict-type-checked" instead of
  "plugin:@typescript-eslint/recommended-type-checked".

* ~~Upgrading to eslint version 9 seems like hell.~~

* Since I have recoded so much shit, i.e. collision logic at the latest, remove/change all
  references to points and points events.

* BEFORE RELEASING 0.7.0
  - fix points somehow.
    - How should points work?
      - Score could be a global attribute though the UI needs to update somehow.
  - fix highscores: I don't think they are enabled for Asteroids and Snake.
  
* Upgrade to use deno version when possible. would be too much of an effort today.

* ~~Separate collision diameter nad gfx diameter~~ Done, I think.

* Why did I decide to have enums for the action types? I don't get good code completion that way.
  Maybe I needed them for something but maybe then typescript improved so that I don't need them?
  Maybe I should change to either constants or raw strings.

* This action:
{
    type: AT.move,
    x: { min: -2000, max: 2000 },
    y: { min: -2000, max: 2000 },
    frames: 10000,
}
could probably be written as:
fork(
  {
    type: AT.repeat,
    times: 100_000_000,
    actions: [
      { type: AT.moveDelta, x, y },
      { type: AT.waitNextFrame },
    ]
  }
)
though that is more code so I dunno.
or perhaps
perFrame( actions: [{ type: AT.moveDelta, x, y }], stopWhenAttributeIsTrue: "someBooleanAttribute" )
It would actually be nice if the "core" engine had as few actions as possible and then I could
create my own actions on top of that, so that might be something I should experiment with trying
to replace each composite actions with more primitive actions.
