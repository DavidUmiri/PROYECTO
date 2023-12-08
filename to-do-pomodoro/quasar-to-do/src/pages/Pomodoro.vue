<template>
  <!-- Contenedor principal -->
  <div class="pomodoro-box">
    <!-- Contenedor de información -->
    <div class="info-container">
      <div
        :class="{ 'pomodoro-info': faseActual === 'pomodoro' }"
        class="info-item"
      >
        Pomodoro: {{ pomodoros }}
      </div>
      <div
        :class="{ 'descanso-corto-info': faseActual === 'descansoCorto' }"
        class="info-item"
      >
        Descansos cortos: {{ descansosCortos }}
      </div>
      <div
        :class="{ 'descanso-largo-info': faseActual === 'descansoLargo' }"
        class="info-item"
      >
        Descansos largos: {{ descansosLargos }}
      </div>
    </div>

    <!-- Contenedor del temporizador -->
    <div class="circle-container">
      <h1 class="circle-label">{{ formatoTiempo(temporizador) }}</h1>
    </div>

    <!-- Contenedor de botones -->
    <div class="button-container">
      <!-- Botón para iniciar/detener el temporizador -->
      <q-btn
        @click="alternarTemporizador"
        color="primary"
        :icon="intervaloTemporizador ? 'pause' : 'play_arrow'"
        class="action-button"
        rounded
      />

      <!-- Botón para reiniciar el temporizador -->
      <q-btn
        @click="resetearTemporizador"
        color="primary"
        icon="replay"
        class="action-button"
        rounded
      />
    </div>

    <!-- Contenedor de configuración -->
      <!-- <div class="config-container">
      <q-input
        v-model="tiempoPomodoro"
        label="Tiempo de Pomodoro (en minutos)"
        type="number"
        @input="actualizarTiempo"
        min="1"
      />
      <q-input
        v-model="tiempoDescansoCorto"
        label="Tiempo de descanso corto (en minutos)"
        type="number"
        @input="actualizarTiempo"
        min="1"
      />
      <q-input
        v-model="tiempoDescansoLargo"
        label="Tiempo de descanso largo (en minutos)"
        type="number"
        @input="actualizarTiempo"
        min="1"
      />
      <q-btn @click="guardarCambios" color="primary" label="Guardar cambios" />
    </div> -->
  </div>
</template>

<script>
import { defineComponent } from "vue";

const TIEMPO_INICIAL = 20;
const TIEMPO_DESCANSO_CORTO = 5;
const TIEMPO_DESCANSO_LARGO = 15;

export default defineComponent({
  name: "PomodoroComponente",

  data() {
    return {
      temporizador: TIEMPO_INICIAL * 60,
      intervaloTemporizador: null,
      pomodoros: 0,
      descansosCortos: 0,
      descansosLargos: 0,
      faseActual: "pomodoro",
      tiempoPomodoro: TIEMPO_INICIAL,
      tiempoDescansoCorto: TIEMPO_DESCANSO_CORTO,
      tiempoDescansoLargo: TIEMPO_DESCANSO_LARGO,
      tiemposOriginales: {
        tiempoPomodoro: TIEMPO_INICIAL,
        tiempoDescansoCorto: TIEMPO_DESCANSO_CORTO,
        tiempoDescansoLargo: TIEMPO_DESCANSO_LARGO,
      },
    };
  },

  methods: {
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
      this.temporizador = this.tiempoPomodoro * 60;
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
            this.temporizador = this.tiempoDescansoLargo * 60;
          } else {
            this.faseActual = "descansoCorto";
            this.temporizador = this.tiempoDescansoCorto * 60;
          }
          break;
        case "descansoCorto":
          this.descansosCortos++;
          this.faseActual = "pomodoro";
          this.temporizador = this.tiempoPomodoro * 60;
          break;
        case "descansoLargo":
          this.descansosLargos++;
          this.faseActual = "pomodoro";
          this.temporizador = this.tiempoPomodoro * 60;
          break;
        default:
          break;
      }
    },

    actualizarTiempo() {
      this.tiempoPomodoro = Math.max(1, this.tiempoPomodoro);
      this.tiempoDescansoCorto = Math.max(1, this.tiempoDescansoCorto);
      this.tiempoDescansoLargo = Math.max(1, this.tiempoDescansoLargo);

      // Actualizar el temporizador si está en la fase correspondiente
      switch (this.faseActual) {
        case "pomodoro":
          this.temporizador = this.tiempoPomodoro * 60;
          break;
        case "descansoCorto":
          this.temporizador = this.tiempoDescansoCorto * 60;
          break;
        case "descansoLargo":
          this.temporizador = this.tiempoDescansoLargo * 60;
          break;
        default:
          break;
      }
    },

    guardarCambios() {
      // Guardar los tiempos originales
      this.tiemposOriginales = {
        tiempoPomodoro: this.tiempoPomodoro,
        tiempoDescansoCorto: this.tiempoDescansoCorto,
        tiempoDescansoLargo: this.tiempoDescansoLargo,
      };

      // Actualizar el temporizador si está en la fase correspondiente
      this.actualizarTiempo();
    },
  },
});
</script>

