<template>
<!-- 文章组件 -->
  <div class="article-box">
    <!-- 文章标题 -->
      <h4 @click="open(data.id)" v-html="data.articleTitle"></h4>
      <!-- 文章内容 -->
      <div class="article-text" v-show="isreadall" @click="readall(data.id)" v-html="data.articleContent">
        </div>
        <!-- 全文阅读 -->
        <div class="readall" v-if="!isreadall">
          <!-- 头像和作者名称 -->
          <div class="article-top">
            <el-image :src="dataList.avatar" :lazy="true" fit="cover" @click="author(dataList.userId)"> </el-image>
           <span @click="author(dataList.userId)">{{ dataList.nickname }}</span>
          </div>
          <!-- 点赞 -->
       <p class="article-like">
        {{dataList.likeCount==null?0:dataList.likeCount}}人点赞
        </p>   
<!-- 文章内容 -->
<p class="article" v-html="dataList.articleContent">
</p>
<p class="article-time">
        编辑于 {{dataList.createTime}}
        </p>  
        </div>
      <el-button type="text" @click="readall(data.id)" v-show="isreadall">阅读全文
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <!-- 点赞和评论盒子 -->
 <div class="icon-box">
            <i :class="data.isLike?'iconfont icon-dianzan_kuai':'iconfont icon-dianzan'" @click="likebtn(data.id)"><span>{{data.likeCount==null?0:data.likeCount}}</span></i>
            <i class="iconfont icon-pinglun" @click="commentbtn(data.id)"><span>{{data.commentsCount==null?"评论":data.commentsCount}}</span></i>
            <el-button type="text" @click="unreadall" v-show="!isreadall">收起
        <i class="el-icon-arrow-up"></i>
      </el-button>
          </div>
          <comment :data='commentdata' :fatherdata ="data" :type='1' v-if="iscomment" @changenum='changenum'/>
   
  </div>
</template>

<script>
import {getCommentList,giveArticleLike,getArticleById } from "@/api/home/child/article";
import comment from '@/components/comment.vue';
export default {
  name: "",
  components: {comment},
  props: {
    /* 配置项 */
    data: {
      type: Object,
      default: () => {
        return null
      },
    },
    },
  data() {
    return {
      iscomment:false,
      commentdata:{},
      isreadall:true,
      dataList:{}
    };
  },
  mounted () {
  },
  methods: {
    // 进入作者详情页
        author(id){
            this.$store.dispatch(
        "GetUserInfo",
        id
    ).then((res)=>{
this.$store.commit('SET_USER_MSG', res)
            this.$router.push({ name: "个人动态"});
    })
        },
        // 点赞
    likebtn(id){
      this.data.isLike = !this.data.isLike
      if (this.data.isLike) {
        this.data.likeCount++
      }else{
        this.data.likeCount--
      }
giveArticleLike(id)
    },
    //评论之后
    changenum(value){
      if (value) this.data.commentsCount++
    },
// 评论
async commentbtn(id){

const comment =await getCommentList(id)
if (comment.data.data.count!=null) {
 comment.data.data.recordList.forEach(el => {
  el.avatar ='/api/photos/display?photoPath='+el.avatar
  });
   this.commentdata = comment.data.data.recordList

}else{
  this.commentdata = []
}
this.iscomment = !this.iscomment
      
},
// 阅读全文
async readall(id){

const res = await getArticleById(id).catch((err)=>{
this.$message.error(err);
})
this.dataList = res.data.data
this.dataList.avatar = '/api/photos/display?photoPath='+this.dataList.avatar
this.isreadall = false
},
// 收起
unreadall(){
this.isreadall = true
},
// 进入文章详情
open(id){
this.$router.push({ path: `/article/detail/${id}`})
                
}
  }
};
</script>
<style lang='scss' scoped>
  .article-box {
    background: white;
    border-top: 1px #f0f2f7 solid;
    padding: 20px 20px;
    h4{
        margin-bottom: 10px;
    }
    h4:hover{
        cursor: pointer;
        color: #175199;
    }
    .article-text:hover{
        cursor: pointer;
        color: #7a7a7a;
    }
    .article-text {
      font-size: 13px;
      line-height: 25px;
      /* 1.溢出隐藏 */
      overflow: hidden;
      /* 2.用省略号来代替超出文本 */
      text-overflow: ellipsis;
      /* 3.设置盒子属性为-webkit-box  必须的 */
      display: -webkit-box;
      /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
      -webkit-line-clamp: 2;
      /* 5.字面意思：单词破坏：破坏英文单词的整体性，在英文单词还没有在一行完全展示时就换行  即一个单词可能会被分成两行展示 */
      word-break: break-all;
      /* 6.盒子实现多行显示的必要条件，文字是垂直展示，即文字是多行展示的情况下使用 */
      -webkit-box-orient: vertical;
    }
    .readall{
      .article-top{
        display: flex;
  align-items: center;
  padding: 10px 0;
        .el-image{
        width: 30px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
      }
      span{
font-size: 14px;
font-weight: 600;
      }
      span:hover{
            color: #409EFF;
            cursor: pointer;
        }
      }
      .article-like{
font-size: 15px;
color: #8590a6;
margin-bottom: 2px;
      }
      .article{
font-size: 15px;
      line-height: 35px;
      padding-right: 80px;
      color: rgb(44, 44, 44);
      :deep(img){
        object-fit: cover;
        width: 100%;
      }
      }
      .article-time{
        font-size: 13px;
        color: #8590a6;
        margin-top: 5px;
      }
    }
     .icon-box{
        color: rgb(117, 117, 117);
        margin: 7px 0;
        .iconfont{
            font-size: 18px;
            margin-right: 5px;
            cursor: pointer;
            span{
            font-size: 13px;
            padding: 0 5px 0px 5px;
          }
        }
       
    }
  }
</style>