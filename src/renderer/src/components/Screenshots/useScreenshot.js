import { useState } from 'react'

export default function useScreenshot() {
  const [img, setImg] = useState('')
  const [urlReached, setUrlReached] = useState(false)
  const ss = async () => {
    await window.screenshot.captureScreenShot()
    window.screenshot.screenShotCaptured((event, dataURL) => {
      console.log(dataURL)
      setImg(dataURL)
      setUrlReached(true)
    })
  }

  return {
    img,
    urlReached,
    ss
  }
}
