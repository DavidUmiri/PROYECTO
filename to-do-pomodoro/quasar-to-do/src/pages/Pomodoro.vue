<template>
  <!-- Contenedor principal -->
  <div class="pomodoro-box">
    <!-- Contenedor de información -->
    <div class="info-container">
      <div class="info-item">Pomodoro: {{ pomodoros }}</div>
      <div class="info-item">Descansos cortos: {{ descansosCortos }}</div>
      <div class="info-item">Descansos largos: {{ descansosLargos }}</div>
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
        color="black"
        :icon="intervaloTemporizador ? 'pause' : 'play_arrow'"
        class="action-button"
        rounded
      />

      <!-- Botón para reiniciar el temporizador -->
      <q-btn
        @click="resetearTemporizador"
        color="black"
        icon="replay"
        class="action-button"
        rounded
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Definición de constantes para los tiempos en segundos
const TIEMPO_INICIAL = 2;
const TIEMPO_DESCANSO_CORTO = 3;
const TIEMPO_DESCANSO_LARGO = 9;

export default defineComponent({
  name: "PomodoroComponente",

  data() {
    // Inicialización de las variables del componente
    return {
      temporizador: TIEMPO_INICIAL,
      intervaloTemporizador: null,
      pomodoros: 0,
      descansosCortos: 0,
      descansosLargos: 0,
      faseActual: "pomodoro",
    };
  },

  methods: {
    // Función para alternar el temporizador entre iniciar y detener
    alternarTemporizador() {
      if (this.intervaloTemporizador) {
        clearInterval(this.intervaloTemporizador); // Detener el temporizador
        this.intervaloTemporizador = null;
      } else {
        this.intervaloTemporizador = setInterval(() => {
          if (this.temporizador > 0) {
            this.temporizador--;
          } else {
            clearInterval(this.intervaloTemporizador);
            this.intervaloTemporizador = null;
            this.$q.notify("¡Tiempo terminado!"); // Notificar cuando el tiempo termina
            this.cambiarFase(); // Cambiar a la siguiente fase
          }
        }, 1000); // Actualizar el temporizador cada segundo (1000 milisegundos)
      }
    },

    // Función para resetear el temporizador
    resetearTemporizador() {
      clearInterval(this.intervaloTemporizador);
      this.intervaloTemporizador = null;
      this.temporizador = TIEMPO_INICIAL; // Reiniciar el temporizador a 20 minutos
    },

    // Función para formatear el tiempo (segundos a "mm:ss")
    formatoTiempo(tiempo) {
      const minutos = Math.floor(tiempo / 60);
      const segundos = tiempo % 60;
      return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
        2,
        "0"
      )}`;
    },

    // Función para cambiar de fase (pomodoro, descanso corto, descanso largo)
    cambiarFase() {
      switch (this.faseActual) {
        case "pomodoro":
          this.pomodoros++;
          if (this.pomodoros % 4 === 0) {
            this.faseActual = "descansoLargo";
            this.temporizador = TIEMPO_DESCANSO_LARGO; // Cambiar a 15 minutos para descanso largo
          } else {
            this.faseActual = "descansoCorto";
            this.temporizador = TIEMPO_DESCANSO_CORTO; // Cambiar a 5 minutos para descanso corto
          }
          break;
        case "descansoCorto":
          this.descansosCortos++;
          this.faseActual = "pomodoro";
          this.temporizador = TIEMPO_INICIAL; // Volver a 20 minutos para pomodoro
          break;
        case "descansoLargo":
          this.descansosLargos++;
          this.faseActual = "pomodoro";
          this.temporizador = TIEMPO_INICIAL; // Volver a 20 minutos para pomodoro
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

.pomodoro-box {
  background-color: $principal;
  width: 100%;
  text-align: center;
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
</style>
