<template>
  <div class="rightbox">
    <div class="dynamic-right">
      <!-- 作者中心 -->
      <div class="author">
        <p class="author-title">
          <i class="iconfont icon-chuangzuozhezhongxin"></i>创作者中心
        </p>
        <div class="author-tag">
          <div class="tag-box" @click="opendrafts">
            <i class="iconfont icon-weibiaoti--"></i>
            <p>写文章</p>
          </div>
          <div class="tag-box" @click="dialogTableVisible = true">
            <i
              class="iconfont icon-airudiantubiaohuizhi-zhuanqu_zixundongtai"
            ></i>
            <p>发动态</p>
          </div>
        </div>
        <el-button type="primary" plain @click="opencreator"
          >进入创作者中心</el-button
        >
      </div>
      <!-- 个人主页信息 -->
      <div class="focus-box" v-show="isuser">
        <div class="focus focus-first" @click="openfcous">
          <p>关注了</p>
          <h3>{{ msg.usersFollowed }}</h3>
        </div>
        <div class="focus" @click="openfcousme">
          <p>关注者</p>
          <h3>{{ msg.followers }}</h3>
        </div>
      </div>
      <!-- 直播模块 -->
      <div class="live" @click="openlive(livedata)">
        <p class="live-title">最新直播</p>
        <img :src="`/api/photos/display?photoPath=${livedata.cover}`" alt="" />

        <p class="live-name" v-if="livedata.cover">{{ livedata.name }}</p>
      </div>
      <!-- 问卷调查模块 -->
      <div
        class="questionnaire"
        v-for="(item, index) in surveydata"
        :key="index"
        @click="opensurvey(item)"
      >
        <div class="h2">{{ item.name }}</div>
        <div class="h5">{{ item.description }}</div>
      </div>
      <!-- 热榜文章 -->
      <div class="right-content" v-show="!ishot">
        <p class="hot-title">热榜文章</p>
        <el-row v-for="(item, index) in hotdata" :key="index">
          <el-col :span="2">
            <p :class="index < 3 ? 'bg' : ''">{{ index + 1 }}</p>
          </el-col>
          <el-col :span="22">
            <p class="hotop" @click="open(item.id)">{{ item.articleTitle }}</p>
          </el-col>
        </el-row>
        <p class="bot-buttom" @click="openhot">查看完整热榜</p>
      </div>
      <!-- 最新资讯 -->
      <div class="right-content" v-show="!isnew">
        <p class="hot-title">最新资讯</p>
        <el-row v-for="(item, index) in newsdata" :key="index">
          <el-col :span="2">
            <p :class="index < 3 ? 'bg' : ''">{{ index + 1 }}</p>
          </el-col>
          <el-col :span="22">
            <p class="hotop" @click="open(item.id)">{{ item.articleTitle }}</p>
          </el-col>
        </el-row>
        <p class="bot-buttom" @click="openhot">查看完整资讯</p>
      </div>
      <div class="foote">
        <span>网站名称：{{ webmsg.websiteName }}</span>
        <span>网站介绍：{{ webmsg.websiteIntro }}</span>
        <span>网站备案号：{{ webmsg.websiteRecordNo }}</span>
        <span>创建时间：{{ webmsg.websiteCreateTime }}</span>
        <span v-for="(item, index) in linkdata" :key="index" class="link" @click="openlink(item.linkAddress)">{{item.linkIntro}}</span>
      </div>
    </div>
    <!-- 发动态页面 -->
    <el-dialog title="发动态" :visible.sync="dialogTableVisible">
      <div class="put">
        <div
          class="put-upimg"
          :style="{
            border: isfocus ? '1px solid #409eff' : '1px solid #dcdfe6',
          }"
        >
          <el-input
            type="textarea"
            placeholder="快来分享新鲜事~"
            v-model="textarea"
            maxlength="300"
            show-word-limit
            ref="name"
            @focus="namefocus"
            @blur="nameblur"
            class="aaa"
          >
          </el-input>
          <div class="img">
            <el-upload
              action="#"
              list-type="picture-card"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="beforechange"
              :on-remove="handleRemove"
              v-show="fileList.length != 0"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="fileList" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                  loading="lazy"
                />
                <!-- 图片按钮 -->
                <span class="el-upload-list__item-actions">
                  <!-- 删除 -->
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
          <span class="words">{{ textarea.length }}/300</span>
        </div>
        <div class="btn">
          <div class="btn-up">
            <emoji @emoji="getemj" @givefocus="getfocus" />
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="befor"
              list-type="picture"
              :show-file-list="false"
            >
              <i class="iconfont icon-tupian"></i>
            </el-upload>
          </div>
          <el-button type="primary" size="medium" @click="putcomment"
            >发布</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import emoji from "@/components/emoji.vue";
