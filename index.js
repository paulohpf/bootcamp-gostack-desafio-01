const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  {
    id: 1,
    title: "Novo Projeto 1",
    tasks: ["Nova Tarefa"]
  }
];

let reqTimes = 0;

//Middleware Global de log
server.use((req, res, next) => {
  console.log(reqTimes++);

  next();
});

const checkProjectsInArray = (req, res, next) => {
  const project = projects[req.params.index];

  if (!project)
    return res.status(400).json({ message: "Project does not exists" });

  req.project = project;

  return next();
};

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:index", checkProjectsInArray, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: []
  };

  projects.push(newProject);

  return res.json(projects);
});

server.put("/projects/:index", (req, res) => {
  const { index } = req.params;
  const { title } = req.body;

  projects[index].title = title;

  return res.json(projects);
});

server.delete("/projects/:index", checkProjectsInArray, (req, res) => {
  const { index } = req.params;

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:index/tasks", checkProjectsInArray, (req, res) => {
  const { index } = req.params;
  const { title } = req.body;

  projects[index].tasks.push(title);

  return res.json(projects);
});

//Escuta na porta 3000
//localhost:3000
server.listen(3000);
