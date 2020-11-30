<template>
    <div>
        <div>
            <div>
                <div slot="header">
                  <h3 class="mb-1">Change password</h3>
                  <p class="mb-0">Please fill in new password</p>
                </div>

                <div v-if="errors.length" :active="!formDataChanged">
                    <b>Please correct the following error(s):</b>
                    <ul class="common-list">
                        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
                    </ul>
                </div>

                <form @submit="checkForm" novalidate="true">
                    <input @keyup="changeLoginData" @change="changeLoginData" size="large" type="password" placeholder="Password" v-model="password"/>
                    <input @keyup="changeLoginData" @change="changeLoginData" size="large" type="password" placeholder="Repeat password" v-model="password2"/>
                    <input @click.stop.prevent="onSubmit" type="submit" value="Change Password"/>
                </form>
                <div class="d-flex justify-content-center mt-3">
                    <span class="mr-1">Do you have an account?</span><router-link to="/site/login"> Login</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ChangePassword',
        data:()=>({
            password:'',
            password2:'',
            errors:[],
            formDataChanged: false
        }),
        methods:{
            close() {
                this.$router.push({name:'forgotpassword'});
            },

            changeLoginData: function(e){
              if (e.key !== 'Enter') {
                this.errors = [];
              }
            },

            checkForm:function(e) {
                this.errors = [];
                this.formDataChanged = false;
                if(!this.password) this.errors.push("Password required.");
                if (this.password !== this.password2) {
                    this.errors.push('Passwords must be equal')
                }
                if(!this.errors.length) return true;
                e.preventDefault();
            },

            onSubmit: function(e){
                if (this.checkForm(e)) {
                    this.$auth.makeRestore(this.$route.params.token, this.password)
                        .then( () => {
                           this.$store.dispatch('user/GET')
                              .then(() => this.$router.push('/'))
                              .catch( error => {
                                  error.alert()
                              });
                        })
                        .catch( error => {
                            error.apply()
                        });
                } else {
                    e.preventDefault();
                }
            }
        }
    }
</script>
