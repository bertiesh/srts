<template>
  <div class="homebox">
  <div>
    <el-input v-model="input" placeholder="请输入内容">
      <el-button slot="append" icon="el-icon-search" @click="searchall(input)"></el-button>
    </el-input>
  </div>
  <div class="dynamic">
    <el-row :gutter="20" type="flex">
  <el-col :span="16"><div class="grid-content">
<div class="nav">
          <router-link to="/home/attention">关注</router-link>
          <router-link to="/home/hotspot">热榜</router-link>
          <router-link to="/home/article">综合</router-link>
          <router-link to="/home/news">新闻</router-link>
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
    // 全文搜索
searchall(value){
  if (value!='') {
    this.$router.push({ path: '/search',query:{
    key:value
  }})
  }else{
    this.$message('请输入内容');
  }
  
}
  }
}
</script>
<style lang='scss' scoped>
.homebox{
  margin: 10px;
  width: 1040px;
  margin-bottom: 0;
.dynamic{
  padding-top: 10px;
  .grid-content{
    box-shadow: 0 0 4px 1px rgb(238, 238, 238);
    border-radius: 4px;
    background: white;
    height: 98%;
    .nav{
    display: flex;
  align-items: center;
  border-bottom: 1px #f0f2f7 solid;
  a{
    padding: 10px 10px;
  }
  .router-link-exact-active{
    color: #409EFF;
    font-weight: 600;
  }
    }
  }
  
}
}

</style>
