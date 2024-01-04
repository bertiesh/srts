<template>
<!-- 文章详情 -->
  <div class="datail">
    <div class="title-bg">
      <!-- 标题 -->
      <el-row class="datail-title">
      <el-col :span="20">
        <div class="tags">
          <!-- 标签 -->
          <span v-for="(item, index) in data.tagDTOList" :key="index">{{
            item.tagName
          }}</span>
        </div>
        <h3 v-html="data.articleTitle"></h3>
        <p class="lastarticle" v-if="lastarticle">
          上一篇文章:<span @click="open(data.lastArticle.id)">
            {{ lastarticle }}</span
          >
        </p>
      </el-col>
      <el-col :span="4">
        <p>浏览量</p>
        <h3>{{ data.viewsCount }}</h3>
      </el-col>
    </el-row>
    </div>
    

    <el-row :gutter="20" class="datail-bottom">
      <el-col :span="16">
        <div class="grid-content">
          <div class="readall">
            <div class="article-top">
              <el-image :src="avatar" :lazy="true" fit="cover" @click="openauthor(data.userId)"> </el-image>
              <span @click="openauthor(data.userId)">{{ data.nickname }}</span>
            </div>
            <p class="article-like">
              {{ data.likeCount == null ? 0 : data.likeCount }}人点赞
            </p>
            <div class="article" v-html="data.articleContent">
            </div>
            <p class="article-time">编辑于 {{ data.createTime }}</p>
          </div>
          <!-- 点赞和评论盒子 -->
          <div class="icon-box">
            <i
              :class="
                data.isLike
                  ? 'iconfont icon-dianzan_kuai'
                  : 'iconfont icon-dianzan'
              "
              @click="likebtn(data.id)"
              ><span>{{ data.likeCount == null ? 0 : data.likeCount }}</span></i
            >
            <i class="iconfont icon-pinglun" @click="commentbtn(data.id)"
              ><span>{{
                data.commentsCount == null ? "评论" : data.commentsCount
              }}</span></i
            >
          </div>
          <comment
            :data="commentdata"
            :fatherdata="data"
            :type="1"
            v-if="iscomment"
            @changenum='changenum'
          />
        </div>
      </el-col>
      <el-col :span="8"
        ><div class="dynamic-right">
          <!-- 关于作者 -->
          <div class="right-content">
            <p class="content-title">关于作者</p>
            <div class="article-top">
              <el-image :src="avatar" :lazy="true" fit="cover" @click="openauthor(data.userId)"> </el-image>
            <p @click="openauthor(data.userId,'个人动态')">{{ data.nickname }}</p>
            </div>

            <div class="author-msg">
              <div @click="openauthor(author.userInfoDTO.userInfoId,'个人动态')">
                <p>动态</p>
                <h3>{{ author.myTalkId }}</h3>
              </div>
              <div @click="openauthor(author.userInfoDTO.userInfoId,'个人文章')">
                <p>文章</p>
                <h3>{{ author.articleCount }}</h3>
              </div>
              <div @click="openauthor(author.userInfoDTO.userInfoId,'我关注的')">
                <p>关注者</p>
                <h3>{{ author.followersNum }}</h3>
              </div>
            </div>
            <div class="author-btn" v-if="!isme">
              <el-button
                type="primary"
                :icon="attentiondata.isattention ? '' : 'el-icon-plus'"
                @click="attention(author.userInfoDTO.userInfoId)"
                 @mouseenter.native ="onMouseOver"
                 @mouseleave.native ="onMouseOut"
                >{{ attentiondata.title }}</el-button
              >
              <el-button icon="iconfont icon-chat-full" @click="privateletter"
                >私信</el-button
              >
            </div>
          </div>
          <!-- 相关文章 -->
          <div class="right-related">
            <p class="content-title">相关文章</p>
            <p
              v-for="(item, index) in data.recommendArticleList"
              :key="index"
              class="title"
              @click="open(item.id)"
            >
              {{ item.articleTitle }}
            </p>
          </div>
          <!-- 尾部 -->
          <div class="foote">
            <span>网站名称：{{webmsg.websiteName}}</span>
        <span>网站介绍：{{webmsg.websiteIntro}}</span>
        <span>网站备案号：{{webmsg.websiteRecordNo}}</span>
        <span>创建时间：{{webmsg.websiteCreateTime
}}</span>
          </div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import {
  getCommentList,
  getArticleById,
  giveUserAttention,
} from "@/api/home/child/article";
import comment from "@/components/comment.vue";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: { comment },
  data() {
    return {
      iscomment: false,
      commentdata: {},
      data: {},
      lastarticle: "", //上一篇
      avatar: "", //头像
      author: {}, //作者信息
      attentiondata: { isattention: false, title: "关注" },
      isme:true
    };
  },
  created() {
    this.onload();
  },
  watch: {
    $route(to, from) {
      if (from.path != to.path) {
        window.location.reload();
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo", "webmsg"]),
  },
  methods: {
    // 进入作者详情页
        openauthor(id,name){
            this.$store.dispatch(
        "GetUserInfo",
        id
    ).then((res)=>{
this.$store.commit('SET_USER_MSG', res)
            this.$router.push({name});
    })
        },
    // 鼠标移入关注按钮
    onMouseOver(){
            if (this.attentiondata.isattention) this.attentiondata.title = "取消关注"
    },
        // 鼠标移出关注按钮
    onMouseOut(){
      if (this.attentiondata.isattention) this.attentiondata.title = "已关注"
    },
    // 关注
    attention(id) {
      let data
      if (this.attentiondata.isattention) {
        let arry=[]
        this.userInfo.usersFollowed.forEach(el => {
          arry.push(el.followId)
        });
        arry=arry.filter(item => item != id)
       data={
        userIdList:arry
       }

      }else{
        data={
          followIdList:[id]
        }
      }
      giveUserAttention(data).then((res)=>{
if (this.attentiondata.isattention) {
  this.author.followersNum--
  this.attentiondata.title="关注"
  this.$message({
            message: "取关成功",
            type: "success",})
}else{
  this.author.followersNum++
  this.attentiondata.title="已关注"
  this.$message({
            message: "关注成功",
            type: "success",})
}
this.attentiondata.isattention=!this.attentiondata.isattention

      })
    },
    // 私信
    privateletter() {},
    // 点赞
    likebtn(id) {
      this.data.isLike = !this.data.isLike;
      if (this.data.isLike) {
        this.data.likeCount++;
      } else {
        this.data.likeCount--;
      }
      giveArticleLike(id);
    },
    //评论之后
    changenum(value){
      if (value) this.data.commentsCount++
    },
    // 评论
    async commentbtn(id) {
      // 获取评论列表
      const comment = await getCommentList(id);
      if (comment.data.data.count != null) {
        comment.data.data.recordList.forEach((el) => {
           el.avatar ='/api/photos/display?photoPath='+el.avatar
        });
        this.commentdata = comment.data.data.recordList;
      } else {
        this.commentdata = [];
      }
      this.iscomment = !this.iscomment;
    },
    // 上一篇
    open(id) {
      this.$router.push({ path: `/article/detail/${id}` });
    },
    async onload() {
      // 获取文章信息
      const list = await getArticleById(this.$route.params.id).catch((err)=>{
this.$message.error(err);
this.$router.go(-1)
      });
      this.data = list.data.data;
      this.lastarticle = this.data.lastArticle.articleTitle;
      // 加载作者头像
      this.avatar = '/api/photos/display?photoPath='+this.data.avatar;
      // 获取作者信息
      const authorInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.data.userId
      );
      this.author = authorInfo;
      this.author.myTalkId = this.author.myTalkIdList.length;
      this.author.followersNum = this.author.userInfoDTO.followers.length;
      // 获取自己信息
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.isme = this.author.userInfoDTO.userInfoId==userInfo.userInfoDTO.userInfoId;
      //  判断自己是否关注此作者
      let follow = [];
      userInfo.userInfoDTO.usersFollowed.forEach((el) => {
        follow.push(el.followId);
      });
      this.attentiondata.isattention = follow.includes(
        authorInfo.userInfoDTO.userInfoId
      );
      this.attentiondata.title = this.attentiondata.isattention ? "已关注" : "关注";
    },
  },
};
</script>
<style lang='scss' scoped>
.datail {
  width: 100%;
  display: flex;
  flex-direction: column;
  .title-bg{
    min-width: 1040px;
background: white;
    box-shadow: 0 0 5px 1px rgb(228, 228, 228);
    display: flex;
  justify-content: center;
  }
  .datail-title {
    padding: 10px;
 width: 1040px;
    
    .tags {
      margin-top: 10px;
      span {
        display: inline-block;
        padding: 8px;
        font-size: 11px;
        background: #e5f0fd;
        border-radius: 20px;
        margin-right: 20px;
        color: #056de8;
      }
    }
    h3 {
      padding: 10px 0;
    }
    .lastarticle {
      padding: 10px 0;
      margin-bottom: 10px;
      span {
        cursor: pointer;
        font-weight: 600;
      }
      span:hover {
        color: #175199;
      }
    }
    .el-col-4 {
      p {
        color: #9ca5b7;
        font-size: 14px;
      }
      h3 {
        padding: 0;
      }
    }
  }
  .datail-bottom {
    align-self: center;
    padding: 10px;
 width: 1040px;
    .grid-content {
      padding: 20px 30px;
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      border-radius: 5px;
      background: white;
      margin-bottom: 10px;
      .readall {
        .article-top {
          display: flex;
          align-items: center;
          padding: 10px 0;
          .el-image {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            cursor: pointer;
          }
          span {
            font-size: 14px;
            font-weight: 600;
          }
          span:hover{
        cursor: pointer;
        color: #409EFF;
    }
        }
        .article-like {
          font-size: 13px;
          color: #8590a6;
          margin-bottom: 5px;
        }
        .article {
          font-size: 15px;
          line-height: 35px;
          color: rgb(44, 44, 44);
          :deep(img){
            width: 100%;
          }
        }
        .article-time {
          font-size: 13px;
          color: #8590a6;
          margin-top: 5px;
        }
      }
      .icon-box {
        color: rgb(117, 117, 117);
        margin: 7px 0;
        .iconfont {
          font-size: 18px;
          margin-right: 5px;
          cursor: pointer;
          span {
            font-size: 13px;
            padding: 0 5px 0px 5px;
          }
        }
      }
    }

    .dynamic-right {
      .right-content {
        background: white;
        box-shadow: 0 0 4px 1px rgb(238, 238, 238);
        border-radius: 5px;
        padding-bottom: 20px;
        .content-title {
          font-weight: 600;
          font-size: 15px;
          padding: 20px;
          border-bottom: 1px rgb(238, 238, 238) solid;
        }
        .article-top {
          display: flex;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px rgb(238, 238, 238) solid;
          .el-image {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            cursor: pointer;
          }
          p {
            font-size: 17px;
            font-weight: 600;
            margin-left: 10px;
            padding-top: 10px;
            cursor: pointer;
          }
          p:hover{
        color: #409EFF;
    }
        }
        .author-msg {
          display: flex;
          justify-content: space-around;
          text-align: center;
          padding: 20px;
          div{
            cursor: pointer;
            p {
            color: #9ca5b7;
            font-size: 14px;
          }
          h3 {
            padding: 0;
          }
          }
          div:hover p,div:hover h3{
 color: #175199;
          }
          
        }
        .author-btn {
          display: flex;
          justify-content: center;
          .el-button {
            padding: 8px;
            width: 40%;
          }
          .el-button--primary:hover{
            background: #3486eb;
          }
        }
      }
      .right-related {
        margin-top: 10px;
        background: white;
        box-shadow: 0 0 4px 1px rgb(238, 238, 238);
        border-radius: 5px;
        padding-bottom: 10px;
        .content-title {
          font-weight: 600;
          font-size: 15px;
          padding: 20px;
          border-bottom: 1px rgb(238, 238, 238) solid;
          margin-bottom: 10px;
        }
        .title {
          padding: 5px 20px;
          font-size: 14px;
          cursor: pointer;
          color: #409eff;
        }
        .title:hover {
          text-decoration: underline;
        }
      }
      .foote {
      display: flex;
          flex-direction: column;
      span{
        color: #909aae;
        font-size: 13px;
        margin: 5px 0;
      }
    }
    }
  }
}
</style>