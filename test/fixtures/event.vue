<template>
  <div
    @click="emitEvent"
    @blur="emitRootEvent">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    emitEvent (e) {
      this.$emit("special", e);
    },
    emitRootEvent (e) {
      this.$root.$emit("blured", e);
    },
    emitEventWithPayload (eventName, payload) {
      this.$emit(eventName, payload);
    },
    emitEventOnRootWithPayload (eventName, payload) {
      this.$root.$emit(eventName, payload);
    },
    emitEventWithMultiplePayload (eventName) {
      this.$emit(eventName, "a", 5, ["C"]);
    },
    emitEventOnRootWithMultiplePayload (eventName) {
      this.$root.$emit(eventName, ["D"], 3, "e");
    }
  }
}
</script>
