class Task {
  //id autogenerado
  id;
  name;
  description;
  checked = false;
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

class TaskList {
  tasks; // lista(array) de tareas
  nextId; // registra el numero anterior al id de la tarea a crear.

  constructor() {
    this.tasks = [];
    this.nextId = 0;
  }

  addTask(name, description) {
    this.nextId++;
    const task = new Task(this.nextId, name, description);
    this.tasks.push(task);
  }

  checkTask(idTarea) {
    // Modifica el valor CHECK de la tarea.
    let i = 0;
    while (i < this.tasks.length) {
      if (this.tasks[i].id === idTarea) {
        if (this.tasks[i].checked) this.tasks[i].checked = false;
        else this.tasks[i].checked = true;
        break;
      }
      i++;
    }
  }

  getTaskList() {
    // Lista original de tareas
    return this.tasks;
  }

  getPendingTasks() {
    //Devuelve copia con las tareas pendientes
    return this.tasks.filter((task) => task.checked === false);
  }

  getDoneTasks() {
    //Devuelve copia con las tareas finalizadas
    return this.tasks.filter((task) => task.checked === true);
  }

  removeTask(idTarea) {
    //busca tarea por su valor de id, y usamos su indice para poder borrarla con splice
    let i = 0;
    while (i < this.tasks.length) {
      if (this.tasks[i].id === idTarea) {
        this.tasks.splice(i, 1);
        break;
      }
      i++;
    }
  }
}

export function saveListLocalStorage(todolist) { // guarda/sobreescribe el objeto en cache
  localStorage.setItem('todolist', JSON.stringify(todolist));
}

export function loadListLocalStorage() { 
  // lee el objeto en cache, lo parsea y lo rehidrata. Si da error, devuelve un array vacio
  let lista, hidroLista;
  try {
    let lista = JSON.parse(localStorage.getItem('todolist')); 
    if (lista === null || lista === undefined){
      return []
    }else{
      hidroLista = Object.assign(new TaskList(), lista);
      return hidroLista;
    }     
  }catch(error){
    console.log(error);
    return;
  }  

  
}

export function createTaskList() {
  return new TaskList();  
}
