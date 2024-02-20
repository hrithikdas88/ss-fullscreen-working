import { app, shell, BrowserWindow, ipcMain, desktopCapturer, screen, dialog } from 'electron'
import { join } from 'path'
const fs = require('fs')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('capture-screenshot', async (event) => {
  const screenShotInfo = await captureScreen()

  console.log(screenShotInfo, 'ssinfo')
  const dataURL = screenShotInfo.toDataURL()
  event.sender.send('screenshot-captured', dataURL)
})

async function captureScreen() {
  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay()
  console.log(primaryDisplay, 'primary')

  // Get its size
  const { width, height } = primaryDisplay.size

  // Set up the options for the desktopCapturer
  const options = {
    types: ['screen'],
    thumbnailSize: { width: primaryDisplay.size.width, height: primaryDisplay.size.height },
    screen: {
      id: primaryDisplay.id
    }
  }

  // Get the sources
  const sources = await desktopCapturer.getSources(options)

  // console.log(sources, "sources")

  // Find the primary display's source
  // const primarySource = sources.find(({ display_id }) => display_id == primaryDisplay.id)

  // Get the image
  // console.log(primarySource)
  const image = sources[0].thumbnail
  // console.log(image, "imgs")

  // Return image data
  return image
}
