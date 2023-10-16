const tareas = ["Lavar los platos"];
const tareasPendientes = document.querySelector(".tareas_pendientes");

function mostrarTareas() {
  // Seleccionamos todas las tareas pendientes y las limpiamos
  tareasPendientes.innerHTML = "";

  // Mandamos un mensaje si no hay tareas
  if (tareas.length == 0) {
    const nuevoP = document.createElement("p");
    nuevoP.innerHTML = "No hay tareas pendientes";
    tareasPendientes.appendChild(nuevoP);
  }

  // Colocamos todas las tareas pendientes
  for (let i = 0; i < tareas.length; i++) {
    let p = document.createElement("p");
    p.innerHTML = tareas[i];
    tareasPendientes.appendChild(p);
  }
}

function agregarTarea() {
  const nuevaTarea = document.querySelector(".nueva_tarea").value;

  // trim() elimina cualquier espacio en blanco al inicio y al final de la cadena
  // Comprobamos que la nueva tarea no esté vacía
  if (nuevaTarea.trim() !== "") {
    tareas.push(nuevaTarea);
    document.querySelector(".nueva_tarea").value = "";
    mostrarTareas();
  }
}

// Obtenemos la tarea a eliminar
const eliminarTarea = document.querySelector(".tareas_pendientes");

eliminarTarea.addEventListener("click", function (event) {
  const tareaEliminar = event.target.textContent;
  const tareaIndex = tareas.indexOf(tareaEliminar);

  if (tareaIndex !== -1) {
    // Eliminamos la tarea del array
    tareas.splice(tareaIndex, 1);
    // Actualizamos la lista de tareas en la interfaz
    mostrarTareas();
  }

  // Eliminamos el elemento <p> clickeado
  event.target.remove();
});

mostrarTareas();
