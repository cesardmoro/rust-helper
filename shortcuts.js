const {app,mainwindow, BrowserWindow, globalShortcut} = require('electron')
const { clipboard } = require('electron')
const robot = require("robotjs");
const Store = require('electron-store');
const store = new Store();
const { dialog } = require('electron')


var antiAfk = false;
var spamConnect = false;
let errorMessage = "Ha ocurrido un error, recomendamos abrir la aplicación como administrador.";

function showShortcutError(){
    dialog.showErrorBox("error", errorMessage);
}
module.exports = { 
    registerShortcuts : function(){
        //Codelock
        globalShortcut.register('CommandOrControl+b', () => {
            try {
                robot.typeString(store.get('codelock')); 
            } catch (error) {
                showShortcutError();
            }
            
        });
        globalShortcut.register('CommandOrControl+l', () => {
            try {
                if(!antiAfk){
                    for (const window of BrowserWindow.getAllWindows()) {
                           if (window.webContents) {
                               window.webContents.send('antiafk', 'activado');
                           }
                         }
                    antiAfk = setInterval(function(){
                        robot.mouseClick("left");
                        robot.setKeyboardDelay(100)
                        robot.typeString("wasd");
                        robot.keyTap("space");
                        robot.keyTap("f1");
                        robot.typeString("respawn");
                        robot.keyTap("enter");
                        robot.keyTap("v", "control");
                        robot.keyTap("enter");
                        robot.keyTap("f1");
                        
                    }, 30000);
                }else{
                    for (const window of BrowserWindow.getAllWindows()) {
                           if (window.webContents) {
                               window.webContents.send('antiafk', 'desactivado');
                           }
                         }
                    clearInterval(antiAfk);
                    antiAfk = false;
                }
            } catch (error) {
                showShortcutError();
            }
        })
        globalShortcut.register('CommandOrControl+n', () => {
            var mouse = robot.getMousePos();
            robot.moveMouse(mouse.x, mouse.y-10);
        });
        globalShortcut.register('CommandOrControl+shift+p', () => {
            try {
                if(!spamConnect){
                    spamConnect = setInterval(function(){ 

                        robot.keyTap("up");
                        robot.keyTap("enter");
                        
                    }, 500);
                }else{
                    clearInterval(spamConnect);
                    spamConnect = false; 
                }
            } catch (error) {
                showShortcutError();
            }
        })
        globalShortcut.register('CommandOrControl+o', () => {
            try {
                robot.setKeyboardDelay(15);
                robot.keyTap("enter");
                clipboard.writeText("AFK ON TOP", 'selección');
                robot.keyTap("v", "control");
                robot.keyTap("enter");
            } catch (error) {
                showShortcutError();
            }


        });
        globalShortcut.register('CommandOrControl+k', () => {
            try {
                robot.setKeyboardDelay(15);
                robot.keyTap("enter");
                clipboard.writeText("Press f1 and write: quit grass false it removes the grass and gives you +30 fps", 'selección');
                robot.keyTap("v", "control");
                robot.keyTap("enter");
            } catch (error) {
                showShortcutError();
            } 

        });

       
        
    }
}

