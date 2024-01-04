<template>
<!-- 首页-文章 -->
  <div class="discussion-box" v-loading="isimg">
<el-row v-for="(item, index) in tableData"
      :key="index">
  <el-col :span="2">
    <h4 :class="index<3?'bg':''">{{index+1}}</h4> 
  </el-col>
  <el-col :span="22">
    <h2 @click="open(item.id)">{{item.articleTitle}}</h2>
    <p :title="item.articleTitle" class="articleContent" @click="open(item.id)">{{item.articleContent}}</p>
        <p class="liulanliang"><i class="iconfont icon-liulanliang"></i>浏览量{{item.viewsCount}}</p>
  </el-col>
</el-row>
    <div :class="isall ? 'unload' : 'load'" v-show="isload"><el-divider v-if="isall"> 只有这些内容了 </el-divider></div>
  </div>
</template>

<script>
import { getAllNewsList} from "@/api/home/child/news";
export default {
  name: "",
  components: {},
  data() {
    return {
      total: 0, //总条数
      pagesize: 5, //条数
      current: 1, //页码
      pagination:0,//页数
      tableData: [],
      isload: false, //加载动画
      isall: false,
      isimg:true
    };
  },
  created() {
    this.onLoad(this.current);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll,true);
  },
  methods: {
    // 监听窗口滚动
   handleScroll(e){
      const scrollheight = e.target.clientHeight+e.target.scrollTop
      const height = e.target.scrollHeight
      if (scrollheight >= height) {
        this.isload =true
        this.current+=1
        if (this.current<=this.pagination) {
          this.isall = false
         getArticleList(this.pagesize, this.current).then((res) => {
        const data = res.data.data;
this.tableData=this.tableData.concat(data.recordList);
      this.total = data.count;
      });
         return
          }else{
            this.isall = true
            return
          }
      }
    },
    open(id) {
      this.$router.push({ path: `/article/detail/${id}` });
    },
    // 进入加载
    onLoad(value) {
      const pagesize = this.pagesize;
      getAllNewsList(pagesize, value).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
        this.pagination = Math.ceil(this.total / this.pagesize);
        this.isimg = false
      });
    },
  },
  beforeDestroy() { 
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll,true);
  },
};
</script>
<style lang='scss' scoped>
.discussion-box {
  height: calc(100% - 41px);
  .load {
    width: 100%;
    height: 40px;
    background: url(@/assets/loging.gif);
    background-size: 400px;
    background-position: 120px -125px;
  }
  .el-row{
border-top: 1px #f0f2f7 solid;
padding: 10px 0;
        .el-col-2{
        padding-top: 5px;
        text-align: center;
        .bg{
            color: #ff9607;
        }
    }
    .el-col-22{
        padding-right: 20px;
        h2{
            font-size: 17px;
            padding: 5px 0;
            cursor: pointer;
        }
        
.articleContent{
    color: #535353;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
     white-space: nowrap;
     padding: 5px 0;
     cursor: pointer;
}
.liulanliang{
color: #999999;
font-size: 13px;
.icon-liulanliang{
    margin-right: 5px;
    font-size: 15px;
}
}
    }
    }
  .unload {
   padding-bottom: 25px;
  }
}
</style>