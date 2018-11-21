<template>
  <div @click="emitEvent">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    emitEvent (e) {
      this.$emit("special", e);
    }
  }
}
</script>
