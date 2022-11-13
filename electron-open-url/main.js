const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  mainWindow.loadURL('http://localhost:8080/index.html')


mainWindow.webContents.session.on('will-download', (event, item, webContents) => {        
    
    console.log(item.getMimeType()); // I will check mime type
    console.log(item.getURL()); // I will check if URL is safe
    
    // once all the checks have passed, start processing
    console.log(path.join(app.getPath("temp"),item.getFilename()));
    item.setSavePath(path.join(app.getPath("temp"),item.getFilename()));

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        // Open the document using the external application by delegating to the shell
        shell.openPath(item.getSavePath());
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
});
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
