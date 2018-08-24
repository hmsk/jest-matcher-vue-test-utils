<template>
  <div class="props">
    Matchers for Prop {{ internal }}
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
    },
    address: {
      type: String,
      default: "Kitakyushu, Japan"
    }
  },
  created () {
    this.overwrite("created");
  },
  methods: {
    overwrite (tag) {
      this.internal = "overwritten by " + tag;
    }
  }
}
</script>
