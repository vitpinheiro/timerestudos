import { useState, useEffect } from "react";

const StudyTimer = () => {
  const studyTime = 25 * 60; // 25 minutos
  const breakTime = 5 * 60;  // 5 minutos

  const [time, setTime] = useState(studyTime);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Estudo");

  // Estado para armazenar as tarefas
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); // Estado para o texto da nova tarefa

  // Estado para controlar a visibilidade do sidebar
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Estado para o tempo total de estudo
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [studyCompleted, setStudyCompleted] = useState(false); // Estado para indicar se os estudos foram concluídos

  // Recupera as tarefas do sessionStorage ao carregar a página
  useEffect(() => {
    const savedTasks = JSON.parse(sessionStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      sessionStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      playAlarm();
      if (mode === "Estudo") {
        setTotalStudyTime((prevTime) => prevTime + studyTime); // Adiciona o tempo de estudo
      }
      switchMode();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, mode]);

  const switchMode = () => {
    if (mode === "Estudo") {
      setMode("Pausa");
      setTime(breakTime);
    } else {
      setMode("Estudo");
      setTime(studyTime);
    }
    setIsRunning(true);
  };

  const playAlarm = () => {
    const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    audio.play();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Função para adicionar uma nova tarefa
  const addTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = [...tasks, { text: newTask, isCompleted: false }];
      setTasks(updatedTasks);
      setNewTask(""); 
    }
  };

  // Função para marcar tarefa como concluída
  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, idx) =>
      idx === index ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };

  // Função para excluir uma tarefa
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((task, idx) => idx !== index);
    setTasks(updatedTasks);
  };

  // Círculo animado
  const radius = 100; // Para aumentar o tamanho do círculo
  const circumference = 2 * Math.PI * radius;
  const progress = (time / (mode === "Estudo" ? studyTime : breakTime)) * circumference;

  return (
    <div className="container">
      <div className="timer-container">
        <h1>StudyTimer</h1>
        <h2 className={mode === "Estudo" ? "study-mode" : "break-mode"}>{mode}</h2>
        
        <svg width="250" height="250"> 
          <circle cx="125" cy="125" r={radius} fill="none" stroke="#ddd" strokeWidth="10" />
          <circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke={mode === "Estudo" ? "#0077b6" : "#f4a261"}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            transform="rotate(-90 125 125)" 
          />
        </svg>

        <div className="time">{formatTime(time)}</div>

        <div className="button-container">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pausar" : "Iniciar"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setMode("Estudo");
              setTime(studyTime);
            }}
          >
            Resetar
          </button>

          
        </div>
        
        <button  style={{ backgroundColor: "#28a745", color: "white",fontSize:"14px", marginTop:"10px", }}>
            Concluir Estudos
          </button>
        {/* Exibe o tempo total de estudo
        <div className="total-time">
          <h3>Tempo Estudado: {formatTime(totalStudyTime)}</h3>
        </div> */}
      </div>

      {/* Botão para ocultar/mostrar o sidebar */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "5px 10px",
          fontSize: "14px",
          borderRadius: "5px",
          backgroundColor: "#0077b6",
          color: "white",
        }}
      >
        {isSidebarVisible ? "Ocultar Tarefas" : "Mostrar Tarefas"}
      </button>

      {/* Sidebar de tarefas */}
      {isSidebarVisible && (
        <div className="sidebar">
          <h3>Minhas Tarefas</h3>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova tarefa"
          />
          <button onClick={addTask}>Adicionar Tarefa</button>
          <ul>
            {tasks.map((task, index) => (
              <li
                key={index}
                style={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                  color: task.isCompleted ? "#8e8e8e" : "black",
                }}
              >
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleTaskCompletion(index)}
                />
                {task.text}
                <button
                  onClick={() => deleteTask(index)}
                  style={{
                    marginLeft: "10px",
                    color: "white",
                    backgroundColor: "red",
                    width: "25px", 
                    height: "25px", 
                    fontSize: "10px",
                    borderRadius: "60%", 
                    padding: "0", 
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    lineHeight: "1", 
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        
      )}
    </div>
    
  );
};


export default StudyTimer;
