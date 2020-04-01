<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path, name, param } = params
    this.$router.replace({ name, params: param, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
