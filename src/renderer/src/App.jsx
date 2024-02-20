import Screenshot from "./components/Screenshots/Screenshot"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Screenshot />
    </>
  )
}

export default App
