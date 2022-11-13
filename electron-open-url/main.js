const { app, BrowserWindow, shell, Notification } = require('electron')
const path = require('path')

const createWindow = () => {
  
  const mainWindow = new BrowserWindow();

  mainWindow.loadURL('http://localhost:8080/index.html')
  mainWindow.maximize();

function openFile(filePath){
  shell.openPath(filePath);
}
  
function shouldAutoOpen(fileName){
  // I will write some real logic here. This check is dumb and for illustration purpose of this demo
  return (fileName.startsWith("sample"));
}

function showNotification(fileName){
  const options = {
    title: `Downloaded File: ${fileName}`,
    subtitle: 'Open file',
    body: `Click here to open : ${fileName}`,
    silent: false,
    hasReply: true,  
    timeoutType: 'never', 
    replyPlaceholder: 'Reply Here',
    urgency: 'critical',
    closeButtonText: 'Close'
}
const customNotification = new Notification(options);

customNotification.addListener('click', () => {
  console.log('Notification is Clicked');
  openFile(path.join(app.getPath("temp"),fileName));
  customNotification.close();
});

customNotification.show();
}

mainWindow.webContents.session.on('will-download', (event, item, webContents) => {        
    
    console.log(item.getMimeType()); // I will check mime type
    console.log(item.getURL()); // I will check if URL is safe
    
    // once all the checks have passed, start processing
    console.debug(path.join(app.getPath("temp"),item.getFilename()));
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
        if(shouldAutoOpen(item.getFilename())){
          // Open the document using the external application by delegating to the shell
         openFile(item.getSavePath());
        } else {
          showNotification(item.getFilename());
        }
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
