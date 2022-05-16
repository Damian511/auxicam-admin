<template>
  <div class="m-3">
    <h1>Dashboard</h1>
    <div class="card">
    </div>
  </div>
</template>

<script>
import User from "../apis/User";
export default {
  data() {
    return {
      user: null,
      date:null
    };
  },
  created() {
    User.auth().then(response => {
      this.user = response.data;
    });
  }
};
</script>