<template>
  <!-- Contenedor principal de la lista de tareas -->
  <div class="todo-box">
    <!-- Contenedor para añadir nueva tarea -->
    <div class="add-task-container">
      <!-- Entrada de texto para nueva tarea -->
      <q-input
        v-model="nuevaTarea"
        @keyup.enter="agregarTarea"
        class="add-task-input"
        square
        filled
        placeholder="Añadir tarea"
        dense
      >
        <!-- Botón para agregar tarea -->
        <template v-slot:append>
          <q-btn @click="agregarTarea" round dense flat icon="add" />
        </template>
      </q-input>
    </div>

    <!-- Lista de tareas -->
    <div class="task-list">
      <q-list separator bordered>
        <!-- Iterar sobre las tareas -->
        <q-item v-for="(tarea, indice) in tareas" :key="indice" v-ripple>
          <!-- Sección para el checkbox de tarea -->
          <q-item-section avatar @click="alternarTarea(tarea)">
            <q-checkbox v-model="tarea.hecha" color="red" />
          </q-item-section>
          <!-- Sección para el título de la tarea -->
          <q-item-section @click="alternarTarea(tarea)">
            <q-item-label :class="{ hecha: tarea.hecha }">{{
              tarea.titulo
            }}</q-item-label>
          </q-item-section>
          <!-- Sección para el botón de eliminar tarea (si está hecha) -->
          <q-item-section v-if="tarea.hecha" side>
            <q-btn
              @click.stop="eliminarTarea(tarea.id)"
              flat
              round
              dense
              color="red"
              icon="delete"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Mensaje si no hay tareas -->
    <div v-if="!tareas.length" class="no-tasks">
      <q-icon
        name="check"
        size="100px"
        color="$principal"
        class="no-tasks-icon"
      />
      <div class="no-tasks-message">No hay tareas</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getTareas,
  postTarea,
  deleteTarea,
  updateTarea,
} from "../db/jsonServer";
import { useQuasar } from "quasar";

export default {
  name: "ToDoComponente",

  setup() {
    const nuevaTarea = ref("");
    const tareas = ref([]);
    const $q = useQuasar();

    getTareas()
      .then((response) => {
        tareas.value = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const eliminarTarea = (tareaId) => {
      $q.dialog({
        title: "Confirmar",
        message: "¿Estás seguro/a de eliminar esta tarea?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          deleteTarea(tareaId)
            .then(() => {
              tareas.value = tareas.value.filter((t) => t.id !== tareaId);
              $q.notify({
                message: "Tarea eliminada correctamente",
                color: "$pos",
              });
              console.log("Tarea eliminada");
            })
            .catch((error) => {
              console.error(error);
              $q.notify({
                message: "Error al eliminar la tarea",
                color: "$neg",
              });
            });
        })
        .onCancel(() => {
          $q.notify({
            message: "Operación cancelada",
            color: "$neg",
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
            $q.notify({
              message: "Tarea agregada correctamente",
              color: "$pos",
            });
          })
          .catch((error) => {
            console.error(error);
            $q.notify({
              message: "Error al agregar la tarea",
              color: "$neg",
            });
          });
      } else {
        console.log("La tarea está vacía");
        $q.notify({
          message: "La tarea está vacía",
          color: "$info",
        });
      }
    };

    const alternarTarea = (tarea) => {
      const nuevaTarea = { ...tarea, hecha: !tarea.hecha };
      updateTarea(nuevaTarea)
        .then(() => {
          tarea.hecha = !tarea.hecha;
          $q.notify({
            message: `Estado de la tarea "${tarea.titulo}" actualizado`,
            color: "positive",
          });
        })
        .catch((error) => {
          console.error(error);
          $q.notify({
            message: "Error al actualizar el estado de la tarea",
            color: "negative",
          });
        });
    };

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
  background-color: $turquesa;
  width: 100%;
  height: 90vh;
}

.no-tasks {
  text-align: center;
  margin-top: 25%;
}
</style>
