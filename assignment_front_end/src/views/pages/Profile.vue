<template>
    <div class="container main-div">
        <div class="row">
            <div class="col-6 profile-div">
                <h1>Profile</h1>
            </div>
            <div class="col-6 logout-div">
                <form @submit.prevent="handleSubmit" class="text-md-end">
                    <button class="btn btn-danger">Log out</button>
                </form>
            </div>
        </div>
    </div>


    <div class="main-div">

        <!-- User -->
        <h3>User</h3>
        <br>
        <div class="border p-3 bg-info bg-opacity-10 border border-info border-start rounded">
            <p>User ID: {{ user.user_id }}</p>
            <p>First Name: {{ user.first_name }}</p>
            <p>Last Name: {{ user.last_name }}</p>
            <p>Username: {{ user.username }}</p>
        </div>

        <br>

        <!-- Followers -->
        <h3>Followers - {{ user.followers.length }}</h3>
        <br>
        <div>
            <ul class="list-group" v-if="user.followers.length">
                <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded"
                    v-for="follower in user.followers" :key="user.followers.user_id">
                    <p>User ID: {{ follower.follower_id }}</p>
                    <p>First Name: {{ follower.first_name }}</p>
                    <p>Last Name: {{ follower.last_name }}</p>
                    <p>Username:
                        <router-link :to="'/users/' + follower.follower_id">
                            {{ follower.username }}
                        </router-link>
                    </p>
                </li>
            </ul>

        </div>

        <br>

        <!-- Following -->
        <h3>Following - {{ user.following.length }}</h3>
        <br>
        <div class="">
            <ul class="list-group" v-if="user.following.length">
                <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded"
                    v-for="f in user.following" :key="user.following.user_id">
                    <p>User ID: {{ f.user_id }}</p>
                    <p>First Name: {{ f.first_name }}</p>
                    <p>Last Name: {{ f.last_name }}</p>
                    <p>Username:
                        <router-link :to="'/users/' + f.user_id">
                            {{ f.username }}
                        </router-link>
                    </p>
                </li>
            </ul>

        </div>

        <br>

        <!-- Posts and Likes -->
        <h3>Posts - {{ user.posts.length }}</h3>
        <br>
        <div class="border">
            <ul class="list-group" v-if="user.posts.length">
                <li class="list-group" v-for="p in user.posts" :key="p.post_id">

                <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded">
                    <p>Post ID: {{ p.post_id }}</p>
                    <p>Date: {{ p.timestamp }}</p>
                    <p>Text:
                        <router-link :to="'/posts/' + p.post_id">
                            {{ p.text }}
                        </router-link>
                    </p>

                    <p><b>Author</b></p>
                    <p>User ID: {{ p.author.user_id }}</p>
                    <p>First Name: {{ p.author.first_name }}</p>
                    <p>Last Name: {{ p.author.last_name }}</p>

                    <p>Username:
                        <router-link :to="'/users/' + p.author.user_id">
                            {{ p.author.username }}
                        </router-link>
                    </p>

                    <!-- Display likes section only if there are likes -->
                    <p v-if="p.likes.length > 0"><b>Likes - {{ p.likes.length }}</b></p>
                    <ul class="list-group" v-if="p.likes.length > 0">
                        <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded"
                            v-for="l in p.likes" :key="l.user_id">
                            <p>User ID: {{ l.user_id }}</p>
                            <p>First Name: {{ l.first_name }}</p>
                            <p>Last Name: {{ l.last_name }}</p>
                            <p>Username:
                                <router-link :to="'/users/' + l.user_id">
                                    {{ l.username }}
                                </router-link>
                            </p>

                        </li>
                    </ul>
                </li>
                </li>
            </ul>
        </div>

        <!-- All Data and Error -->
        <!-- <div class="list-group">
            <div class="p-3 bg-info bg-opacity-10 border border-info border-start rounded">
                <p class="list-group-item">All post info (for debugging during development):</p>
                <p class="list-group-item">{{ user }}</p>
            </div>
        </div>

        <div class="list-group-item" v-if="error">
            {{ error }}
        </div> -->

    </div>
</template>

<script>
import { userService } from '../../service/users.service'
import { socialService } from '../../service/socials.service'

export default {
    data() {
        return {
            user: {},
            error: "",
        }
    },
    methods: {
        handleSubmit(e) {
            userService.logOut()
                .then(result => {
                    alert(result);
                    this.$router.push("/")
                })
                .catch(error => {
                    alert(error);
                    return;
                })
        }
    },
    created() {
        this.user.loading = true;

        socialService.getUser(localStorage.getItem("user_id"))
            .then((user) => {
                this.user = user;
            })
            .catch(error => this.error = error);

    }
}
</script>