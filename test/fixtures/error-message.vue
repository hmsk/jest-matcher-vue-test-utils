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
  methods: {
    created () {
      this.isError = this.initialError;
    },
    showError () {
      isError = true;
    },
    dismissError () {
      isError = false;
    }
  }
}
</script>
