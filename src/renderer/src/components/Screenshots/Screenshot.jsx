import useScreenshot from './useScreenshot'
const Screenshot = () => {
  const { img, urlReached, ss } = useScreenshot()
  const Projects = ["Wac pro", "Logos", "FPA"]

  return (
    <div>
      {urlReached ? <p>Data url has reached</p> : <p>No data url is reached</p>}
      <button onClick={ss}>Take ss</button>
      {Projects.map((project, i) => (
        <p key={i}>{project}</p>
      ))}
      <img src={img} alt="dddd" width={550} height={550} />
    </div>
  )
}

export default Screenshot
