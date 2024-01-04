<template>
  <div id="app">
    <el-container>
      <el-header height="50px">
        <div class="nav">
          <router-link to="/">
          <img :src="`/api/photos/display?photoPath=${webmsg.websiteAvatar}`" alt="">
          {{webmsg.websiteName}}</router-link>
          <router-link to="/home">首页</router-link>
          <router-link to="/comment">动态</router-link>
          <router-link to="/practise">学习</router-link>
          <router-link to="/live">直播</router-link>
          <router-link target="_blank" to="/store">积分商城</router-link>
        </div>
        <div v-show="userInfo.length==0">
          <el-button type="text" @click="login">登录</el-button>
          |<el-button type="text" @click="login">注册</el-button>
        </div>
        <div v-show="userInfo.length!=0" class="icon">
          <el-tooltip effect="dark" content="创作者中心" placement="bottom">
      <i class="iconfont icon-chuangzuozhezhongxin" @click="creator"></i>
    </el-tooltip>
          <el-tooltip effect="dark" content="消息" placement="bottom">
          <el-badge :value="noticenum==0?'':noticenum" class="item" >
             <i class="iconfont icon-xiaoxizhongxin" @click="usermsg"></i>
          </el-badge>
          </el-tooltip>
          <el-dropdown>
  <el-image :lazy="true" :src="imageUrl" fit="cover"></el-image>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item @click.native="info">我的主页</el-dropdown-item>
    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getAllNotices } from "@/api/message/index";
export default {
  name: '',
  components: {
  },
  data() {
    return {
      imageUrl: "",
        ishow:true,
        userdata:{},
        noticenum:0,
        }
  },
  computed: {
    ...mapGetters(["userInfo","webmsg"]),
  },
  created() {
    this.getavatar();
  },
   methods:{
    // 用户信息
    usermsg(){
      this.$router.push({ path: "/message" });
      this.noticenum = 0
    },
    // 创作者中心
    creator(){
let routeData = this.$router.resolve({ 
		path: "/creator"
	});
  window.open(routeData.href, '_blank');
    },
    // / 个人信息
    info(){
      this.$store.commit('SET_USER_MSG', this.userdata)
      this.$router.push({ name: "个人动态"});
      
    },
    // 登录
    login(){
      this.$router.push({path:"/login"})
    },
     // 退出登录
    logout() {
      this.$confirm("确定退出登录吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch(() => {});
    },
    // 加载头像
    async getavatar() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
     this.imageUrl=userInfo.userInfoDTO.avatar='/api/photos/display?photoPath='+userInfo.userInfoDTO.avatar
      this.userdata = userInfo
      // 获取未读消息
getAllNotices().then((res) => {
            for (const key in res.data.data) {
            this.noticenum += res.data.data[key]
            }
          });
    },
  }
  
}
</script>
<style lang="scss" scoped>
.el-container{
  min-width: 1040px;
  height: 100%;
  .el-header {
    position: fixed;
    width: 100%;
    background: white;
  box-shadow: 0 0 5px 1px rgb(228, 228, 228);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  z-index: 999;
  a{
    font-size: 15px;
  }
  .nav {
    
    a{
margin-left: 20px;
    }
    img{
      width: 30px;
      margin-bottom: -5px;
    }
  .router-link-active{
    color: #409EFF;
  }
  
  }
  .el-button--text{
    color: black;
  }
  .icon{
    display: flex;
    align-items: center;
.icon-chuangzuozhezhongxin{
font-size: 23px;
color: #555555;
cursor: pointer;
margin-right: 20px;
}
.item{
cursor: pointer;
  .icon-xiaoxizhongxin{
  font-size: 23px;
}
:deep(.el-badge__content){
  font-size: 1px;
    height: 14px;
    line-height: 14px;
    padding: 0 3px;
}
margin-right: 30px;
}

.el-dropdown{
  height: 35px;
  .el-image{
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  .el-dropdown-menu__item{
    text-align: center;
  }
}
  }
}
.el-main{
  background: #f7f8fa;
  padding: 0;
  padding-top: 50px;
  display: flex;
  justify-content: center;
}
 
}
</style>