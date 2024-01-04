<template>
  <!-- 阅读资料 -->
  <div
    class="read-box"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- 左边 -->
    <transition name="fade">
      <div class="read-left" :style="{ width: menu ? '320px' : '0' }">
        <div class="catalogue">
          <div class="tohome"><img src="@/assets/logo.png" /> 培训系统</div>
          <div class="catalogue-detail">
            <el-row
              v-for="(item, index) in documentlist.fileInfoList"
              :key="index"
            >
              <el-col :span="3"
                ><div class="grid-content">
                  <span
                    :class="index == articleindex ? 'plan-title' : 'index'"
                    >{{ index + 1 }}</span
                  >
                </div></el-col
              >
              <el-col :span="21"
                ><div class="grid-content" @click="open(item, index)">
                  <p class="plan">
                    <span :class="index == articleindex ? 'plan-title' : ''">{{
                      item.fileName
                    }}</span>
                  </p>
                  <i
                    :class="
                      item.isHistory
                        ? 'iconfont icon-ai210'
                        : 'iconfont icon-yuanquan'
                    "
                  ></i></div
              ></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </transition>
    <!-- 右边 -->
    <div
      class="read-right"
      :style="{ width: menu ? 'calc(100% - 320px)' : '100%' }"
    >
      <!-- 右边头 -->
      <div class="head">
        <div class="writing">
          <i class="iconfont icon-caidan" @click="closecatalogue"></i>
          <span>{{ documentlist.fileCollectionName }} </span>
        </div>
        <el-image
          :src="`/api/photos/display?photoPath=${userInfo.avatar}`"
          :lazy="true"
          fit="cover"
        ></el-image>
      </div>
      <!-- 右边文章内容和评论 -->
      <div class="body" ref="msgbox">
        <div class="document">
          <iframe v-if="documentlist.type == 1" :src="imgurl"></iframe>
          <videoPlayer
            v-if="documentlist.type == 2"
            :url="imgurl"
          ></videoPlayer>
          <comment
            :data="commentdata"
            :fatherdata="articledata"
            :type="2"
            v-if="iscomment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDocumentList } from "@/api/home/child/article";
import comment from "@/components/comment.vue";
import { mapGetters } from "vuex";
import { getDocumentDetails } from "@/api/study/document";
import { getDocxFlie } from "@/api/user";
import videoPlayer from "@/components/PlaeryVideo.vue";
export default {
  name: "",
  components: { comment, videoPlayer },
  data() {
    return {
      menu: true,
      documentlist: {},
      commentdata: [],
      iscomment: false,
      imgurl: "",
      articledata: {},
      articleindex: this.$route.params.id,
      loading: true,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    this.onload();
    this.commentbtn("58");
  },
  methods: {
    // 打开文档
    open(value, index) {
      value.userId = 1;
      this.articleindex = index;
      this.loading = true;
      this.getdetail(value);
    },
    // 关闭目录
    closecatalogue() {
      this.menu = !this.menu;
    },
    getdetail(data) {
      if (this.documentlist.type == 1) {
        getDocxFlie(data.fileSrc).then((res) => {
          this.imgurl = window.URL.createObjectURL(res.data)+'#toolbar=0';
          this.$refs.msgbox.scrollTo(0, 0);
          this.loading = false;
        });
      } else {
        this.imgurl = "/api/files/display?filePath=" + data.fileSrc;
        this.$refs.msgbox.scrollTo(0, 0);
        this.loading = false;
      }

      this.commentbtn(data.id);
    },
    // 获得文档
    onload() {
      getDocumentDetails(this.$route.query.id).then((res) => {
        const data = res.data.data;
        this.documentlist = data;
        this.documentlist.fileInfoList[this.$route.params.id].userId = 1;
        this.articledata =
          this.documentlist.fileInfoList[this.$route.params.id];
        this.getdetail(this.documentlist.fileInfoList[this.$route.params.id]);
      });
    },
    // 评论
    async commentbtn(id) {
      const comment = await getDocumentList(id);
      if (comment.data.data.count != null) {
        comment.data.data.recordList.forEach((el) => {
          el.avatar = "/api/photos/display?photoPath=" + el.avatar;
        });
        this.commentdata = comment.data.data.recordList;
        this.iscomment = true;
      } else {
        this.commentdata = [];
        this.iscomment = true;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.read-box {
  height: 100%;
  display: flex;
  .read-left {
    height: 100%;
    background: #1e80ff;
    flex-shrink: 0;
    overflow: hidden;
    transition: all 0.5s;
    .catalogue {
      height: 100%;
      background: #f7f8fa;
    }
    .tohome {
      background: white;
      font-size: 18px;
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      cursor: pointer;
      border-bottom: 1px solid #ddd;
      margin-bottom: 10px;
      img {
        width: 33px;
        margin-bottom: -5px;
        margin-right: 10px;
      }
    }
    .catalogue-detail {
      overflow-y: scroll;
      height: calc(100% - 61px);
      .el-row {
        .grid-content {
          padding: 20px 10px 20px 20px;
          display: flex;
          justify-content: space-between;
          .plan-title {
            color: #1e80ff;
            font-weight: 600;
          }
          .index {
            font-weight: 600;
          }
          .plan {
            display: flex;
            flex-direction: column;
            cursor: pointer;
          }
          .icon-yuanquan {
            color: #8a919f;
            font-size: 22px;
            cursor: pointer;
          }
        }
      }
      .el-row:hover {
        background: #ebecec;
      }
    }
    .catalogue-bottom {
      height: 100px;
      background: rebeccapurple;
    }
  }

  .read-right {
    background: #e5e5e5;
    height: 100%;
    flex-shrink: 1;
    .head {
      height: 50px;
      background: rgb(255, 255, 255);
      border-bottom: 1px solid #ddd;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .writing {
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        .icon-caidan {
          font-size: 20px;
          margin-right: 10px;
        }
        span:hover {
          border-bottom: 1px brown solid;
        }
      }

      .el-image {
        margin-right: 20px;
        width: 35px;
        height: 35px;
        cursor: pointer;
      }
    }
    .body {
      height: calc(100% - 91px);
      padding: 20px;
      overflow-y: scroll;
      .document {
        background: white;
        min-height: 100%;
        border-radius: 2px;
        box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
        padding: 20px;
        iframe {
          width: 100%;
          height: 1200px;
        }
      }
    }
  }
}
</style>