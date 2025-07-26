<template>
    <div class="main-div">
        <h1>Search</h1>
        <br>

        <form @submit.prevent="handleSubmit">
            <input v-model="query" type="text" class="form-control" id="exampleFormControlInput1" placeholder="Search...">
            <br>
            <button class="btn btn-info">Search</button>
        </form>

        <br>

        <em v-if="loading && output.length">Loading users...</em>

        <ul class="list-group" v-if="output.length">
            <li class="list-group-item" v-for="user in output" :key="user.user_id">
                <p>
                    Username: <router-link :to="'/users/' + user.user_id">{{ user.username }} </router-link>
                    <br>
                    First Name: {{ user.first_name }} 
                    <br>
                    Last Name: {{ user.last_name }}
                </p>
            </li>
        </ul>

        <br>

        <!-- <p>{{ output }}</p> -->

        <!-- <br>
        <p v-if="error">{{ error }}</p> -->

    </div>
</template>

<script>
import { socialService } from '../../service/socials.service'

export default {
    data() {
        return {
            query: "",
            output: {},
            error: "",
            loading: true,
        }
    },
    methods: {
        handleSubmit(e) {

            socialService.searchUser(this.query)
                .then((output) => {
                    this.output = output;
                    this.loading = false;
                })
                .catch(error => this.error = error);

        },
    }
}
</script>