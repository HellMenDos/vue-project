<template>
  <div id="login">
    <div slot="header">
      <h3 class="mb-1">Login Here</h3>
      <p class="mb-0">Welcome back, please login to your account.</p>
    </div>

    <div v-if="errors.length" class="mb-3 mt-1" :active="!loginDataChanged">
      <b>Please correct the following error(s):</b>
      <ul class="common-list">
        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
      </ul>
    </div>

    <form @submit="checkForm" novalidate="true">
      <input @keyup="changeLoginData" @change="changeLoginData" placeholder="Email ID" v-model="email" type="email"/>
      <input @keyup="changeLoginData" @change="changeLoginData" placeholder="Password" type="password" v-model="password"/>

      <label><input type="checkbox" v-model="rememberme" />Remember me?</label>

      <router-link to="/site/forgot-password" class="ml-auto">Forgot Password? </router-link>
      <input type="submit" @click.stop.prevent="onSubmit" value="Login"/>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data:()=>({
    rememberme:false,
    email:'',
    password:'',
    errors:[],
    loginDataChanged: false
  }),
  methods:{
    changeLoginData: function(e){
      if (e.key !== 'Enter') {
        this.loginDataChanged = true;
      }
    },

    onSubmit: function(e){
      if (this.checkForm(e)) {
        this.sendLogin();
      } else {
        e.preventDefault();
      }
    },

    sendLogin: function(){
      this.errors = [];

      this.$auth.makeLogin({
        username: this.email,
        password: this.password,
        rememberme: this.rememberme
      })
      .then(() => {
        this.$store.dispatch('user/GET')
            .then(() => this.$router.push('/'))
            .catch( error => error.alert());
      })
      .catch( error => {
        this.errors = error.apply()
      });
    },

    checkForm:function() {
      this.errors = [];
      if(!this.email) {
        this.errors.push("Email required.");
      } else if(!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
      } else if(!this.password) {
        this.errors.push("Password required.");
      }
      this.loginDataChanged = false;
      return this.errors.length===0;
    },

    /* eslint-disable */
    validEmail:function(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      return re.test(email);
    }
    /* eslint-enable */
  }
}
</script>
