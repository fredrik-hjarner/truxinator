import { App } from "./App/App.ts";
import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

BrowserDriver.OnLoad(async () => {

   // This is just a test. I'm wondering if I could utilize the Redux DevTools Extension.
   /* eslint-disable */
   // BrowserDriver.WithWindow((window) => {
   //    if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
   //       const config= {};
   //       const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(config);
         
   //       devTools.init({ value: "initial state" });
   //       devTools.send("change state", { value: "state changed" });
   //       devTools.send("change state", { value: "state changedzz" });
   //    }
   // });
   /* eslint-enable */

   // Create app
   const app = new App();
   await app.Init();

   // Start
   // console.log("Start");
   if(!IsBrowser()) {
      // If not running in a browser it means it runs headless in either node or deno
      // which means that we are running e2e tests which is why we start the game loop immediately.
      app.gameLoop.Start();
   }
});
