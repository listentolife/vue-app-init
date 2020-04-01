<template>
  <div class="home-wrapper">
    状态：{{text}}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapGetters({
      text: 'home/text'
    })
  },
  mounted () {
    this.asyncChangeText()
  },
  methods: {
    ...mapActions('home', [
      'asyncChangeText'
    ])
  }
}
</script>