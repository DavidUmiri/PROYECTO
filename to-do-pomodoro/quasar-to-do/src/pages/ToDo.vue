<template>
  <div class="todo-box">
    <div class="add-task-container">
      <q-input
        v-model="nuevaTarea"
        @keyup.enter="agregarTarea"
        class="add-task-input"
        square
        filled
        placeholder="Añadir tarea"
        dense
      >
        <template v-slot:append>
          <q-btn @click="agregarTarea" round dense flat icon="add" />
        </template>
      </q-input>
    </div>

    <div class="task-list">
      <q-list separator bordered>
        <q-item v-for="(tarea, indice) in tareas" :key="indice" v-ripple>
          <q-item-section avatar @click="alternarTarea(tarea)">
            <q-checkbox v-model="tarea.hecha" color="primary" />
          </q-item-section>
          <q-item-section @click="alternarTarea(tarea)">
            <q-item-label :class="{ hecha: tarea.hecha }">{{
              tarea.titulo
            }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="tarea.hecha" side>
            <q-btn
              @click.stop="eliminarTarea(tarea.id)"
              flat
              round
              dense
              color="primary"
              icon="delete"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="!tareas.length" class="no-tasks">
      <q-icon name="check" size="100px" color="primary" class="no-tasks-icon" />
      <div class="no-tasks-message">No hay tareas</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import {
  getTareas,
  postTarea,
  deleteTarea,
  updateTarea,
} from "../db/jsonServer";

export default {
  name: "ToDoComponente",

  setup() {
    const nuevaTarea = ref("");
    const tareas = ref([]);

    const eliminarTarea = (tareaId) => {
      dialog({
        title: "Confirmar",
        message: "¿Estás seguro/a?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteTarea(tareaId)
          .then(() => {
            tareas.value = tareas.value.filter((t) => t.id !== tareaId);
            notify("Tarea eliminada");
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };

    const agregarTarea = () => {
      if (nuevaTarea.value.trim() !== "") {
        postTarea({
          titulo: nuevaTarea.value,
          hecha: false,
        })
          .then((response) => {
            tareas.value.push(response.data);
            nuevaTarea.value = "";
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        notify("La tarea está vacía");
      }
    };

    const alternarTarea = (tarea) => {
      const nuevaTarea = { ...tarea, hecha: !tarea.hecha };
      updateTarea(nuevaTarea)
        .then(() => {
          tarea.hecha = !tarea.hecha;
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getTareas()
      .then((response) => {
        tareas.value = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return {
      nuevaTarea,
      tareas,
      agregarTarea,
      eliminarTarea,
      alternarTarea,
    };
  },
};
</script>

<style lang="scss">
html,
body {
  box-sizing: border-box;
  margin: 0;
}

.todo-box {
  background-color: lightcoral;
  width: 100%;
  height: 90vh;
}
.no-tasks {
  text-align: center;
  margin-top: 25%;
}
</style>
