// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, Menu} = require('electron')
const shortcuts = require('./shortcuts.js')
const path = require('path')
const { ipcMain } = require('electron')
const { clipboard } = require('electron')
const ioHook = require('iohook');
const robot = require("robotjs"); 
const Store = require('electron-store');
const store = new Store();
/* recoil */
const sprayPattern = [{x: 0, y: 0}, {x: -14, y: -25}, {x: -4, y: -24}, {x: -29, y: -17}, {x: -20, y: -25},
  {x: 8, y: -13}, {x: 5, y: -14}, {x: 14, y: -3}, {x: 21, y: -13}, {x: 24, y: -11},
  {x: 14, y: -6}, {x: 21, y: 2}, {x: 7, y: -23}, {x: 16, y: -6}, {x: 3, y: -16},
  {x: -2, y: -25}, {x: -28, y: -16}, {x: -11, y: -12}, {x: -20, y: -28}, {x: -26, y: -2},
  {x: -23, y: -12}, {x: -20, y: -6}, {x: -17, y: -2}, {x: -12, y: -10}, {x: -10, y: -10},
  {x: 5, y: -23}, {x: 22, y: 3}, {x: 17, y: -29}, {x: 40, y: -16}, {x: 20, y: -17}];
  var markers = [];
  var mousemarkers = [];
  var activateMacro = false;    
  let tickInterval = 0;
  var mouseX = 0;
  var mouseY = 0;
  
  var startingX = 0;
  var startingY = 0; 
  
  var speedMultiplier = 1;
  var globalTickInterval = 0;
  var globalShotCount = 0;
  
   
  var puck = {x: startingX, y: startingY, radius:15};
  function startPlaying() {
    var mouse = robot.getMousePos();
      startingX = mouse.x;
      startingY = mouse.y;
      isPlaying = true; 
      globalTickInterval = 0;
      globalShotCount = 0;
      puck.x = 0;
      puck.y = 0;
      markers = [];
      mousemarkers = []; 
      
      tickInterval = setInterval(function(){
        tick(); 
      }, 130/10 * speedMultiplier); 
  }
  function stopPlaying() {
    if(tickInterval){
      isPlaying = false;
      clearInterval(tickInterval);
    }
  }
  function tick() {
    console.log("tick: "+globalTickInterval);
    
        
    
    if(globalShotCount == 29) {
      stopPlaying();
      return;
    }
    var nextX = startingX;
    var nextY = startingY;
    if(globalTickInterval > 0) {
      nextX = markers[globalTickInterval-1].x;
      nextY = markers[globalTickInterval-1].y;
    }
    var nextShotCoords = sprayPattern[globalShotCount+1];
    nextX += nextShotCoords.x / 10;
    nextY -= nextShotCoords.y / 10;
    markers[globalTickInterval] = {x: nextX, y: nextY};
    mousemarkers[globalTickInterval] = {x: mouseX, y: mouseY};
    puck.x = nextX;
    puck.y = nextY;
    globalTickInterval++;
    if(globalTickInterval % 10 == 0) {
      globalShotCount++;
    }
    robot.setMouseDelay(0); 
    robot.moveMouse(nextX, nextY);
  }

require('electron-reload')(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});

function createWindow () { 
 


  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800, 
    height: 600, 
    useContentSize: true,
    transparent: false,
    frame: true,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html') 

  //disable menu
  //mainWindow.setMenu(null);

  // get the native HWND handle
  const handle = mainWindow.getNativeWindowHandle();



  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', () => {
  //Register global shortcuts 
  shortcuts.registerShortcuts();
  var click = false;


 
  
  
  
  // Register and start hook
  ioHook.start();
  
  // Alternatively, pass true to start in DEBUG mode.
  ioHook.start(true);
  ioHook.on('mousedown', event => {
      if(activateMacro) startPlaying();
  }); 
  ioHook.on('mouseup', event => {
    console.log(event); // { type: 'mousemove', x: 700, y: 400 }
    stopPlaying();
  }); 

  globalShortcut.register('F3', () => {
      activateMacro = !activateMacro;  
    });

  ipcMain.on('codelock', (event, arg) => {
    store.set('codelock', arg);
    event.returnValue = "info"
  });
  ipcMain.on('copiar', (event, arg) => {
    clipboard.writeText(arg, 'selección');
  });



})

app.on('will-quit', () => {
  // Desregistra un atajo.
  globalShortcut.unregister('CommandOrControl+X')

  // Desregistra todos los atajos.
  globalShortcut.unregisterAll()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
