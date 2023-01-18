<template>
    <div class="login-screen">
        <div class="background">

            <!-- <div class="bg">
            <img src="../assets/login-bg-1.jpeg" alt="">
        </div> -->
            <div class="login-container d-flex">
                <div class="img-container w-70">

                </div>
                <div class="z-3 login-form-container w-30">
                    <div class="login-card z-3">
                        <div class="head_sign">LOGIN IN</div>
                        <div class="label-items d-flex justify-center">
                            <!-- <div>UserType: </div>
                            <select class="m-5-left" id="usertype" v-model="userType">
                                <option value="2">Airline Employee</option>
                                <option value="1">Airport Employee</option>
                                <option selected value="3">User</option>
                            </select> -->
                        </div>
                        <div class="label-items d-flex">
                            <div>
                                  Mobile: 
                            </div>
                            <div class="mobile">
                                <input type="text" v-model="username" name="username" id="username">
                            </div> 
                        </div>
                        <div class="label-items d-flex">
                            <div>
                                Password:
                            </div>
                            <div class="password">
                                <input v-model="password" type="password" name="password" id="password">
                            </div>
                        </div>
                        <div class="label-items d-flex justify-center">
                            <div @click="login()" class="login-btn pointer">
                                Login
                            </div>
                        </div>
                        <div class="label-items d-flex justify-center">
                            <div class=" pointer">
                                New user? Click <span class="newuser" @click="sigupRedirect()">here</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
// @ is an alias to /src
//   import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
// import store from './vuex/store'
import { $store } from 'vuex'

export default {
    name: 'LoginView',

    // components: {

    // }
    data() {
        return {
            userType: "",
            username: "",
            password: "",
        }
    },
    methods: {
        login() {
            var navigate = this.$router;
            var self = this;
            axios
                .post("http://www.apex-ams.me/login", {
                    "mobile": this.username,
                    "passwd": this.password
                })
                .then(function (response) {
                    console.log(response);
                    let data = response.data;
                    if (response) { 
                        navigate.push({ name: "home", path: '/home', params: { userType: data.userType, airline: data.airline ? data.airline : 'user' } }); 
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        },
        sigupRedirect() {
            var navigate = this.$router;
            navigate.push({ path: '/signup' })
        }
    },


}
</script>
<style lang="less" scoped>
// body {
//     background: url("@/assets/login-bg.jpg") no-repeat center center fixed;
//     -webkit-background-size: cover;
//     -moz-background-size: cover;
//     -o-background-size: cover;
//     background-size: cover;
// }
* {
    margin: 0;
    padding: 0;
}

.background {
    background-image: url("@/assets/login-bg-1.jpeg");
    background-size: cover;
    background-repeat: no-repeat;
    // width: 200px;
    height: 100vh;
}

// .bg {
//     background-position: center;
//     background-repeat: no-repeat;
//     background-size: cover;
// }

// .bg img {
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     margin: auto;
//     min-width: 50%;
//     min-height: 50%;
// }
.head_sign{
    font-weight: bold;
    font-size: 20px ;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    padding: 5px;
}
.login-card {
    background: white;
    width: 60%;
    padding: 20px;
    margin: 50% auto;
    // border: 1px solid black;
    box-shadow: 0px 0px 10px;
    border-radius: 10px;
   justify-content: center;
}

.label-items {
    padding: 10px;
}

.login-btn {
    background: #835ec2;
    color: white;
    border: 1px solid #4e3677;
    padding: 6px 40px;
    border-radius: 4px;
}

.newuser {
    color: blue;
}
.mobile{
    padding-left: 22px;
}

.password{
    padding-left: 2px;
}
</style>
  