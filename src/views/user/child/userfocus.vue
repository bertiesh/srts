<template>
    <div>
<div class="nav">
          <router-link to="/info/index/userfocus/myattention">关注</router-link>
          <router-link to="/info/index/userfocus/focusme">粉丝</router-link>
</div>

 <router-view />
    </div>
</template>

<script>
export default {
    name: '',
    components: {},
    data () {
    return {
    }
    },
    mounted () {},
    methods: {}
}
</script>
<style lang='scss' scoped>
.nav{
    display: flex;
  align-items: center;
  background: rgb(255, 255, 255);
  padding: 10px;
  a{
    padding: 10px 10px;
    font-size: 15px;
  }
  .router-link-exact-active{
    color: #409EFF;
    font-weight: 600;
  }
    }
</style>