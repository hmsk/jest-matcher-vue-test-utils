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
    dismissError () {
      this.isError = false;
    }
  }
}
</script>
