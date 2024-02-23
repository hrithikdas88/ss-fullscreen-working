import React from 'react';
import useProjectList from './useProjectList';
import './ProjectList.css'



const ProjectList = () => {
  const {
    startTimer,
    stopTimer,
    timers,
    timerIsOn,
    img,
    urlReached,
    formatTime,
  } = useProjectList();

  const projects = [
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    { id: 3, name: 'Project C' },
  ];

  return (
    <div className="project-list-container">
      <h1>Project List</h1>
      <div className="projects">
        {projects.map((project) => (
          <div className="project" key={project.id}>
            <h3>{project.name}</h3>
            <div className="timer">
              {timers[project.id] ? formatTime(timers[project.id]) : '00:00'}
            </div>
            <button
              className="action-button start"
              onClick={() => startTimer(project.id)}
              disabled={timerIsOn}
            >
              Start
            </button>
            <button
              className="action-button stop"
              onClick={stopTimer}
              disabled={!timerIsOn}
            >
              Stop
            </button>
          </div>
        ))}
      </div>
      <div className="screenshot">
        {urlReached && (
          <>
            <div>
              <img src={img} alt="Screenshot" />
            </div>
            <strong>Total Time:</strong>{' '}
            {Object.values(timers).reduce((total, time) => total + time, 0)}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
