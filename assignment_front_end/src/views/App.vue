<template>
  <div>
    <nav class="navbar bg-light border-bottom border-body justify-content-center" data-bs-theme="dark">

      <router-link class="nav-link active me-4" to="/feed"><b>Feed</b></router-link>
      <router-link class="nav-link active me-4" to="/profile"><b>Profile</b></router-link>
      <router-link class="nav-link active me-4" to="/search"><b>Search</b></router-link>
      <router-link class="nav-link active me-5" to="#"></router-link>
      <router-link class="nav-link active me-4" to="/login"><b>Login</b></router-link>
      <router-link class="nav-link active" to="/signup"><b>Sign Up</b></router-link>
      
    </nav>
    <router-view />
  </div>
</template>

<style>
@import '../style.css';
</style>