<template>
  <div class="rebgbox">
<router-view />
  </div>
</template>

<script>
// import Loginpage from "@/components/loginpage.vue";
// import Register from "@/components/register.vue";
export default {
  name: "",
  components: {
    // Loginpage,
    // Register
  },
  data() {
    return {
      // islogin:true,
      // activate:false
    };
  },
  mounted() {
  },
  methods: {
// closelogin(value){
//   this.islogin = value
// },
// closeregister(value){
// this.islogin = value
// this.activate = !value
// },
// close(value){
// this.activate = value
// },
  },
};
</script>

<style lang="scss" scoped>
.rebgbox {
  width: 100%;
  height: 100%;
  background:#049ec4;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
