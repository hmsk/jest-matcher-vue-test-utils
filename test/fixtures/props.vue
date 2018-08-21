<template>
  <div class="props">
    Matchers for Prop
  </div>
</template>

<script>
module.exports = {
  data () {
    return {
      internal: "hi"
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
