<template>
  <div class="article">
    <el-tabs v-model="search.status" @tab-click="handleClick">
      <el-tab-pane name="1">
        <template slot="label">文章</template>
        <el-tabs v-model="search.isReview" @tab-click="handleClick"> 
          <el-tab-pane name="0">
            <template slot="label"> 全部({{allstatistics[1]}}) </template>
          </el-tab-pane>
          <el-tab-pane name="3">
            <template slot="label"> 已发布({{allstatistics[4]}}) </template>
          </el-tab-pane>
          <el-tab-pane name="1">
            <template slot="label"> 审核中({{allstatistics[2]}}) </template>
          </el-tab-pane>
          <el-tab-pane name="2">
            <template slot="label"> 未通过({{allstatistics[3]}}) </template>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane name="2">
        <template slot="label"> 草稿箱({{allstatistics[0]}}) </template>
        </el-tab-pane>
    </el-tabs>
    <div class="item-box" v-loading="loading" v-infinite-scroll="load">
     <div class="item" @click="openarticle($event,item.id)" v-for="(item, index) in allData"
      :key="index">
              <p> <span>{{item.articleTitle}}</span> 
              
              <el-dropdown>
      <span class="el-dropdown-link">
        <i class="iconfont icon-xianxingtubiaozhizuomoban-25"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="redact(item.id)">编辑</el-dropdown-item>
        <el-dropdown-item @click.native="remove(item.id)">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
               </p>
              <div class="item-time">
                <span class="time">{{item.createTime}}</span>|
                <span >{{item.commentsCount==null?0:item.commentsCount}}评论<i class="iconfont icon-yuandian"></i>{{item.likeCount==null?0:item.likeCount}}点赞</span>
              </div>
            </div>
            <el-empty v-if="!allData" description="暂无内容"></el-empty>
    </div>
    
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getAllArticle,deleteArticle,getAllStatistics } from "@/api/creator/index";
export default {
  name: "",
  components: {},
  data() {
    return {
      search:{status:"1",isReview:'0'},
      allData: [],
      allstatistics:[],//所有总数统计
      total: 0, //总条数
      pagesize: 5, //条数
      current: 1, //页码
      loading:true,
    };
  },
  mounted() {
    this.onLoad();
  },
    computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    load(){
            if (this.pagesize<=this.total) {
                this.pagesize+= 10
            this.onload()
            }else{
                return
            }
        },
    // 编辑文章
    redact(id){
 let routeData = this.$router.resolve({ 
		path: "/creator/drafts",query:{id}
	});
  window.open(routeData.href, '_blank');
    },
    // 删除文章
    remove(id){
       this.$confirm("确定删除文章吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          
         deleteArticle(id).then((res)=>{
this.$message({
          message: '删除成功',
          type: 'success'
        });

}).catch((err) => {
  this.$message.error(err);
});
        })
        .catch(() => {});

    },
    // 打开文章
    openarticle(event,id){
if (event.target.className!="iconfont icon-xianxingtubiaozhizuomoban-25") {
  this.$router.push({ path: `/article/detail/${id}`})
}
    },
    handleClick(tab, event) {
        this.onLoad()
      },
    // 进入加载
    onLoad() {
      const data = {
        current:this.current,
        size:this.pagesize,
        userInfoId:this.userInfo.userInfoId,
        status:this.search.status,
        isReview:this.search.isReview
      }
      if (data.isReview==0||data.status==2) delete data.isReview
      // 
      // 全部
      getAllArticle(data).then((res) => {
        this.allData = res.data.data.recordList;
        this.total = res.data.data.count
        this.loading =false
      });
      getAllStatistics().then((res) => {
        this.allstatistics=res.data.data
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.article {
  background: rgb(255, 255, 255);
  padding: 20px;
  padding-bottom: 5px;
  padding-right: 0;
  color: #86909c;
  height: 100%;
  .el-tabs {
    margin-right: 20px;
    :deep(.el-tabs__item) {
      color: #86909c;
    }
    :deep(.is-active){
        color: #409EFF;
       }
    .el-tabs {
      :deep(.el-tabs__item::after) {
        content: "";
        display: inline-block;
        width: 1px;
        height: 15px;
        background: #86909c;
        position: relative;
        top: 3px;
        left: 19px;
      }
      :deep(.el-tabs__item:nth-last-child(1)::after) {
        background: #30313300;
      }
      :deep(.el-tabs__nav-wrap::after) {
        height: 0px;
      }

      :deep(.el-tabs__active-bar) {
        background-color: transparent !important;
      }
      
    }
  }
  .item-box{
    height: calc(100% - 148px);
    overflow-y: scroll;
    .item {
      margin-right: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(180, 180, 180, 0.589);
        cursor: pointer;
        p {
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          .iconfont{
            font-size: 20px;
          }
          .iconfont:hover{
        background: #dddddd;
          }
        }
        .item-time {
          font-size: 14px;
          .time{
            margin-right: 15px;
          }
        }
      }
      .item:hover{
        background: #f8f6f660;
      }
  }
  
}
</style>