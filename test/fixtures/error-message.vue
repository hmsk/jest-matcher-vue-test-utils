<template>
  <div>
    <p v-if="isError" class="error">message</p>
  </div>
</template>

<script>
module.exports = {
  props: {
    initialError: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isError: false
    }
  },
  created () {
    this.isError = this.initialError;
  },
  methods: {
    showError () {
      this.isError = true;
    },
    hideError () {
      this.isError = false;
    },
    async showErrorAsync () {
      const wait = Promise.resolve()
      await wait.then(() => { this.isError = true; });
    }
  }
}
</script>
