const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const {app, BrowserWindow} = require('electron')
const { dialog } = require('electron')
const {ipcMain} = require('electron')
const sha1File = require('sha1-file')
const fs = require('fs')
const path = require('path');
const url = require('url')
const { discoveyService } = require('./repo_mdns');
const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {webSecurity: false}
  })

  //Hide menu bar
  mainWindow.setMenu(null)

  // and load the index.html of the app.
  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl)

  // Open the DevTools.
  isDev
    ? mainWindow.webContents.openDevTools()
    : false


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
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


/////--------//////
// File handler //
ipcMain.on('getFiles', (event, {cb})=>{
  event.sender.send(cb, {
    result: dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
  })
})

const config = {
  shareFolder: '/home/okupa/.reposhare-2/LOC06_1d384e738b5ebac844d39a87725d93c8/Downloads/'
}

const shareFiles = (filePath, destination) => new Promise((res, rej)=>{
  sha1File(filePath, function (error, sum) {
      let fileName = path.basename(filePath)
      let newPath = path.join(destination,fileName)
      fs.symlink(filePath, newPath, 'file', console.log);
      res({ 
        fileName: fileName,
        size: fs.statSync(filePath).size,
        hash: sum || error,
        error: error? true: false
      })
  })
})

ipcMain.on('shareFiles',(event,{files, destination, cb})=>{
  if(files.length > 0) {
    Promise.all(files.map(file => shareFiles(file, destination))).then(filesInfo =>
      event.sender.send(cb, {
        files: filesInfo
      })
    )
  }
  else
    event.sender.send(cb, {error: 'Files list is undefined'})
})

ipcMain.on('discovery-start',(event,{ user, key })=>{
  discoveyService.onUser = (data) => {
    event.sender.send('discovery-result', data)
  }
  discoveyService.serviceStart({user, key})
})
