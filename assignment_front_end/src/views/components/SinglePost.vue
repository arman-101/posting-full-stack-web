<template>
  <div class="main-div">

    <h2>Post</h2>

    <br>

    <em class="list-group" v-if="post.loading">Loading post...</em>

    <div class="p-3 bg-info bg-opacity-10 border border-info border-start rounded" v-else>

      <p class="list-group-item"> Author:
        <router-link :to="'/users/' + post.author.user_id">
          {{ post.author.first_name + " " + post.author.last_name }}
        </router-link>
      </p>

      <p class="list-group-item">Text: {{ post.text }}</p>

      <p class="list-group-item">Date: {{ post.timestamp }}</p>

      <p class="list-group-item">
        Number of likes:
        <router-link :to="'/likes/' + post.post_id">
          {{ post.likes.length }}
        </router-link>
      </p>
    </div>

    <br>

    <div class="list-group">
      <div class="row">
        <!-- Left Side -->
        <div class="col-md-6">
          <form @submit.prevent="handleSubmit1">
            <button class="btn btn-info">Like</button>
          </form>

          <br>

          <form @submit.prevent="handleSubmit2">
            <button class="btn btn-danger">Unlike</button>
          </form>
        </div>

        <!-- Right Side -->
        <div class="col-md-6">
          <form @submit.prevent="handleSubmit3">
            <button class="btn btn-info">Edit</button>
          </form>

          <br>

          <form @submit.prevent="handleSubmit4">
            <button class="btn btn-danger">Delete</button>
          </form>
        </div>
      </div>
    </div>


    <br>

    <!-- <div class="list-group">
      <div class="p-3 bg-info bg-opacity-10 border border-info border-start rounded">
        <p class="list-group-item">All post info (for debugging during development):</p>
        <p class="list-group-item">{{ post }}</p>
      </div>
    </div>

    <div class="list-group-item" v-if="error">
      {{ error }}
    </div> -->

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
  methods: {
    handleSubmit1(e) {
      postService.likePost(this.$route.params.id)
        .then(result => {
          alert(result);
        })
        .catch(error => {
          alert(error);
          return;
        })
    },
    handleSubmit2(e) {
      postService.unlikePost(this.$route.params.id)
        .then(result => {
          alert(result);
        })
        .catch(error => {
          alert(error);
          return;
        })
    },
    handleSubmit3(e) {
      this.$router.push("/editpost/" + this.$route.params.id)
    },
    handleSubmit4(e) {
      postService.deletePost(this.$route.params.id)
        .then(result => {
          alert(result);
          this.$router.push("/feed");
        })
        .catch(error => {
          alert(error);
          return;
        })
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