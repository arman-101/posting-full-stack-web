<template>
    <div class="main-div">
        <h1>Sign Up</h1>

        <br>

        <form @submit.prevent="handleSubmit">

            <div>
                <label class="mb-3">First Name</label>
                <input class="form-control" type="text" name="first-name" v-model="first_name" placeholder="Enter your first name...">
                <div class="input-error-div" v-show="submitted && !first_name">First name is required...</div>

                <br>

                <label class="mb-3">Last Name</label>
                <input class="form-control" type="text" name="last-name" v-model="last_name" placeholder="Enter your last name...">
                <div class="input-error-div" v-show="submitted && !last_name">Last name is required...</div>


                <br>

                <label class="mb-3">Username</label>
                <input class="form-control" type="text" name="username" v-model="username" placeholder="Enter your username...">
                <div class="input-error-div" v-show="submitted && !username">Username is required...</div>

                <br>

                <label class="mb-3">Password</label>
                <input class="form-control" type="password" name="password" v-model="password" placeholder="Enter your password...">
                <div class="input-error-div" v-show="submitted && !password">Password is required...</div>

                <br>

                <button class="btn btn-info">Sign Up</button>
            </div>

        </form>

        <hr>

        <form @submit.prevent="handleSubmit2">
            <p>Already have an account?</p>
            <button class="btn btn-info">Login</button>
        </form>
    </div>
</template>

<script>
    import { userService } from '../../service/users.service'

    export default {
        data() {
            return {
                first_name: "",
                last_name: "",
                username: "",
                password: "",
                submitted: false
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true

                const {first_name, last_name, username, password} = this

                if(!(first_name && last_name && username && password)) {
                    alert("Complete the input.");
                    return;
                }

                const password_pattern = /^(?=(.*[a-z]))(?=(.*[A-Z]))/
                if(!(password_pattern.test(password))) {
                    alert("Password not strong enough.");
                    return;
                }

                userService.sign_up(first_name, last_name, username, password)
                .then(result => {
                    alert("Sign up Successful!");
                    this.$router.push("/login")
                })
                .catch(error => {
                    this.submitted = false;
                    alert(error);
                    return;
                })
            },
            handleSubmit2(e) {
                this.$router.push("/login")
            }
        }
    }
</script>
