const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
//Electron dev tools  
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

//Utils
const path = require('path')
const url = require('url')

//Api
const {socket} = require('./src/socket/socket')

//Http Api
const httpApi = require('./src/httpApi')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//Connect api to socket and redux  
//const api = socket()
//api.connect()

const api = httpApi('http://localhost:',9092)

ipcMain.on('api', (event,arg) => {   
    api.request(arg.payload.path, arg.payload.data)
        .then(res => {
            if(res.returncode !== 'fail')
                event.sender.send('api-reply', {type: arg.type+'_SUCCESS', payload: res})
            else 
                event.sender.send('api-reply', {type: arg.type+'_FAILD', payload: res})
        })
        .catch(err => event.sender.send('api-reply', {type: arg.type+'_FAILD', payload: err}))
})


setInterval(()=>{
    api.request('/control/runstate/')
        .then(res => {
            if(res.returncode !== 'fail')
                mainWindow.webContents.send('api-reply', {type: 'RUNSTATE_SUCCESS', payload: res})
            else 
                mainWindow.webContents.send('api-reply', {type: 'RUNSTATE_FAILD', payload: res})
        })
        .catch(err => mainWindow.webContents.send('api-reply', {type: 'RUNSTATE_FAILD', payload: err}))        
}, 4000)


function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webSecurity: false
        }
    })
    mainWindow.setMenu(null);

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, './build/index.html'),
            protocol: 'file:',
            slashes: true
        })
    mainWindow.loadURL(startUrl)

    //Init devtools
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
