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
        ref="tareaInput"
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
          <!-- Sección para el botón de editar tarea -->
          <q-item-section side>
            <q-btn
              @click.stop="editarTarea(tarea)"
              flat
              round
              dense
              color="black"
              icon="edit"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Mensaje si no hay tareas -->
    <div v-if="!tareas.length" class="no-tasks">
      <q-icon name="check" size="100px" class="no-tasks-icon" />
      <div class="no-tasks-message">No hay tareas</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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
    const $q = useQuasar();
    const nuevaTarea = ref("");
    const tareas = ref([]);
    const edicionTarea = ref(false);
    const tareaEditando = ref(null);
    const tareaInput = ref(null);

    onMounted(() => {
      tareaInput.value && tareaInput.value.focus();
    });

    // Obtener tareas
    getTareas()
      .then((response) => {
        tareas.value = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // Fin obtener tareas

    // Agregar tarea
    const agregarTarea = () => {
      if (edicionTarea.value) {
        // Lógica para editar tarea
        editarTareaExistente();
      } else {
        // Lógica para agregar nueva tarea
        agregarNuevaTarea();
      }
    };

    // Editar tarea
    const editarTareaExistente = () => {
      if (nuevaTarea.value.trim() !== "") {
        updateTarea({
          id: tareaEditando.value.id,
          titulo: nuevaTarea.value,
          hecha: tareaEditando.value.hecha,
        })
          .then(() => {
            tareaEditando.value.titulo = nuevaTarea.value;
            finalizarEdicion();
            $q.notify({
              message: "Tarea editada correctamente",
              color: "green",
            });
          })
          .catch((error) => {
            console.error(error);
            $q.notify({
              message: "Error al editar la tarea",
              color: "red",
            });
          });
      } else {
        console.log("La tarea está vacía");
        $q.notify({
          message: "La tarea está vacía",
          color: "red",
        });
      }
    };
    // Fin editar tarea

    // Agregar tarea
    const agregarNuevaTarea = () => {
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
              color: "green",
            });
          })
          .catch((error) => {
            console.error(error);
            $q.notify({
              message: "Error al agregar la tarea",
              color: "red",
            });
          });
      } else {
        console.log("La tarea está vacía");
        $q.notify({
          message: "La tarea está vacía",
          color: "red",
        });
      }
    };

    const finalizarEdicion = () => {
      edicionTarea.value = false;
      nuevaTarea.value = "";
    };
    // Fin agregar tarea

    // Alternar tarea
    const alternarTarea = (tarea) => {
      const nuevaTarea = { ...tarea, hecha: !tarea.hecha };
      updateTarea(nuevaTarea)
        .then(() => {
          console.log("Estado actualizado: " + tarea.hecha);
          tarea.hecha = !tarea.hecha;
        })
        .catch((error) => {
          console.error(error);
          $q.notify({
            message: "Error al actualizar el estado de la tarea",
            color: "red",
          });
        });
    };
    // Fin alternar tarea

    // Editar tarea
    const editarTarea = (tarea) => {
      edicionTarea.value = true;
      tareaEditando.value = tarea;

      // Enfocar automáticamente el campo de edición
      tareaInput.value && tareaInput.value.focus();
    };
    // Fin editar tarea

    // Eliminar tarea
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
                color: "red",
              });
              console.log("Tarea eliminada");
            })
            .catch((error) => {
              console.error(error);
              $q.notify({
                message: "Error al eliminar la tarea",
                color: "red",
              });
            });
        })
        .onCancel(() => {
          $q.notify({
            message: "Operación cancelada",
            color: "red",
          });
        });
    };
    // Fin eliminar tarea

    return {
      nuevaTarea,
      tareas,
      agregarTarea,
      eliminarTarea,
      alternarTarea,
      editarTarea,
      tareaInput,
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
  background-color: $azul-claro;
  width: 100%;
  height: 90vh;
}

.no-tasks {
  text-align: center;
  margin-top: 25%;
}
</style>
