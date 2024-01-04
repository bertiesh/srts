<template>
  <div class="homebox">
  <div class="dynamic">
    <el-row :gutter="20" type="flex">
  <el-col :span="16"><div class="grid-content">
<div class="nav">
          <router-link to="/info/index/userdynamic">动态</router-link>
          <router-link to="/info/index/userarticle">文章</router-link>
          <router-link to="/info/index/userfocus">关注</router-link>
</div>
 <router-view />
    </div></el-col>
  <el-col :span="8">
    <homeright/>
    </el-col>
</el-row>
  </div>
  </div>
</template>

<script>
import homeright from '@/components/homeright.vue'
export default {
  name: '',
  components: {homeright},
  data () {
  return {
    input:''
  }
  },
  mounted () {},
  methods: {
  }
}
</script>
<style lang='scss' scoped>
.homebox{
  margin: 10px 0;
  width: 1040px;
  margin-bottom: 0;
.dynamic{
  padding-top: 10px;
  .grid-content{
    box-shadow: 0 0 4px 1px rgb(238, 238, 238);
    border-radius: 5px;
    .nav{
    display: flex;
  align-items: center;
  background: rgb(255, 255, 255);
  border-bottom: 1px #f0f2f7 solid;
  a{
    padding: 10px 10px;
  }
  .router-link-active{
    color: #409EFF;
    font-weight: 600;
  }
    }
  }
  
}
}

</style>