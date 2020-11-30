<template>
    <div>
        <div>
            <div v-show="!showConfirm">
                <div slot="header">
                    <h3 class="mb-1">Forgot password?</h3>
                    <p class="mb-0">Please fill in your email. На этот адрес будет отправлено письмо с ссылой для ввода нового пароля</p>
                </div>
                <div v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul class="common-list">
                        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
                    </ul>
                </div>
                <form @submit="checkForm">
                    <input @keyup="changeLoginData" @change="changeLoginData" size="large" placeholder="Email" v-model="username" type="email"/>
                    <input @click.stop.prevent="onSubmit" type="submit" value="Reset Password"/>
                </form>
                <div>
                    <span>Do you have an account?</span><router-link to="/site/login"> Login</router-link>
                </div>
            </div>

            <div v-show="showConfirm">
                <div slot="header">
                    <h3 class="mb-1">Enter verification code</h3>
                    <p class="mb-1">To proceed password reset please type the verification code found in email</p>
                </div>
                <form @submit="checkConfirm" novalidate="true">
                    <input size="large" placeholder="Verification code" v-model.trim="activationCode" type="text"/>
                    <input @click.stop.prevent="onConfirm" type="submit" value="Check code"/>
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
        name: 'ResetPassword',
        data:()=>({
            errors:[],
            username: '',
            showConfirm: false,
            activationCode:''
        }),
        methods:{
            checkForm:function(e) {
                this.errors = [];
                if(!this.username) {
                    this.errors.push("Email required.");
                } else if(!this.validEmail(this.username)) {
                    this.errors.push("Valid email required.");
                }
                if(!this.errors.length) return true;
                e.preventDefault();
            },


            /* eslint-disable */
            validEmail:function(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            /* eslint-enable */

            changeLoginData: function(e){
              if (e.key !== 'Enter') {
                this.errors = [];
              }
            },

            onSubmit: function(e){
                if (this.checkForm(e)) {
                    this.$auth.makeReset(this.username)
                        .then(response => {
                            if(response.status){
                                this.showConfirm = true;
                            } else {
                                this.showConfirm = false;
                                this.errors.push(response.message);
                            }
                        })
                        .catch(error => {
                            this.errors = error.apply();
                        });
                } else {
                    e.preventDefault();
                }
            },

            checkConfirm: function(e){
                if (this.activationCode) {
                    return true;
                }
                e.preventDefault();
                return false;
            },

            onConfirm: function (e) {
                if (this.checkConfirm(e)) {
                    this.$router.push({name: 'changepassword', params:{
                        token: this.activationCode
                    }});
                } else {
                    e.preventDefault();
                }
            }
        }
    }
</script>
