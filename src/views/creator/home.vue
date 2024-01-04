<template>
  <!-- 创作者中心首页 -->
  <div class="creator">
     <div class="head">
      <div class="tohome">
        <div @click="gohome"><img src="@/assets/logo.png" /> 培训系统</div><span>创作者中心</span>
      </div>
      <div class="icon">
        <el-tooltip effect="dark" content="消息" placement="bottom">
          <el-badge is-dot class="item">
            <i class="iconfont icon-xiaoxizhongxin" @click="usermsg"></i>
          </el-badge>
        </el-tooltip>
        <el-dropdown>
          <el-image :lazy="true" :src="imgurl" fit="cover"></el-image>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="info">我的主页</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div> 
    <div class="body">
      <div class="main">
        <div class="body-left">
          <div class="msg">
            <div class="msg-title" @click="info">
              <el-image :src="imgurl" lazy fit="cover"></el-image>
              <span>{{nickname}}</span>
            </div>

            <div class="btn" @click="writing">写文章</div>
          </div>
          <div class="menu-box">
        <el-menu :default-openeds='openeds' default-active="1">
                <el-menu-item index="1" @click="open('first')">
                <i class="iconfont icon-shouye"></i>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="iconfont icon-shuju9"></i>
                  <span>内容管理</span>
                </template>
                <el-menu-item index="2-1" @click="open('posts')">
                <span slot="title">文章管理</span>
              </el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                 <i class="iconfont icon-bangzhu"></i>
                  <span>帮助中心</span>
                </template>
                <el-menu-item index="3-1" @click="open('question')"> 
                <span slot="title">常见问题</span>
              </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </div>
        <div class="body-right">
            <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      imgurl:'',
      ishow: true,
      userdata: {},
      nickname:'',
      openeds:['2','3','4']
    };
  },
  created() {
    this.getavatar();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 去培训系统首页
    gohome(){
this.$router.push({ path: "/home/article" });
    },
    // 写文章
    writing(){
      let routeData = this.$router.resolve({ 
		path: "/creator/drafts"
	});
  window.open(routeData.href, '_blank');
    },
    // 目录导航
    open(value){
this.$router.push({ path: `/creator/${value}` });
    },
    // 用户信息
    usermsg() {
      this.$router.push({ path: "/message" });
    },
    // / 个人信息
    info() {
      this.$store.commit("SET_USER_MSG", this.userdata);
      this.$router.push({ name: "个人动态" });
    },
    // 登录
    login() {
      this.$router.push({ path: "/login" });
    },
    // 退出登录
    logout() {
      this.$confirm("确定退出登录吗？", "提示", {
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
      this.imgurl=userInfo.userInfoDTO.avatar = 'api/photos/display?photoPath='+userInfo.userInfoDTO.avatar
      this.userdata = userInfo
      this.nickname = userInfo.userInfoDTO.nickname
    },
  },
};
</script>
<style lang='scss' scoped>
.creator {
  height: 100%;
  
  .head {
    box-shadow: 0 0 4px 1px rgb(238, 238, 238);
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    .tohome {
      display: flex;
      div{
        font-size: 18px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 33px;
        margin-right: 5px;
      }
      }
      
      
      span {
        font-size: 16px;
        margin-left: 10px;
        color: #1d7dfa;
      }
    }
    .icon {
      display: flex;
      align-items: center;
      .icon-chuangzuozhezhongxin {
        font-size: 22px;
        color: #555555;
        cursor: pointer;
        margin-right: 20px;
      }
      .item {
        cursor: pointer;
        .icon-xiaoxizhongxin {
          font-size: 20px;
        }
        margin-right: 30px;
      }

      .el-dropdown {
        height: 35px;
        .el-image {
          width: 35px;
          height: 35px;
          cursor: pointer;
        }
        .el-dropdown-menu__item {
          text-align: center;
        }
      }
    }
  }
  .body {
    min-width: 1040px;
    background: #f4f5f5;
    height: calc(100% - 91px);
    display: flex;
    justify-content: center;
    padding: 20px 0;
 overflow-y: scroll;
    .main {
      width: 1040px;
      display: flex;
      margin: 0 10px;
      .body-left {
        background: white;
        border-radius: 2px;
        padding: 20px 0px;
        width: 220px;
        margin-right: 20px;
        .msg {
            padding: 0 10px;
          .msg-title {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            cursor: pointer;
            .el-image {
              width: 45px;
              height: 45px;
              cursor: pointer;
              margin-right: 15px;
            }
            .el-button {
              width: 100%;
            }
          }
          .btn {
            background: #1d7dfa;
            border-radius: 2px;
            padding: 8px 20px;
            text-align: center;
            color: white;
            cursor: pointer;
            font-size: 15px;
            margin-bottom: 20px;
          }
          .btn:hover {
            background: #1673ec;
          }
        }
        .menu-box{
            height: calc(100% - 140px);
            overflow-y: scroll;
            overflow-x: hidden;
            margin-left: 7px;
            .el-menu{
                width: 100%;
                .iconfont{
                    margin-right: 5px;
                }
            }
        }
      }
      .body-right {
        width: 800px;
        border-radius: 2px;
        overflow: hidden;
      }
    }
  }
}
</style>