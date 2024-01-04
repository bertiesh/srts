<template>
  <div class="info">
   <div class="info-top">
    <el-row :gutter="10">
  <el-col :span="16"><div class="grid-content ">
<el-image :src="imageUrl" :lazy="true" fit="cover"> </el-image>
    <div class="top-title">
      <p>{{usermsg.userInfoDTO
.nickname}}</p>
      <p>所在机构：{{usermsg.userInfoDTO
.hospital}}</p>
<p class="integral" @click="openintegral" v-if="showbtn">个人积分：{{totalscores}}</p>
    </div>
    </div></el-col>
  <el-col :span="8">
    <div class="top-btn">
    <el-button @click="update" v-if="showbtn">{{ismsg?"编辑个人资料":"返回上一页"}}</el-button>
    </div>
  </el-col>
</el-row>
   </div>
   <div class="info-bottom">
    <router-view />
   </div>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
import { getUserIntegral } from "@/api/user";
export default {
  name: '',
  components: {},
  data () {
  return {
     imageUrl: "",
     ismsg:true,//是否是编辑个人资料
     showbtn:true,//判断是否是自己
     totalscores:''
  }
  },
  mounted () {
    this.getavatar()
  },
    computed: {
    ...mapGetters(["usermsg","userInfo"]),
  },
  watch: {
    usermsg(to, from) {
      if (to) {
        this.imageUrl =this.usermsg.userInfoDTO.avatar
      }
    },
  },
  methods: {
    // 去个人积分页
    openintegral(){
      this.$router.push({ path: "/info/integral"});
    },
    // 去个人资料也
    update(){
      if (this.ismsg) {
        // 编辑个人资料
        this.$router.push({ path: "/info/infomsg"});
      }else{
        // 个人资料首页
this.$router.push({ path: "/info/index/userdynamic"});
      }
this.ismsg=!this.ismsg
    },
    // 加载头像
    async getavatar() {
// 判断会否是自己
this.showbtn = this.usermsg.userInfoDTO.userInfoId==this.userInfo.userInfoId

const userInfo = await this.$store.dispatch(
        "GetUserInfo",
         this.userInfo.userInfoId
      );
      if (this.showbtn) {
        this.imageUrl = '/api/photos/display?photoPath='+userInfo.userInfoDTO.avatar
      }else{
        this.imageUrl ='/api/photos/display?photoPath='+this.usermsg.userInfoDTO.avatar
      }
      
      // 获取个人积分
      getUserIntegral().then((res)=>{
        const data = res.data.data
        if (data!=false) {
          this.totalscores = res.data.data[0].totalPoints
        }else{
          this.totalscores =0
        }
        
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.info{
  padding: 10px 10%;
  height: 100%;
  min-width: 1040px;
.info-top{
  background: url(@/assets/avatarBg.jpg);
  background-position:0% 100%; 
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 0 3px 1px rgb(221, 221, 221);
  height: 300px;
  display: flex;
  flex-direction: column-reverse;
  .el-col{
 .grid-content{
    display: flex;
  align-items:flex-end;
    .el-image{
       margin: 5px;
      width: 120px;
    height: 120px;
    }

    
    .top-title{
      padding: 10px;
      p{
        padding: 5px 0;
        color: rgba(255, 255, 255, 0.856);
        border-bottom: 1px rgba(165, 42, 42, 0) solid;
      }
      .integral:hover{
        cursor: pointer;
        border-bottom: 1px rgb(255, 255, 255) solid;
      }
    }
  }
  .top-btn{
    text-align: right;
    position: absolute;
    bottom: 10px;
    right: 20px;
    .el-button{
      background: rgba(255, 255, 255, 0);
      color: aliceblue;
    }
  }
  }
 
}
}

</style>