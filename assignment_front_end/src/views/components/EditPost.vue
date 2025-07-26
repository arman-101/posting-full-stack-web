<template>
    <div class="main-div">
      <h1>Edit this Post</h1>
      <br>
  
      <form @submit.prevent="handleSubmit">
        <textarea v-model="input" class="form-control" id="exampleFormControlTextarea1" rows="3"
          placeholder="Enter text..."></textarea>
        <br>
        <button class="btn btn-info">Update</button>
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
  
        postService.editPost(this.$route.params.id, this.input)
          .then(result => {
            alert("Post Updated!");
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