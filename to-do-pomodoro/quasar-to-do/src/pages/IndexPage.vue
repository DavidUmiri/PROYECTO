<template>
  <q-page class="app-container">
    <!-- Pomodoro -->
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

    <!-- Tareas -->
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
      temporizador: 1200,
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
      this.temporizador = 1200;
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
          this.temporizador = 1200;
          break;
        case "descansoLargo":
          this.descansosLargos++;
          this.faseActual = "pomodoro";
          this.temporizador = 1200;
          break;
        default:
          break;
      }
    },
  },
});
</script>

<style lang="scss">
html,
body {
  box-sizing: border-box;
  margin: 0;
}

.app-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1%;
  margin: 0% 1%;
}

.pomodoro-box {
  background-color: lightblue;
  width: 100%;
  text-align: center;
  height: 90vh;
}
.todo-box {
  background-color: lightcoral;
  width: 100%;
  height: 90vh;
}

.info-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 15%;
  margin-top: 20%;
}

.button-container .action-button {
  margin: 5%;
}
.no-tasks {
  text-align: center;
  margin-top: 25%;
}
</style>
