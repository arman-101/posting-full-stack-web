<template>
  <div class="main-div">

    <div class="row">
      <div class="col-6">
        <h1>Feed - {{ posts.length }}</h1>
      </div>
      <div class="col-6 post-div">
        <form @submit.prevent="handleSubmit" class="text-md-end">
          <button class="btn btn-info">Create a Post</button>
        </form>
      </div>
    </div>

    <br>

    <em v-if="loading && posts.length">Loading posts...</em>

    <ul class="list-group" v-if="posts.length">
      <li class="list-group-item" v-for="post in posts" :key="post.post_id">
        <router-link :to="'/posts/' + post.post_id">
          {{ post.text }}
        </router-link>
      </li>
    </ul>

    <!-- <div v-if="error">
      {{ error }}
    </div> -->

  </div>
</template>

<script>
import { postService } from '../../service/posts.service'

export default {
  data() {
    return {
      posts: [],
      error: "",
      loading: true,
    }
  },
  methods: {
    handleSubmit(e) {
          this.$router.push("/post")
    }
  },
  mounted() {
    postService.getFeed()
      .then(posts => {
        this.posts = posts
        this.loading = false
      })
      .catch(error => this.error = error);
  }
}
</script>