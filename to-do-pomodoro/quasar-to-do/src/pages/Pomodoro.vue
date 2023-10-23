<template>
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
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PomodoroComponente",

  data() {
    return {
      temporizador: 1200,
      intervaloTemporizador: null,
      pomodoros: 0,
      descansosCortos: 0,
      descansosLargos: 0,
      faseActual: "pomodoro",
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

.pomodoro-box {
  background-color: lightblue;
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
