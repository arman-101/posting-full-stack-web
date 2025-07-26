<template>
    <div class="main-div">

        <h2>User</h2>
        <br>
        <em class="list-group" v-if="user.loading">Loading user...</em>

        <!-- User -->
        <div class="border p-3 bg-info bg-opacity-10 border border-info border-start rounded">
            <p>User ID: {{ user.user_id }}</p>
            <p>First Name: {{ user.first_name }}</p>
            <p>Last Name: {{ user.last_name }}</p>
            <p>Username: {{ user.username }}</p>

            <div v-if="!(person_1 === person_2)">
                <form @submit.prevent="handleSubmit1">
                    <button class="btn btn-info">Follow</button>
                </form>

                <br>

                <form @submit.prevent="handleSubmit2">
                    <button class="btn btn-danger">Unfollow</button>
                </form>
            </div>

        </div>

        <br>

        <!-- Followers -->

        <div v-if="!user.loading">
            <h2>Followers - {{ user.followers.length }}</h2>
            <p></p>
            <br>
            <div>
                <ul class="list-group" v-if="user.followers.length">
                    <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded"
                        v-for="follower in user.followers" :key="follower.user_id">
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
        </div>


        <br>

        <!-- Following -->
        <h2>Following - {{ user.following.length }}</h2>
        <br>
        <div class="">
            <ul class="list-group" v-if="user.following.length">
                <li class="list-group-item p-3 bg-info bg-opacity-10 border border-info border-start rounded"
                    v-for="f in user.following" :key="f.user_id">
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
        <h2>Posts - {{ user.posts.length }}</h2>
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
                            <p>Username: {{ l.username }}</p>
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





        <hr>
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
import { socialService } from '../../service/socials.service'

export default {
    data() {
        return {
            user: {},
            error: "",
            person_1: localStorage.getItem("user_id"),
            person_2: this.$route.params.id,
        }
    },
    methods: {
        handleSubmit1(e) {
            socialService.followUser(this.$route.params.id)
                .then(result => {
                    alert(result);
                })
                .catch(error => {
                    alert(error);
                    return;
                })
        },
        handleSubmit2(e) {
            socialService.unfollowUser(this.$route.params.id)
                .then(result => {
                    alert(result);
                })
                .catch(error => {
                    alert(error);
                    return;
                })
        }
    },
    created() {
        this.user.loading = true;

        socialService.getUser(this.$route.params.id)
            .then((user) => {
                this.user = user;
            })
            .catch(error => this.error = error);

    }
}
</script>