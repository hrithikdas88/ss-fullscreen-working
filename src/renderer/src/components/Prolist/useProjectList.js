import { useState, useEffect } from 'react';

const useProjectList = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timers, setTimers] = useState({});
  const [timerIsOn, setTimerIsOn] = useState(false);
  const [img, setImg] = useState('');
  const [urlReached, setUrlReached] = useState(false);

  const startTimer = (projectId) => {
    stopTimer();
    setTimerIsOn(true);
    const timerId = setInterval(() => {
      setTimers((prevTimers) => ({
        ...prevTimers,
        [projectId]: (prevTimers[projectId] || 0) + 1
      }));
    }, 1000);

    setActiveTimer(timerId);
  };

  const stopTimer = () => {
    if (activeTimer) {
      setTimerIsOn(false);
      clearInterval(activeTimer);
      setActiveTimer(null);
    }
  };

  const captureScreenshot = async () => {
    await window.screenshot.captureScreenShot();
    window.screenshot.screenShotCaptured((event, dataURL) => {
      setImg(dataURL);
      setUrlReached(true);
    });
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [activeTimer]);

  useEffect(() => {
    let intervalId;

    if (timerIsOn) {
      intervalId = setInterval(captureScreenshot, 10000);
    }

    return () => clearInterval(intervalId);
  }, [timerIsOn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    startTimer,
    stopTimer,
    timers,
    timerIsOn,
    img,
    urlReached,
    formatTime
  };
};

export default useProjectList;
