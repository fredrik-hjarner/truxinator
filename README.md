![example workflow](https://github.com/fredrik-hjarner/schmupinator/actions/workflows/e2e.yml/badge.svg)
![example workflow](https://github.com/fredrik-hjarner/schmupinator/actions/workflows/e2e-deno.yml/badge.svg)
![example workflow](https://github.com/fredrik-hjarner/schmupinator/actions/workflows/eslint.yml/badge.svg)
![example workflow](https://github.com/fredrik-hjarner/schmupinator/actions/workflows/build.yml/badge.svg)

![Schmupinator](https://raw.githubusercontent.com/fredrik-hjarner/schmupinator/vite-master-safe-always-working-not-broken/githubAssets/schmupinator.gif)

**Work in progress! Code will most likely not stabilize before ~~2023~~ ~~2024~~ 2025, if I even get it to a stable state at all.**

> The ambition is to make a shoot 'em up maker with the ability for users to create their own shoot 'em up stages.

You can try version 0.7.1 here: https://fredrik-hjarner.github.io/schmupinator/

~~You can try version 0.6.0 here: https://fredrik-hjarner.github.io/schmupinator-0.6.0/~~

~~You can try version 0.5.0 here: https://fredrik-hjarner.github.io/schmupinator-0.5.0/~~

## Teasers

| | | |
|-|-|-|
|![title](https://raw.githubusercontent.com/fredrik-hjarner/schmupinator/vite-master-safe-always-working-not-broken/githubAssets/title_screen.png) | ![Schmupinator](https://raw.githubusercontent.com/fredrik-hjarner/schmupinator/vite-master-safe-always-working-not-broken/githubAssets/game.png) | ![Schmupinator](https://raw.githubusercontent.com/fredrik-hjarner/schmupinator/vite-master-safe-always-working-not-broken/githubAssets/highscore.png)|

## Current state

* You can play 4 simple games
  * vertical shmup
  * horizontal shmup
  * asteroids
  * snake
* Highscore, separate for each level, that saves in localStorage.
* You can theoretically build your own stages and enemies with JS/TS files, but really, you will need a tutorial or be pretty smart (~~200 IQ~~ 150 IQ) to figure out how to do it.

## Preliminary goals for the game/maker

1. Make it able to do everything that the game *Truxton* can do. *Truxton* is an old shoot 'em up game that is relatively primitive so is easy to *mimic*.
2. Make it *not too hard* to create enemies and stages. A good tutorial and documentation is needed.
3. A dream goal is to create a stage and enemy editor, but in order for that to be feasible the code must first have stabilized.
4. Server that stores highscores and custom stages.

## Preliminary goals for the code

* Robust code that never breaks.
  * Every file edit starts a test that runs a stage (with pre-recorded inputs) from start to finish to assert that behavior is exactly as expected.
* As few dependencies as possible. Fewer dependencies can increase the life span of a project since it will not rely on 1 000 dependences that ~~can~~ *will* break.
  * **The code currently has zero *runtime* dependencies.**
* No canvas or OpenGL. Every enemy, bullet, etc. is a div!

## How to clone, build and run *Schmupinator* locally?

1. Install the requirements if you don't have them.
   - Install `node` (usually lastest version, but use version 18 if you have problems).
   - Install `git` (**optional**).
2. Download repository.
   - Alt 1 - with git
     - Create a directory for *Schmupinator*. Open the created directory in a terminal.
     - Clone repository by running `git clone https://github.com/fredrik-hjarner/schmupinator.git .` in terminal.
   - Alt 2 - without git
     - If you dont want to use git, then download zip-file [here](https://github.com/fredrik-hjarner/schmupinator/archive/refs/heads/vite-master-safe-always-working-not-broken.zip). Extract and open terminal in the extracted directory.
3. Run `npm install` in terminal.
4. Run `npm run dev` in terminal.
   - This should open `http://localhost:3000/` in a web browser, if not then open it manually.

## License

Open source except assets.

## Credits

* **Fredrik Hjärner**: Game engine/maker, stage, enemies, "graphics" ~~and also all bugs~~.

## Acknowledgments and attributions

* [**SpicyGame**](https://spicygame.itch.io/sg-pixel-font-package): For creating the `Micro Pixel` font that is used extensively in *Schmupinator*.
* [**Will Tice**](https://untiedgames.itch.io/five-free-pixel-explosions): For creating free sample explosion animations.
* [**NYKNCK**](https://nyknck.itch.io/explosion): For creating free explosion animations.