import { postDynamic, postDynamicImg } from "@/api/comment/discussion";
import { getHotArticle } from "@/api/home/child/hotspot";
import { getLatestNewsList } from "@/api/home/child/news";
import { getLiveList } from "@/api/live/index";
import { mapGetters } from "vuex";
import { getExerciseById } from "@/api/study/document";
import { getRelevanceLink } from "@/api/user";
export default {
  name: "homeright",
  components: { emoji },
  data() {
    return {
      hotdata: [], //热榜文章
      newsdata: [],
      ishot: this.$route.meta.ishot || false, //是否是热榜文章页面
      isuser: this.$route.meta.isuser || false, //是否是用户主页
      isnew: this.$route.meta.isnew || false,
      msg: {}, //
      dialogTableVisible: false, //开启发布动态页面
      textarea: "", //发布动态内容
      fileList: [], //发布动态图片
      isfocus: false, //发布动态是否获取焦点
      livedata: {}, //直播信息
      surveydata: [], //问卷数据
      linkdata:[],//链接数据
    };
  },
  created() {
    this.onload();
  },
  computed: {
    ...mapGetters(["usermsg", "webmsg"]),
  },
  watch: {
    $route(to, from) {
      this.ishot = to.meta.ishot || false;
      this.isuser = to.meta.isuser || false;
      this.isnew = to.meta.isnew || false;
    },
  },
  methods: {
    // 点击图片后将图片添加进入数组
    befor(file) {
      this.fileList.push(file);
    },
    // 点击加号后添加图片
    beforechange(file, fileList) {
      this.fileList = fileList;
    },
    // 删除图片队列中地图片
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 拿到表情
    getemj(value) {
      this.textarea += value;
    },
    // 获取焦点
    getfocus(value) {
      this.$refs.name.focus();
    },
    // 输入框获取焦点时
    namefocus() {
      this.isfocus = true;
    },
    // 输入框失去焦点时
    nameblur() {
      this.isfocus = false;
    },
    // 发布动态
    async putcomment() {
      let images;
      let data;
      if (this.fileList.length != 0) {
        let imagelist = new FormData();
        this.fileList.forEach((element) => {
          imagelist.append("file", element.raw);
        });
        images = await postDynamicImg(imagelist);
        data = {
          content: this.textarea,
          images: JSON.stringify(images.data.data),
        };
      } else {
        data = {
          content: this.textarea,
        };
      }
      postDynamic(data).then((res) => {
        this.textarea = "";
        this.fileList = [];
        this.dialogTableVisible = false;
        this.$router.push({ path: `/comment/cdetail/${res.data.data}` });
      });
    },
    // 进入写文章页面
    opendrafts() {
      this.$router.push({ path: `/creator/drafts` });
    },
    // 进入创作者中心
    opencreator() {
      this.$router.push({ path: `/creator/first` });
    },
    // 进入直播页面
    openlive(value) {
      this.$router.push({
        path: `/live/livedetail`,
        query: { id: value.id, isLive: value.isLive },
      });
    },
    // 进入文章详情页
    open(id) {
      this.$router.push({ path: `/article/detail/${id}` });
    },
    // 进入热榜
    openhot() {
      this.$router.push({ path: `/home/hotspot` });
    },
    // 进入关注
    openfcous() {
      this.$router.push({ path: "/info/index/userfocus/myattention" });
    },
    // 进入粉丝
    openfcousme() {
      this.$router.push({ path: "/info/index/userfocus/focusme" });
    },
    // 进入问卷页面
    opensurvey(value) {
      let routeData = this.$router.resolve({
        path: "/practise/examination",
        query: {id: value.id},
        meta: { title: "问卷调查" },
      });
      window.open(routeData.href, "_blank");
    },
    // 打开链接
    openlink(value){
       window.open(value, '_blank')
    },
    async onload() {
      // 获取热榜文章
      getHotArticle().then((res) => {
        this.hotdata = res.data.data;
      });
      // 获取最新资讯
      getLatestNewsList().then((res) => {
        this.newsdata = res.data.data.recordList;
      });
      if (this.isuser) {
        this.msg = this.usermsg;
        this.msg.followers = this.usermsg.userInfoDTO.followers.length;
        this.msg.usersFollowed = this.usermsg.userInfoDTO.usersFollowed.length;
      }
      // 获取最近直播
      getLiveList().then((res) => {
        this.livedata = res.data.data.recordList[0];
      });
      // 获取问卷信息
      this.webmsg.defaultSurvey.forEach((el) => {
        getExerciseById(el).then((res) => {
          let data = res.data.data;
          data.id = el;
          this.surveydata.push(data);
        });
      });
      // 获取相关网站信息
getRelevanceLink().then((res) => {
          let data = res.data.data;
          this.linkdata = data
        });
    },
  },
};
</script>
<style lang='scss' scoped>
.rightbox {
  .dynamic-right {
    // 作者中心
    .author {
      padding: 20px;
      background: rgb(255, 255, 255);
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      margin-bottom: 10px;
      .author-title {
        margin-bottom: 10px;
        font-size: 14px;
        color: #444;
        .icon-chuangzuozhezhongxin {
          font-size: 20px;
          margin-right: 5px;
        }
      }
      .author-tag {
        display: flex;
        padding: 10px 0;
        .tag-box {
          padding: 15px;
          padding-bottom: 0;
          cursor: pointer;
          p {
            margin: 15px 0;
            color: #444;
            font-size: 12px;
            text-align: center;
          }
          .iconfont {
            padding: 10px;
            border-radius: 25px;
            font-size: 22px;
            font-weight: 600;
          }
          .icon-weibiaoti-- {
            background: #faf5db;
            color: #f4c807;
            font-weight: 550;
          }

          .icon-airudiantubiaohuizhi-zhuanqu_zixundongtai {
            background: #fff2e0;
            color: #ff9607;
          }
        }
        .tag-box:hover p {
          color: #409eff;
        }
        .tag-box:hover .icon-airudiantubiaohuizhi-zhuanqu_zixundongtai {
          background: rgb(253, 220, 177);
        }
        .tag-box:hover .icon-weibiaoti-- {
          background: #fdf3c2;
        }
      }
      .el-button {
        width: 100%;
      }
    }
    // 个人主页信息
    .focus-box {
      background: rgb(255, 255, 255);
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .focus {
        width: 50%;
        text-align: center;
        padding: 15px;
        cursor: pointer;
        p {
          color: #9ca5b7;
          font-size: 15px;
          padding: 5px 0;
        }
      }
      .focus-first {
        border-right: 1px #ebebeb solid;
      }
      .focus:hover p,
      .focus:hover {
        color: #1b59a5;
      }
    }
    // 咨询模块
    .right-content {
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      background: rgb(255, 255, 255);
      margin-bottom: 10px;
      .hot-title {
        padding: 10px 20px;
        font-size: 15px;
      }
      .bot-buttom {
        border-top: 1px #f0f2f7 solid;
        padding: 10px 20px;
        font-size: 15px;
        text-align: center;
        color: #939393;
        cursor: pointer;
      }
      .el-row {
        border-top: 1px #f0f2f7 solid;
        padding: 10px 0;
        padding-left: 20px;
        .el-col-2 {
          padding-top: 5px;
          text-align: center;
          p {
            font-size: 15px;
          }
          .bg {
            color: #ff9607;
            font-size: 16px;
            font-weight: 600;
          }
        }
        .el-col-22 {
          padding-right: 20px;
          p {
            font-size: 13px;
            padding: 5px 0;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    // 直播模块
    .live {
      height: 150px;
      box-shadow: 0 0 4px 1px rgb(131, 128, 128);
      background: rgb(255, 255, 255);
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      .live-title {
        position: absolute;
        color: white;
        margin: 5px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .live-name {
        width: calc(100% - 20px);
        position: absolute;
        bottom: 0;
        padding: 10px;
        color: white;
        background: linear-gradient(
          180deg,
          transparent,
          rgba(0, 0, 0, 0.6) 59.9%
        );
      }
    }
    // 问卷调查
    .questionnaire {
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      background: rgb(255, 255, 255);
      margin-bottom: 10px;
      padding: 20px;
      cursor: pointer;
      .h2 {
        font-size: 22px;
        color: #08304c;
        margin-bottom: 7px;
        cursor: pointer;
      }
      .h5 {
        color: #808080;
        line-height: 21px;
        text-align: justify;
      }
    }
    .foote {
      display: flex;
      flex-direction: column;
      span {
        color: #909aae;
        font-size: 13px;
        margin: 5px 0;
      }
      .link:hover{
      cursor: pointer;
      text-decoration:underline;
      color: #1b59a5;
      }
    }
  }
  .put {
    width: 100%;
    background: white;
    box-sizing: border-box;
    padding: 20px;
    padding-top: 0;
    border-radius: 5px;
    .put-upimg {
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 20px;
      position: relative;
      .img {
        :deep(.el-upload--picture-card) {
          width: 80px;
          height: 80px;
        }
        :deep(.el-icon-plus) {
          font-size: 18px;
          position: relative;
          bottom: 30px;
        }
        :deep(.el-upload-list__item) {
          width: 80px;
          height: 80px;
        }
        .el-upload-list__item-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }
      }
      .words {
        color: #8a919f;
        font-size: 12px;
        user-select: none;
        position: absolute;
        right: 20px;
        bottom: 10px;
      }
    }
    :deep(.el-textarea__inner) {
      height: 100px;
      border: none;
      resize: none;
    }
    .el-textarea {
      margin-bottom: 10px;

      :deep(.el-input__count) {
        display: none;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      .btn-up {
        display: flex;
        .el-image {
          width: 40px;
        }
      }
      .icon-tupian {
        font-size: 18px;
      }
      .iconfont:hover {
        color: #409eff;
      }
    }
  }
}
</style>