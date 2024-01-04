<template>
  <div class="box">
<header>
  <div class="video" v-if="livedata.liveUrl">
<videoPlayer  :url="`/api/files/display?filePath=${livedata.liveUrl}`" :ishls='livedata.isLive!=2' :poster="`/api/photos/display?photoPath=${livedata.cover}`"></videoPlayer>
  </div>
</header>
<div class="body">
<div class="live">
<div class="live-head"><i class="iconfont icon-zhibo"></i><span class="live-head-title">直播列表</span></div>
<div class="live-nav">
<div class="live-nav-type">
<span class="live-nav-title">直播类型：</span>
<ul>
  <li :class="search.type==null?'active':''" @click="changenav('type',null)">全部</li>
  <li :class="search.type==1?'active':''" @click="changenav('type',1)">内窥镜</li>
  <li :class="search.type==2?'active':''" @click="changenav('type',2)">三方接口</li>
</ul>
</div>
<div class="live-nav-type">
<span class="live-nav-title">直播状态：</span>
<ul>
  <li :class="search.status==null?'active':''" @click="changenav('status',null)">全部</li>
  <li :class="search.status==1?'active':''" @click="changenav('status',1)">直播中</li>
  <li :class="search.status==0?'active':''" @click="changenav('status',0)">预告</li>
  <li :class="search.status==2?'active':''" @click="changenav('status',2)">已结束</li>
</ul>
</div>
</div>
<div class="live-list">
  <div class="isload" v-show="isimg"></div>
  <ul class="live-list-ul">
<li class="live-list-li" v-for="item in tableData" :key="item.id" @click="opendetail(item)">
  <el-image
      style="width: 270px; height: 150px;border-radius: 4px;"
      :src="`/api/photos/display?photoPath=${item.cover}`"
      fit="cover" lazy></el-image>
      <p class="live-list-name" :title="item.name">{{item.name}}</p>
      <p  class="live-list-time">{{item.startTime}}</p>
</li>
  </ul>
  <div :class="isall ? 'unload' : 'load'" v-show="isload">
        <el-divider v-if="isall"> 只有这些内容了 </el-divider>
      </div>
</div>

</div>

</div>
<homefooter />
  </div>
</template>

<script>
import { getLiveList} from "@/api/live/index";
import videoPlayer from "@/components/PlaeryVideo.vue";
import homefooter from "@/components/homefooter.vue";
export default {
  name: '',
  components: {videoPlayer,homefooter},
  data () {
  return {
    livedata:{},//页面大图
    total: 0, //总条数
      pagesize: 28, //条数
      current: 1, //页码
      tableData: [], //我的订单
      isload: false, //加载动画
      isall: false,
      search: {}, //搜索内容
      isimg: true,
  }
  },
  mounted () {
    this.onload()
    window.addEventListener("scroll", this.handleScroll, true);
  },
  watch: {
    $route(to, from) {
     if (to.query.id!=from.query.id) this.onload()
    },
  },
  methods: {
    // 监听窗口滚动
    handleScroll(e) {
      const scrollheight = e.target.clientHeight + e.target.scrollTop;
      const height = e.target.scrollHeight;
      if (scrollheight >= height) {
        this.isload = true;
        if (this.pagesize >= this.total) {
          this.isall = true;
          return;
        } else {
          this.pagesize = this.pagesize + 5;
          this.isall = false;
          this.getalllist();
          return;
        }
      }
    },
    // 导航切换
    changenav(name,num){
this.search[name]=num
this.getalllist()
    },
    // 进入直播间
    opendetail(data){
this.$router.push({ path:'/live/livedetail' ,query:{id:data.id,isLive
:data.isLive}});
    },
    getalllist(){
 const data = {
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
        status: this.search.status,
        type:this.search.type
      };
      getLiveList(data).then((res)=>{
  this.tableData = res.data.data.recordList
    this.isimg = false;
})
    },
    onload(){
      
        // 获取最近直播
        getLiveList().then((res)=>{
    this.livedata = res.data.data.recordList[1]
})
      
this.getalllist()
    }
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll, true);
  },
}
</script>
<style lang='scss' scoped>
.box{
  width: 100%;
  header{
    height: 620px;
    background: #232323;
    width: 100%;
    display: flex;
        justify-content: center;
    align-items: center;
    .video{
      width: 1040px;
    }
  }
  .body{
    display: flex;
    justify-content: center;
    padding-top: 20px;
    margin-bottom: 20px;
    .live{
      width: 1160px;
      background: white;
      border-radius: 4px;
      padding: 20px;
      .live-head{
        margin-bottom: 15PX;
        .icon-zhibo{
        font-size: 20px;
      }
      .live-head-title{
        font-size: 20px;
font-weight: 600;
line-height: 32px;
color: #252933;
margin-left: 15px;
      }
      }
     .live-nav{
      margin-bottom: 20px;
      .live-nav-type{
        display: flex;
            align-items: center;
            margin-bottom: 10px;
.live-nav-title{
  font-size: 15px;
line-height: 2rem;
color: #252933;
margin-right: 8px;
}
ul{
  list-style: none;
  display: flex;
      align-items: center;
      font-size: 15px;
      li{
        padding: 2px 8px;
border-radius: 4px;
cursor: pointer;
transition: all .15s linear;
margin-right: 15px;
      }
      li:hover{
        background: #f2f3f5;
      }
      .active{
background: #eaf2ff;
color: #1e80ff;
      }
}
      }
     } 
     .live-list{
      .isload {
      height: 600px;
      background: url(@/assets/load.gif)
        no-repeat;
      background-size: 300px;
      background-position: 420px 100px;
      background-color: white;
    }
      .live-list-ul{
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        .live-list-li{
          width: 270px;
          margin-right: 20px;
          margin-bottom: 20px;
          .el-image{
:deep(.el-image__inner){
transition: all .5s ease .1s;
}
:deep(.el-image__inner:hover){
  transform: scale(1.05);
}
          }
         .live-list-name{
          white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
color: #252933;
font-weight: 500;
padding: 10px 0;
         } 
         .live-list-name:hover{
          color: #1e80ff;
        }
        .live-list-time{
          color: #8a919f;
font-size: 15px;
        }
        }
        .live-list-li:hover{
          cursor: pointer;
        }
      }
      .load {
      width: 100%;
      height: 40px;
      background: url(@/assets/logining.gif);
      background-size: 100px;
      background-repeat: no-repeat;
      background-position: 500px 0;
    }
    .unload {
      height: 40px;
    }
     }
    }
  }
}
</style>