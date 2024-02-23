import { contextBridge, ipcRenderer, powerMonitor } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('screenshot', {
      captureScreenShot: () => ipcRenderer.send('capture-screenshot'),
      screenShotCaptured: (callback) => {
        ipcRenderer.on('screenshot-captured', (event, screenshotURL) =>
          callback(event, screenshotURL)
        )
      }
    })
    contextBridge.exposeInMainWorld('power', powerMonitor.getSystemIdleTime())
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
