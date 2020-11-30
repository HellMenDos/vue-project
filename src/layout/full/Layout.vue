<template>
	<div class="main-wrapper">
		<Header/>
    	<router-view></router-view>
	</div>
</template>

<script>
import Header from '../Header.vue'
export default {
  name: "Layout",
  components: {
  	Header
  }
  methods: {
    logout() {
      this.$auth.makeLogout();
    }
  }
}
</script>

