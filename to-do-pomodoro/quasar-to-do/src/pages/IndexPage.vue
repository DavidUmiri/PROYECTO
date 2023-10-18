<template>
  <q-page class="app-container">
    <!-- Sección del Pomodoro -->
    <div class="pomodoro-box">
      <div class="info-container">
        <div class="info-item">Pomodoro: {{ pomodoros }}</div>
        <div class="info-item">Descansos cortos: {{ descansosCortos }}</div>
        <div class="info-item">Descansos largos: {{ descansosLargos }}</div>
      </div>
      <div class="circle-container">
        <h1 class="circle-label">{{ formatoTiempo(temporizador) }}</h1>
      </div>
      <div class="button-container">
        <q-btn
          @click="alternarTemporizador"
          color="primary"
          :icon="intervaloTemporizador ? 'pause' : 'play_arrow'"
          class="action-button"
          rounded
        />
        <q-btn
          @click="resetearTemporizador"
          color="primary"
          icon="replay"
          class="action-button"
          rounded
        />
      </div>
    </div>

    <!-- Sección de las Tareas -->
    <div class="todo-box">
      <div class="add-task-container">
        <q-input
          v-model="nuevaTarea"
          @keyup.enter="agregarTarea"
          class="add-task-input"
          square
          filled
          bg-color="white"
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
            <q-item-section avatar @click="alternarTarea(indice)">
              <q-checkbox v-model="tarea.hecha" color="primary" />
            </q-item-section>
            <q-item-section @click="alternarTarea(indice)">
              <q-item-label :class="{ hecha: tarea.hecha }">{{
                tarea.titulo
              }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="tarea.hecha" side>
              <q-btn
                @click.stop="eliminarTarea(indice)"
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
        <q-icon
          name="check"
          size="100px"
          color="primary"
          class="no-tasks-icon"
        />
        <div class="no-tasks-message">No hay tareas</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PaginaPrincipal",

  data() {
    return {
      nuevaTarea: "",
      tareas: [],
      temporizador: 1500,
      intervaloTemporizador: null,
      pomodoros: 0,
      descansosCortos: 0,
      descansosLargos: 0,
      faseActual: "pomodoro",
    };
  },

  methods: {
    eliminarTarea(indice) {
      this.$q
        .dialog({
          title: "Confirmar",
          message: "¿Estás seguro/a?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.tareas.splice(indice, 1);
          this.$q.notify("Tarea eliminada");
        });
    },

    agregarTarea() {
      if (this.nuevaTarea.trim() !== "") {
        this.tareas.push({
          titulo: this.nuevaTarea,
          hecha: false,
        });
        this.nuevaTarea = "";
      } else {
        this.$q.notify("La tarea está vacía");
      }
    },

    alternarTarea(indice) {
      this.tareas[indice].hecha = !this.tareas[indice].hecha;
    },

    alternarTemporizador() {
      if (this.intervaloTemporizador) {
        clearInterval(this.intervaloTemporizador);
        this.intervaloTemporizador = null;
      } else {
        this.intervaloTemporizador = setInterval(() => {
          if (this.temporizador > 0) {
            this.temporizador--;
          } else {
            clearInterval(this.intervaloTemporizador);
            this.intervaloTemporizador = null;
            this.$q.notify("¡Tiempo terminado!");
            this.cambiarFase();
          }
        }, 1000);
      }
    },

    resetearTemporizador() {
      clearInterval(this.intervaloTemporizador);
      this.intervaloTemporizador = null;
      this.temporizador = 1500;
    },

    formatoTiempo(tiempo) {
      const minutos = Math.floor(tiempo / 60);
      const segundos = tiempo % 60;
      return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
        2,
        "0"
      )}`;
    },

    cambiarFase() {
      switch (this.faseActual) {
        case "pomodoro":
          this.pomodoros++;
          if (this.pomodoros % 4 === 0) {
            this.faseActual = "descansoLargo";
            this.temporizador = 900;
          } else {
            this.faseActual = "descansoCorto";
            this.temporizador = 300;
          }
          break;
        case "descansoCorto":
          this.descansosCortos++;
          this.faseActual = "pomodoro";
          this.temporizador = 1500;
          break;
        case "descansoLargo":
          this.descansosLargos++;
          this.faseActual = "pomodoro";
          this.temporizador = 1500;
          break;
        default:
          break;
      }
    },
  },
});
</script>

<style lang="scss">
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.pomodoro-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.circle-container {
  width: 100%;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-button {
  margin: 0 10px;
  font-size: 1.5em;
}

.info-container {
  text-align: left;
}

.info-item {
  margin-bottom: 10px;
  font-size: 1em;
}

.todo-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  margin: 20px auto 0;
}

.add-task-container {
  margin-bottom: 20px;
}

.add-task-input {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px;
  font-size: 1em;
  width: calc(100% - 20px);
}

.task-list {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-size: 1em;
  border-bottom: 1px solid #ccc;

  &.completed {
    text-decoration: line-through;
    color: #bbb;
  }
}

.delete-btn {
  cursor: pointer;
}

.no-tasks {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
}

.no-tasks-icon {
  margin-bottom: 10px;
  font-size: 3em;
}

.no-tasks-message {
  font-size: 1.5em;
  color: #555;
}
</style>
