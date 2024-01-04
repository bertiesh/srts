<template>
  <div id="app">
    <el-container>
      <el-header height="50px">
        <div class="nav">
          <img src="@/assets/logo.png" alt="" @click="$router.push({path:'/home'})">
          <router-link to="/store/pointsmall">
          积分商城</router-link>
          <router-link to="/store/shopping">我的购物车</router-link>
          <router-link to="/store/mycenter">个人中心</router-link>
        </div>
        <div class="icon">
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
export default {
  name: '',
  components: {
  },
  data() {
    return {
      imageUrl: "",
        ishow:true,
        userdata:{}
        }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getavatar();
  },
   methods:{
    // / 个人信息
    info(){
      this.$store.commit('SET_USER_MSG', this.userdata)
      this.$router.push({ name: "个人动态"});
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
    },
  }
  
}
</script>
<style lang="scss" scoped>
.el-container{
  min-width: 1200px;
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
      cursor: pointer;
    }
  .router-link-active{
    color: #f60;
  }
  
  }
  .el-button--text{
    color: black;
  }
  .icon{
    display: flex;
    align-items: center;
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