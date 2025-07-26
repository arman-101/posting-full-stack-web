<template>
    <div class="main-div">
        <h1>Login</h1>

        <br>

        <form @submit.prevent="handleSubmit">

            <div>

                <label class="mb-3">Username</label>
                <input class="form-control" type="text" name="username" v-model="username" placeholder="Enter your username...">
                <div class="input-error-div" v-show="submitted && !username">Username is required...</div>

                <br>

                <label class="mb-3">Password</label>
                <input class="form-control" type="password" name="password" v-model="password" placeholder="Enter your password...">
                <div class="input-error-div" v-show="submitted && !password">Password is required...</div>

                <br>

                <button class="btn btn-info">Login</button>
            </div>

        </form>

        <hr>

        <form @submit.prevent="handleSubmit2">
            <p>Need an Account?</p>
            <button class="btn btn-info">Sign Up</button>
        </form>

    </div>
</template>

<script>
    import { userService } from '../../service/users.service'

    export default {
        data() {
            return {
                username: "",
                password: "",
                submitted: false
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true

                const {username, password} = this

                if(!(username && password)) {
                    alert("Complete the input.");
                    return;
                }

                userService.login(username, password)
                .then(result => {
                    alert("Login Successful!");
                    this.$router.push("/profile")
                })
                .catch(error => {
                    this.submitted = false;
                    alert(error);
                    return;
                })
            },
            handleSubmit2(e) {
                this.$router.push("/signup")
            }
        }
    }
</script>