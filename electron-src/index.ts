// Native
import { join } from "path";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";

import { createServer } from "http";
import { parse } from "url";
import next from "next";

const nextApp = next({ dev: isDev, dir: app.getAppPath() + "/renderer" });
const handle = nextApp.getRequestHandler();

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await nextApp.prepare();

  createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log("> Ready on http://localhost:3000/home");
  });

  const mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    width: 985,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      webSecurity: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:3000/home");
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});