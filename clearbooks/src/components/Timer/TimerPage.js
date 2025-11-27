import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import timerService from '../../services/TimerService';

const TimerPage = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [runningTimer, setRunningTimer] = useState(null);
  const [description, setDescription] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTimeEntries();
    loadTotalTime();
    checkRunningTimer();
  }, []);

  useEffect(() => {
    let interval;
    if (runningTimer) {
      interval = setInterval(() => {
        const start = new Date(runningTimer.startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        setCurrentTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningTimer]);

  const loadTimeEntries = async () => {
    try {
      const response = await timerService.getAllTimeEntries();
      setTimeEntries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading time entries:', error);
      setLoading(false);
    }
  };

  const loadTotalTime = async () => {
    try {
      const response = await timerService.getTotalTime();
      setTotalHours(response.data.totalHours);
    } catch (error) {
      console.error('Error loading total time:', error);
    }
  };

  const checkRunningTimer = async () => {
    try {
      const response = await timerService.getRunningTimer();
      if (response.data.running !== false) {
        setRunningTimer(response.data);
        setDescription(response.data.description);
      }
    } catch (error) {
      console.error('Error checking running timer:', error);
    }
  };

  const handleStart = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      const response = await timerService.startTimer(description);
      setRunningTimer(response.data);
      setCurrentTime(0);
    } catch (error) {
      console.error('Error starting timer:', error);
      alert(error.response?.data?.error || 'Error starting timer');
    }
  };

  const handleStop = async () => {
    try {
      await timerService.stopTimer();
      setRunningTimer(null);
      setDescription('');
      setCurrentTime(0);
      loadTimeEntries();
      loadTotalTime();
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert('Error stopping timer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        await timerService.deleteTimeEntry(id);
        loadTimeEntries();
        loadTotalTime();
      } catch (error) {
        console.error('Error deleting time entry:', error);
      }
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Timer - Working Hours</h2>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                {runningTimer ? 'Timer Running' : 'Start New Timer'}
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you working on?"
                  disabled={runningTimer !== null}
                />
              </div>

              {runningTimer && (
                <div className="text-center my-4">
                  <h1 className="display-3 text-primary">
                    {formatDuration(currentTime)}
                  </h1>
                </div>
              )}

              <div className="d-flex justify-content-center">
                {runningTimer ? (
                  <button 
                    className="btn btn-danger btn-lg px-5"
                    onClick={handleStop}
                  >
                    <i className="bi bi-stop-circle me-2"></i>
                    Stop Timer
                  </button>
                ) : (
                  <button 
                    className="btn btn-success btn-lg px-5"
                    onClick={handleStart}
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Start Timer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title">Total Time Tracked</h5>
              <h2 className="display-4 text-primary">
                {totalHours.toFixed(2)}
              </h2>
              <p className="text-muted">hours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Time Entries</h5>
          
          {timeEntries.length === 0 ? (
            <div className="alert alert-info">No time entries yet. Start tracking your time!</div>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.description}</td>
                    <td>{formatDateTime(entry.startTime)}</td>
                    <td>
                      {entry.isRunning ? (
                        <span className="badge bg-success">Running</span>
                      ) : (
                        formatDateTime(entry.endTime)
                      )}
                    </td>
                    <td>
                      <strong>{entry.formattedDuration}</strong>
                    </td>
                    <td>
                      {!entry.isRunning && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerPage;