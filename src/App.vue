<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import resizeMixins from './mixins/resizeMixins'

export default {
  name: 'app',
  mixins: [resizeMixins]
}
</script>