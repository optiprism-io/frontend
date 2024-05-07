<template>
  <div class="app-preloader">
    <img
      class="app-preloader__logo"
      :src="OptiPrismLogo"
      alt="optiprism-logo"
    >
  </div>
</template>

<script setup lang="ts">
import OptiPrismLogo from '@/assets/img/logo-black.svg'
</script>

<style scoped lang="scss">
.app-preloader {
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
}

.app-preloader__logo {
  height: 80px;
  animation: pulse 2s ease-out infinite;

  position: absolute;
  top: 40%;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
