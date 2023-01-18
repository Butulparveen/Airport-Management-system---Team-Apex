<template>
    <div class="login-screen">
        <div class="background">
            <div class="login-container d-flex">
                <div class="img-container w-70">
        
                </div>
                <div class="login-form-container z-6 w-30">
                    <div class="login-card">
                        <div class="head_sign">SIGN UP</div>
                        <div class="label-items d-flex justify-center">
                            <div>UserType: </div>
                            <select class="m-5-left" id="usertype" v-model="userType">
                                <option value="2">Airline Employee</option>
                                <option value="1">Airport Employee</option>
                                <option value="3">User</option>
                            </select>
                        </div>
                        <div class="label-items d-flex ">
                            <div>
                                Name:
                            </div>
                            <div class="m-5-left">
                                <input type="text" v-model="username" name="username" id="username">
                            </div>
                        </div>
                        <div class="label-items d-flex ">
                            <div>
                                Password:
                            </div>
                            <div class="m-5-left">
                                <input v-model="password" type="password" name="password" id="password">
                            </div>
                        </div>
                        <div class="label-items d-flex ">
                            <div>
                                Mobile:
                            </div>
                            <div class="m-5-left">
                                <input v-model="mobile" type="text" name="mobile" id="mobile">
                            </div>
                        </div>
                        <div class="label-items d-flex">
                            <div>
                                Email ID:
                            </div>
                            <div class="m-5-left">
                                <input v-model="email" type="text" name="email" id="email">
                            </div>
                        </div>
                        <div v-if="userType == '2'" class="label-items d-flex ">
                            <div>
                                Airline:
                            </div>
                            <div class="m-5-left">
                                <input v-model="airline" type="text" name="airline" id="airline">
                            </div>
                        </div>
                        <div v-if="userType == '1'" class="label-items d-flex">
                            <div>
                                Airport:
                            </div>
                            <div class="m-5-left" >
                                <input v-model="airport" type="text" name="airport" id="airport">
                            </div>
                        </div>
                        <div class="label-items d-flex justify-center">
                            <div @click="signup()" class="login-btn pointer">
                                Sign up
                            </div>
                        </div>
                        <div class="label-items d-flex justify-center">
                            <div class=" pointer">
                                Have an account? Click <span class="newuser" @click="loginRedirect()">here</span>
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


export default {
    name: 'SignUpView',

    // components: {

    // }
    data() {
        return {
            userType: "",
            username: "",
            password: "",
            mobile: "",
            email: "",
            airline: "",
            airport: ""
        }
    },
    methods: {
        signup() {
            var navigate = this.$router;
            var data = {};
            console.log(this.userType);
            if(this.userType == '2') {
                data = {
                    "name":this.username,
                    "userType":this.userType,
                    "mobile": this.mobile,
                    "emailid": this.email,
                    "passwd":this.password,
                    "airline": this.airline
                }
            } else if(this.userType == '1'){
                data = {
                    "name":this.username,
                    "userType":this.userType,
                    "mobile": this.mobile,
                    "emailid": this.email,
                    "passwd":this.password,
                    "airport": this.airport
                }
            } else {
                data = {
                    "name":this.username,
                    "userType":this.userType,
                    "mobile": this.mobile,
                    "emailid": this.email,
                    "passwd":this.password,
                }
            }
            axios
                .post("http://www.apex-ams.me/signup", {
                    ...data
                })
                .then(function (response) {
                    console.log(response);
                    if(response) {
                        navigate.push({ path: '/' })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        },
        loginRedirect() {
            var navigate = this.$router;
            navigate.push({ path: '/' })
        }
    },


}
</script>

<style lang="less" scoped>
*{
    margin: 0px;
    padding: 0px;
}
.background {
    background-image: url("@/assets/login-bg-1.jpeg");
    background-size: cover;
    background-repeat: no-repeat;
    // width: 200px;
    height: 100vh;
}
.head_sign{
    font-weight: bold;
    font-size: 20px ;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    padding: 5px;
}
// .bg {
//   position: fixed; 
//   top: -50%; 
//   left: -50%; 
//   width: 200%; 
//   height: 200%;
// }
// .bg img {
//   position: absolute; 
//   top: 0; 
//   left: 0; 
//   right: 0; 
//   bottom: 0; 
//   margin: auto; 
//   min-width: 50%;
//   min-height: 50%;
// }
.login-card {
    background: white;
    width: 60%;
    padding: 15px;
    margin: 100px;
    margin-top: 150px;
    box-shadow: 0px 0px 10px;
    border-radius: 10px;
}

.label-items {
    padding: 15px;
    margin-left: 0;
    margin-right: 10px ;
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
.m-5-left{
    margin-left: auto;
}
</style>
  