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
        ref="tareaInput"
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
            <q-item-label :class="{ 'task-item-done': tarea.hecha }">{{
              tarea.titulo
            }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="tarea.hecha" side>
            <q-btn
              @click.stop="eliminarTarea(tarea.id)"
              flat
              round
              dense
              color="negative"
              icon="delete"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              @click.stop="editarTareaPrompt(tarea)"
              flat
              round
              dense
              color="primary"
              icon="edit"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="!tareas.length" class="no-tasks">
      <q-icon name="check" size="100px" class="no-tasks-icon" color="primary" />
      <div class="no-tasks-message">No hay tareas</div>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import {
  getTareas,
  postTarea,
  deleteTarea,
  updateTarea,
} from "../db/jsonServer";

export default {
  name: "ToDoComponente",

  setup() {
    const $q = useQuasar();
    const nuevaTarea = ref("");
    const tareas = ref([]);
    const tareaInput = ref(null);

    onMounted(() => {
      tareaInput.value && tareaInput.value.focus();
    });

    getTareas()
      .then((response) => {
        tareas.value = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const agregarTarea = () => {
      agregarNuevaTarea();
    };

    const editarTareaPrompt = (tarea) => {
      $q.dialog({
        title: "Editar tarea",
        message: "Introduce el nuevo título de la tarea:",
        prompt: {
          model: tarea.titulo,
          type: "text",
        },
        cancel: true,
        persistent: true,
      }).onOk((data) => {
        if (data.trim() !== "") {
          updateTarea({
            id: tarea.id,
            titulo: data.trim(),
            hecha: tarea.hecha,
          })
            .then(() => {
              tarea.titulo = data.trim();
              $q.notify({
                message: "Tarea editada correctamente",
                color: "positive",
              });
            })
            .catch((error) => {
              console.error(error);
              $q.notify({
                message: "Error al editar la tarea",
                color: "negative",
              });
            });
        } else {
          $q.notify({
            message: "La tarea está vacía",
            color: "negative",
          });
        }
      });
    };

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
              color: "positive",
            });
          })
          .catch((error) => {
            console.error(error);
            $q.notify({
              message: "Error al agregar la tarea",
              color: "negative",
            });
          });
      } else {
        console.log("La tarea está vacía");
        $q.notify({
          message: "La tarea está vacía",
          color: "negative",
        });
      }
    };

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
                color: "positive",
              });
              console.log("Tarea eliminada");
            })
            .catch((error) => {
              console.error(error);
              $q.notify({
                message: "Error al eliminar la tarea",
                color: "negative",
              });
            });
        })
        .onCancel(() => {
          $q.notify({
            message: "Operación cancelada",
            color: "negative",
          });
        });
    };

    const alternarTarea = (tarea) => {
      const nuevaTarea = { ...tarea, hecha: !tarea.hecha };
      updateTarea(nuevaTarea)
        .then(() => {
          console.log(tarea.hecha);
          tarea.hecha = !tarea.hecha;
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
      tareaInput,
      editarTareaPrompt,
    };
  },
};
</script>
