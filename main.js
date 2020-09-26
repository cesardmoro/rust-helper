// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, Menu} = require('electron')
const shortcuts = require('./shortcuts.js')
const path = require('path')
const { ipcMain } = require('electron')
const { clipboard } = require('electron')

const Store = require('electron-store');
const store = new Store();


require('electron-reload')(__dirname);


function createWindow () {


  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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
  mainWindow.setMenu(null);

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
