<template>
  <div class="col-3">
    <div class="snippet" data-title=".dot-pulse">
      <div class="stage">
        <div class="dot-pulse"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$color: #f0a709;
.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $color;
  color: $color;
  box-shadow: 9999px 0 0 -5px $color;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: 0.25s;
}

.dot-pulse::before,
.dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $color;
  color: $color;
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px $color;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px $color;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -5px $color;
  }
  30% {
    box-shadow: 9984px 0 0 2px $color;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px $color;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px $color;
  }
  30% {
    box-shadow: 9999px 0 0 2px $color;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px $color;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px $color;
  }
  30% {
    box-shadow: 10014px 0 0 2px $color;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px $color;
  }
}
</style>
