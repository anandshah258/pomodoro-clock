import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    cycles: 3,
    workTime: 25,
    breakTime: 5,
  });
  const [cycles, setCycles] = useState(formData.cycles);
  const [mode, setMode] = useState("work");
  const [timer, setTimer] = useState({ id: null, state: "reset" });
  const [time, setTime] = useState({ minutes: formData.workTime, seconds: 0 });

  useEffect(
    function handleCycleEnd() {
      if (cycles === 0) resetTimer();
    },
    [cycles]
  );

  useEffect(
    function handleTimerEnd() {
      let { minutes, seconds } = time;
      let { workTime, breakTime } = formData;
      if (minutes === -1 && seconds === 59) {
        console.log("0 0");
        if (mode === "break") {
          setCycles((cycles) => cycles - 1);
          setMode("work");
          setTime({ minutes: workTime - 1, seconds: 59 });
        } else if (mode === "work") {
          setMode("break");
          setTime({ minutes: breakTime - 1, seconds: 59 });
        }
      }
    },
    [time]
  );

  return (
    <div className="container">
      <h1 className="title">Pomodoro Clock</h1>
      <ProgressBar
        completed={completed()}
        maxCompleted={maxCompleted()}
        bgColor="#1363DF"
        customLabel=" "
        borderRadius="0px"
      />
      <h2 className="message">{getMessage()}</h2>
      <div className="time">{getDisplayTime()}</div>
      {timer.state === "reset" ? (
        <div>
          <button className="button" onClick={startTimer}>
            START
          </button>
          <form className="form">
            <h2 className="subheading">Customize</h2>
            <div className="input-box">
              <label htmlFor="cycles">Number of Cycles</label>
              <input
                id="cycles"
                type="number"
                name="cycles"
                value={formData.cycles}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="workTime">Work Time (in minutes)</label>
              <input
                id="workTime"
                type="number"
                name="workTime"
                value={formData.workTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="breakTime">Break Time (in minutes)</label>
              <input
                id="breakTime"
                type="number"
                name="breakTime"
                value={formData.breakTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </div>
      ) : (
        <div>
          {timer.state === "start" ? (
            <button className="button" onClick={stopTimer}>
              STOP
            </button>
          ) : (
            <button className="button" onClick={startTimer}>
              START
            </button>
          )}
          <button className="button" onClick={resetTimer}>
            RESET
          </button>
        </div>
      )}
    </div>
  );

  function handleInputChange(event) {
    let { name, value } = event.target;
    value = +value;
    if (value < 1) value = 1;
    setFormData((form) => {
      return { ...form, [name]: +value };
    });
    if (name === "workTime") setTime({ minutes: value, seconds: 0 });
    if (name === "cycles") setCycles(value);
  }

  function getMessage() {
    const { state } = timer;
    if (state === "reset") return "Start the Timer!";
    if (mode === "work") return "Focus on work!";
    if (mode === "break") return "Have a break!";
  }

  function getDisplayTime() {
    let { minutes, seconds } = time;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  function startTimer() {
    const timerId = setInterval(timerLogic, 1000);
    setTimer(() => ({ id: timerId, state: "start" }));
  }

  function stopTimer() {
    clearInterval(timer.id);
    setTimer(() => ({ id: null, state: "stop" }));
  }

  function resetTimer() {
    let { cycles, workTime } = formData;
    clearInterval(timer.id);
    setTimer(() => ({ id: null, state: "reset" }));
    setCycles(cycles);
    setTime({ minutes: workTime, seconds: 0 });
    setMode("work");
  }

  function timerLogic() {
    setTime(({ minutes, seconds }) => {
      if (seconds === 0) return { minutes: minutes - 1, seconds: 59 };
      return { minutes, seconds: seconds - 1 };
    });
  }

  function completed() {
    let { minutes, seconds } = time;
    if (minutes === -1) return 0;
    let incomplete = minutes * 60 + seconds;
    return maxCompleted() - incomplete;
  }

  function maxCompleted() {
    if (mode === "work") return formData.workTime * 60;
    return formData.breakTime * 60;
  }
}

export default App;
