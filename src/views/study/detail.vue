<template>
<!-- 合集详情页 -->
<div class="study-detail">
   <div class="box">
    <div class="document">
      <div class="document-header">
        <el-image :src="`api/photos/display?photoPath=${documentlist.fileCollectionCover}`" :lazy="true" fit="cover"> </el-image>
        <div class="header-concent">
          <h2><span @click="open(0)">{{documentlist.fileCollectionName}}</span></h2>
          <p>{{documentlist.collectionDesc}}</p>
          <div class="bottom">
            <el-button type="text" @click="open(0)">{{documentlist.notPurchased==1?$route.query.status+'积分 立即兑换':'立即阅读'}}</el-button>
            <div class="bottom-right">
              <span>{{documentlist.viewsCount}}人浏览</span>
            <el-button type="text" v-if="havexercises" @click="openexam(documentlist.projectIdList)">自我测试</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="catalogue-box">
        <!-- 目录 -->
          <div class="catalogue left">
            <p class="title"><span>目录</span></p>
            <el-row v-for="(item, index) in documentlist.fileInfoList" :key="index">
              <el-col :span="1"
                ><div class="grid-content">{{ index + 1 }}</div></el-col
              >
              <el-col :span="23"
                ><div class="grid-content" @click="open(index)">
                  <p class="plan">
                    <span>{{item.fileName}}</span
                    >
                  </p>
                  <i :class="item. isHistory?'iconfont icon-ai210':'iconfont icon-yuanquan'"></i>
                  </div
              ></el-col>
            </el-row> 
          </div>
          <!-- 推荐 -->
          <div class="catalogue right">
            <div class="right-box">
              <p class="title"><span>推荐小册</span></p>
            <div v-for="(item, index) in documentlist.fileRecommendInfoList" :key="index" class="recommend" @click="openread(item)">
            <el-image :src="item.collectionCover" :lazy="true" fit="cover"> </el-image>
            <div class="book">
              <p class="book-name">{{item.collectionName}}</p>
              <p class="book-concent">{{item.collectionDesc}}</p>
            </div>
            
            </div>
            </div>
            
          </div>
      </div>
    </div>
</div>
 <homefooter />
  </div>
</template>
<script>
import { getDocumentDetails,haveDoneExercise } from "@/api/study/document";
import homefooter from "@/components/homefooter.vue";
export default {
  name: "",
  components: { homefooter },
  data() {
    return {
      documentlist:{},
      recommendlist:[],
      havexercises:false
    };
  },
  watch: {
    $route(to, from) {
      if (from.path != to.path) {
        window.location.reload();
      }
    },
  },
  mounted() {
    this.onload();
  },
  methods: {
    // 打开习题页面
    openexam(id){
haveDoneExercise(id).then((res)=>{
  if (res.data.data!=null) {
          let routeData = this.$router.resolve({ 
		path: '/practise/examination',query: {
          id:id[0]
        }
	});
  window.open(routeData.href, '_blank');
  }else{
    this.$message.error('此练习不允许二次查看!');
  }
          }).catch((err)=>{
            if (err=='Error: 未作答') {
                          let routeData = this.$router.resolve({ 
		path: '/practise/examination',query: {
          id:id[0]
        }
	});
  window.open(routeData.href, '_blank');
            }else{ 
            this.$message.error(err); 
            }
          })
    },
    // 通过推荐小册进入文档页面
    openread(item) {
      this.$router.push({path:`/practise/detail/${item.id}`,query:{status:item.status}});
    },
    // 进入阅读页面
    open(index){
      if (this.documentlist.notPurchased==1) {
        this.$confirm('此文档需要'+this.$route.query.status+'积分, 是否兑换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exchangeDocument({collectionIdList:[item.status]}).then((res)=>{
this.$message.success('兑换成功!');
          }).catch((err)=>{
            this.$message.error(err); 
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消兑换'
          });          
        });
      }else{
        let routeData = this.$router.resolve({ 
		path: `/book/${index}/read`,query: {
          id:this.$route.params.id
        }
	});
  window.open(routeData.href, '_blank');
      }
      
    },
    
    onload() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      getDocumentDetails(this.$route.params.id).then((res) => {
        const data = res.data.data
        data.fileRecommendInfoList.forEach(element => {
          element.collectionCover = '/api/photos/display?photoPath='+element.collectionCover
        });
this.havexercises=data.projectIdList==null?false:true
             this.documentlist = data;
             loading.close()
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.study-detail{
  width: 100%;
  
}
.box {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .document {
    align-self: center;
    width: 1040px;
    padding-top: 20px;
    .document-header {
      background: white;
      margin-bottom: 20px;
      padding: 10px;
      display: flex;
      .el-image {
        width: 130px;
        height: 180px;
        border-radius: 2px;
        margin-right: 20px;
      }
      .header-concent {
        margin-left: 10px;
        width: 100%;
        h2 {
          margin: 20px 0;
          span{
            cursor: pointer;
          }
          span:hover{
            color: #1e80ff;
          }
        }
        p{
          margin: 20px 0;
        }
        .bottom{
         display: flex;
         justify-content: space-between;
         width: 90%;
         .el-button{
          font-size: 16px;
         }
         span{
          color: rgb(81, 87, 103);
          font-size: 14px;
         }
         .bottom-right{
          display: flex;
          flex-direction: column;
          .el-button{
          font-size: 14px;
         }
         }
        }
      }
    }

    .catalogue-box{
      display: flex;
      justify-content: space-between;
      .left{
        width: 770px;
         min-height: 100%;
         background: white;
        .el-row {
          .grid-content {
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            .plan {
              cursor: pointer;
            }
            .icon-yuanquan {
              color: #8a919f;
              font-size: 22px;
              align-self: center;
              cursor: pointer;
            }
          }
        }
        .el-row:hover {
          background: #f4f5f5;
        }
      }
      .right{
        .right-box{
background: white;
        .recommend{
          padding: 10px;
          margin: 10px 0;
          display: flex;
          .el-image {
        width: 70px;
        height: 100px;
        flex-shrink: 0;
      }
      .book{
        margin-left: 10px;
        p{
          width: 150px;
          display: -webkit-box;
overflow: hidden;
text-overflow: ellipsis;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
        }
        .book-name{
          font-weight: 500;
font-size: 14px;
color: #252933;
        }
        .book-name:hover{
          color: #409EFF;
          cursor: pointer;
        }
        .book-concent{
          margin-top: 12px;
font-size: 12px;
color: #8a919f;
        }
      }
      
        }
        .recommend:hover{
        background: #f4f5f5;
        cursor: pointer;
      }
      }
      }
    }
      .catalogue {
        padding-bottom: 20px;
        .title {
          text-align: center;
          padding: 15px 0;
          border-bottom: 1px #f0f2f7 solid;
          font-weight: 600;
          font-size: 16px;
        }
      }
  }
}
</style>