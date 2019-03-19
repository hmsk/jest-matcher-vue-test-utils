<template>
  <div
    @click="dispatchAction">
    Click Me
  </div>
</template>

<script>
module.exports = {
  methods: {
    dispatchAction (e) {
      this.$store.dispatch("awesomeAction");
    },
    dispatchActionWithPayload (payload) {
      this.$store.dispatch("awesomeAction", payload);
    }
  }
}
</script>
