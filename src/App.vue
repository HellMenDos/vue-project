<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data:()=>({
  }),
  methods: {

  },
  created() {
    this.$log.info('Application is started');
  }
}
</script>
