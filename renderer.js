// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



const { ipcRenderer } = require('electron')
const Store = require('electron-store');
const store = new Store();

let codelock = store.get('codelock');
if(codelock) document.getElementById('codelock').value = codelock;
 
document.getElementById('save-codelock').onclick = e => {
    ipcRenderer.sendSync('codelock', document.getElementById('codelock').value);
}; 
function copiar($text){
    ipcRenderer.sendSync('copiar', $text);
}

ipcRenderer.on('antiafk', (event, data) => {
       document.getElementById('antiafk').innerText = data;
       document.getElementById('antiafk').setAttribute('class', data);

});


var shell = require('electron').shell;
    //open links externally by default
    $(document).on('click', 'a.external', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });