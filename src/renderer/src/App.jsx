import Screenshot from "./components/Screenshots/Screenshot"

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
   console.log(window)
  return (
    <>
      <Screenshot />
    </>
  )
}

export default App
