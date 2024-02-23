import useScreenshot from './useScreenshot'
const Screenshot = () => {
  const { img, urlReached, ss } = useScreenshot()
  return (
    <div>
      {urlReached ? <p>Data url has reached</p> : <p>No data url is reached</p>}
      <button onClick={ss}>Take ss</button>
      <img src={img} alt="dddd" width={550} height={550} />
    </div>
  )
}

export default Screenshot
