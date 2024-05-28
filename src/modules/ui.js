//Importacion del modulo de lógica
import { createTaskList, saveListLocalStorage, loadListLocalStorage} from "/src/modules/tasklist.js";
//Declaraciones de elementos del DOM
const taskInputTitle         = document.querySelector("#inputboxFormTitle");
const taskInputDescription   = document.querySelector("#inputboxFormDescription");
const taskListElement        = document.querySelector("#tasklist");
const addTaskBtn             = document.querySelector("#inputBoxFormAddBtn");
const navBtn_seeAllTasks     = document.querySelector("#navBtn_seeAllTasks");
const navBtn_seeDoneTasks    = document.querySelector("#navBtn_seeDoneTasks");
const navBtn_seePendingTasks = document.querySelector("#navBtn_seePendingTasks");

//Eventos que se inician al iniciar la página
function setupEventsUI(list) {
  addTaskBtn.addEventListener("click", () => {
    const title = taskInputTitle.value.trim();    
    const description = taskInputDescription.value.trim();
    if (title === "" || description === "") {
      alert("Both title and description are required!");
    }else {
      addTaskUI(list, title, description);
      showTasksUI(list,"all");
    }       
  }); 

  navBtn_seeAllTasks.addEventListener("click",()=>{
    showTasksUI(list, "all")
  } )    
  navBtn_seeDoneTasks.addEventListener("click",()=>{
    showDoneTasksUI(list)
  } )   
  navBtn_seePendingTasks.addEventListener("click",()=>{
    showPendingTasksUI(list)
  } )
}

//Funcion que es a su vez llamada por otras funciones, que desplega las tareas, 
//y un parametro que funciona como filtro de actividades a renderizar en pantalla.
function showTasksUI(list, mode) {
  //Refrescamos la zona para nuevo despliegue de tareas
  taskListElement.innerHTML = '';   
  //Se filtra que tareas tomar de la lista de tareas 
  let tasks=[];

  if (mode==="all"){
      tasks = list.getTaskList();
  }else if(mode==="done"){
    tasks = list.getDoneTasks();
  }else if(mode==="pending"){
    tasks = list.getPendingTasks();
  };

  // Listado completo de tareas (pendientes y completas)
  try {
    tasks.forEach(task => {
      const contTarea = document.createElement("li");
      const txtTarea = document.createElement("span"); 
      const checkbox = document.createElement("input");   
      const boton = document.createElement("button");
      const img = document.createElement('img'); 
      img.src="/assets/img/trash.png";
      checkbox.type="checkbox"; 
      if (task.checked)
        checkbox.checked="true";      
      checkbox.classList.add("tasklist__task__check");
      boton.classList.add("tasklist__task__removeTask");    
      txtTarea.textContent = `${task.name}: ${task.description}`;
      boton.appendChild(img);  
      contTarea.appendChild(checkbox);
      contTarea.appendChild(txtTarea);
      contTarea.appendChild(boton);
      taskListElement.appendChild(contTarea);
      console.log(taskListElement);        
      //Anexamos evento al nuevo check creado para poder cambiar de estado la tarea. 
      //Guarda en tiempo real la actualizacion del estado de la tarea en la LocalStorage.
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            task.checked = true
        } else {
            task.checked = false
        }
        saveListLocalStorage(list);
      });   
      boton.addEventListener("click",()=>{
        deleteTaskUI(list, task.id)
      })
    });
    
  } catch (error) {    
    console.log("Error:", error);
  }  
}

function showDoneTasksUI(list){ 
  showTasksUI(list,"done") 
}

function showPendingTasksUI(list) {
  showTasksUI(list,"pending")
}

function addTaskUI(list, name, description) {
  if (list) {
    list.addTask(name, description);
    saveListLocalStorage(list);    
  } else {
    console.error("Invalid list object or addTask method not defined", list);
  }
}

function deleteTaskUI(list, id) {
  list.removeTask(id);
  saveListLocalStorage(list);
  showTasksUI(list, "all");
}

//Funcion que prepara el inicio de la UI (Ejecutar primero)
function startUI() {  
  //Si hay datos guardados en el localStorage, cargarlos y crear nueva lista 
  //con ellos. Sino, crearla vacia.
  let list = loadListLocalStorage();
  console.log(list.getTaskList());
  if (list===null)
    list = createTaskList();  
  setupEventsUI(list);  
  showTasksUI(list, "all");
}

const ui = {
  startUI
}

export default ui;