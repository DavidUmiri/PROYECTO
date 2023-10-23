<template>
  <div class="app-container">
    <PomodoroComponente />
    <ToDoComponente />
  </div>
</template>

<script>
import PomodoroComponente from "./Pomodoro.vue";
import ToDoComponente from "./ToDo.vue";

export default {
  components: {
    PomodoroComponente,
    ToDoComponente,
  },
};
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
  margin: 1% 1%;
}
</style>
