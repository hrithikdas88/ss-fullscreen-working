import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  console.log(window)
  const ss = async () => {
    await window.screenshot.captureScreenShot()
    window.screenshot.screenShotCaptured((event, dataURL) => {
     console.log(dataURL)
    })
  }

  return (
    <>
      <button onClick={ss}>Take ss</button>
    </>
  )
}

export default App
