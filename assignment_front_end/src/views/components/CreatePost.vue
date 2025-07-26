<template>
  <div class="main-div">
    <h1>Create a Post</h1>
    <br>

    <form @submit.prevent="handleSubmit">
      <textarea v-model="input" class="form-control" id="exampleFormControlTextarea1" rows="3"
        placeholder="Enter text..."></textarea>
      <br>
      <button class="btn btn-info">Post</button>
    </form>

  </div>
</template>

<script>
import { postService } from '../../service/posts.service'

export default {
  data() {
    return {
      input: "",
    }
  },
  methods: {
    handleSubmit(e) {
      if (!this.input) {
        alert("Complete the input.");
        return;
      }

      postService.createPost(this.input)
        .then(result => {
          alert("Post Created!");
          this.$router.push("/feed")
        })
        .catch(error => {
          alert(error);
          return;
        })
    }
  }
}
</script>