import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  screen,
  dialog,
  powerMonitor,
  globalShortcut,
  Notification
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// const localShortcut = require('electron-localshortcut')
// const inputEvent = require('input-event')
const robot = require('robotjs')

let mainWindow
let lastMousePos = robot.getMousePos()

console.log(robot, 'robot')

console.log(lastMousePos, 'lastmousepos')

//deep link logic

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('auth', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('auth')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}

//app logic
function createWindow() {
  mainWindow = new BrowserWindow({
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

  // test idle with robot js

  let idleTime = 0
  const IDLE_THRESHOLD = 60000
  let dialogShown = false

  const resetIdleTime = () => {
    idleTime = 0
  }

  setInterval(() => {
    const mousePos = robot.getMousePos()
    console.log(mousePos, 'mousepos')

    if (mousePos.x !== lastMousePos.x || mousePos.y !== lastMousePos.y) {
      resetIdleTime()
      if (dialogShown) {
        dialogShown = false
      }
    } else {
      idleTime += 1000

      if (idleTime >= IDLE_THRESHOLD) {
        const result = dialog.showMessageBoxSync({
          type: 'info',
          title: 'Idle Warning',
          message: 'You have been idle for a while.',
          buttons: ['OK', 'Cancel']
        })

        if (result === 0) {
          resetIdleTime()
          dialogShown = true
        }

        console.log('User is idle!')
      }
    }

    lastMousePos = mousePos
  }, 1000)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//ss-logic

ipcMain.on('capture-screenshot', async (event) => {
  const screenShotInfo = await captureScreen()

  const dataURL = screenShotInfo.toDataURL()
  event.sender.send('screenshot-captured', dataURL)
  new Notification({
    title: "ScreenShot taken",
    body: "Sucesss"
  }).show()
})

async function captureScreen() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const options = {
    types: ['screen'],
    thumbnailSize: { width: primaryDisplay.size.width, height: primaryDisplay.size.height },
    screen: {
      id: primaryDisplay.id
    }
  }

  const sources = await desktopCapturer.getSources(options)

  const image = sources[0].thumbnail
  return image
}
