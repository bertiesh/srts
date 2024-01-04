<template>
  <div class="homebox">
  <div class="dynamic">
    <el-row :gutter="20" type="flex">
  <el-col :span="16"><div class="grid-content">
<div class="nav">
  <el-badge :value="notice['评论未读']==0?'':notice['评论未读']" class="item" >
          <router-link to="/message/mycomment">评论</router-link>
  </el-badge>
  <el-badge :value="notice['关注未读']==0?'':notice['关注未读']" class="item" >
          <router-link to="/message/myfocus">关注</router-link>
  </el-badge>
          <el-badge :value="notice['点赞未读']==0?'':notice['点赞未读']" class="item" >
          <router-link to="/message/mylike">点赞</router-link>
          </el-badge>
          <el-badge :value="notice['通知未读']==0?'':notice['通知未读']" class="item" >
          <router-link target="_blank" to="/message/mymsg">我的私信</router-link>
          </el-badge>
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
import { getAllNotices } from "@/api/message/index";
export default {
  name: '',
  components: {homeright},
  data () {
  return {
    notice:{}
  }
  },
  mounted () {
    this.onload()
  },
  watch: {
    $route(to, from) {
      if (to.matched[1].path=='/message') {
      const index = to.name.substr(-2)+"未读"
      this.notice[index] = 0
      }
    },
  },
  methods: {
    onload(){
      const index = this.$route.name.substr(-2)+"未读"
      getAllNotices().then((res) => {
            this.notice = res.data.data
            this.notice[index] = 0
          });
    
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
    border-radius: 5px;
    .nav{
      height: 60px;
    display: flex;
  align-items: center;
  background: rgb(255, 255, 255);
  .item{
margin-right: 15px;
:deep(.el-badge__content){
  font-size: 1px;
    height: 14px;
    line-height: 14px;
    padding: 0px 4px;
        top: 10px;
    right: 8px;
}


  }
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