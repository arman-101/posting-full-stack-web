<template>
    <div class="main-div">
        <h2>Post is liked by:</h2>

        <br>

        <ul class="list-group" v-if="post.likes.length">
            <li class="list-group-item" v-for="author in post.likes" :key="author.user_id">
                <router-link :to="'/users/' + author.user_id">
                    <p>{{ author.username }}</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { postService } from '../../service/posts.service'

export default {
    data() {
        return {
            post: {},
            error: "",
        }
    },
    created() {
        this.post.loading = true;

        postService.getSinglePost(this.$route.params.id)
            .then((post) => {
                this.post = post;
            })
            .catch(error => this.error = error);

    }
}
</script>