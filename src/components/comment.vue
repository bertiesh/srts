<template>
  <div class="comment-box">
    <el-input
      placeholder="发布你的评论"
      v-model="commentText"
      class="input-with-select"
      ref="name"
    >
    </el-input>
    <!-- 按钮 -->
    <div class="btn-box">
      <emoji @emoji="getemj" @givefocus="getfocus" :ison="false" />
      <el-button
        type="primary"
        round
        size="mini"
        @click="postcomment(fatherdata, true, fatherdata.id)"
        >评论</el-button
      >
    </div>
    <!-- 父评论 -->
    <div v-for="(item, index) in dataList" :key="index">
      <div class="comment-bod">
        <div class="comment-text">
          <el-image :lazy="true" :src="item.avatar" fit="cover"> </el-image>
          <div class="text">
            <p>
              <span>{{ item.nickname }}:</span>
              <span style="cursor: pointer;">{{ item.commentContent }}</span>
            </p>
            <p class="text-time">{{ item.createTime }}</p>
          </div>
        </div>
        <div class="icon-box">
          <i
            :class="
              item.isLike
                ? 'iconfont icon-dianzan_kuai'
                : 'iconfont icon-dianzan'
            "
            @click="likebtn(item)"
            ><span>{{ item.likeCount == null ? 0 : item.likeCount }}</span></i
          >
          <i class="iconfont icon-pinglun" @click="commentbtn(item)"></i>
        </div>
      </div>
      <div class="reply-reply" v-show="showcomment == item.id">
        <el-input
          placeholder="发布你的评论"
          v-model="soncomment"
          class="input-with-select"
          :ref="item.id + item.nickname"
        >
        </el-input>
        <div class="btn-box">
          <emoji @emoji="getemj" @givefocus="getfocus" :ison="true" />
          <el-button
            type="primary"
            round
            size="mini"
            @click="postcomment(item, false, item.topicId)"
            >评论</el-button
          >
        </div>
      </div>
      <!-- 子评论 -->
      <div v-if="item.replyDTOList != null">
        <div v-for="(items, index) in item.replyDTOList" :key="index">
          <div class="reply-comment">
            <div class="text">
              <p>
                <span>{{ items.nickname }}</span> :回复<span>{{
                  items.replyNickname
                }}</span>
                :<span style="cursor: pointer;">{{ items.commentContent }}</span>
              </p>
              <p class="text-time">{{ items.createTime }}</p>
            </div>
            <div class="icon-box">
              <i
                :class="
                  items.isLike
                    ? 'iconfont icon-dianzan_kuai'
                    : 'iconfont icon-dianzan'
                "
                @click="likebtn(items)"
                ><span>{{
                  items.likeCount == null ? 0 : items.likeCount
                }}</span></i
              >
              <i class="iconfont icon-pinglun" @click="commentbtn(items)"></i>
            </div>
          </div>
          <div class="reply-reply" v-show="showcomment == items.id">
            <el-input
              placeholder="发布你的评论"
              v-model="soncomment"
              class="input-with-select"
              :ref="items.id + items.nickname"
            >
            </el-input>
            <div class="btn-box">
              <emoji @emoji="getemj" @givefocus="getfocus" :ison="true" />
              
              <el-button
                type="primary"
                round
                size="mini"
                @click="postcomment(items, false,item.topicId,item)"
                >评论</el-button
              >
            </div>
          </div>
        </div>
        <!-- 回复 -->
      </div>
    </div>
  </div>
</template>

<script>
import emoji from "@/components/emoji.vue";
import {
  giveCommentLike,
  postComment,
} from "@/api/comment/discussion";
import { mapGetters } from "vuex";
export default {
  name: "comment",
  components: { emoji },
  props: {
    /* 配置项 */
    data: {
      type: Array,
      default: () => {
        return null;
      },
    },
    fatherdata: {
      type: Object,
      default: () => {
        return null;
      },
    },
    type: {
      type: Number,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
        dataList:this.data,
      commentText: "", //父评论
      showcomment: "", //显示子评论
      soncomment: "", //子评论
      inputid: "", //ipntid
      avatar:''
    };
  },
  mounted() {
    this.$refs.name.focus();
    this.getavatar()
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 点赞
    likebtn(item) {
      item.isLike = !item.isLike;
      if (item.isLike) {
        item.likeCount++;
      } else {
        item.likeCount--;
      }
      giveCommentLike(item.id);
    },
    // 评论
    async commentbtn(data) {
      this.soncomment = "";
      this.inputid = data.id + data.nickname;
      this.showcomment = data.id;
      this.$nextTick(() => {
        this.$refs[this.inputid][0].focus();
      });
    },
    // 发布评论
    async postcomment(item, isfather, parentid,list) {
      const data = {
        commentContent: isfather ? this.commentText : this.soncomment,
        parentId: isfather ? null : item.id,
        replyUserId: item.userId,
        topicId: parentid,
        type: this.type,
      };
      const res = await postComment(data);
      if (res.data.code == 200) {
        const comment = res.data.data
        comment.avatar = this.avatar
        comment.replyNickname = item.nickname
        if (isfather) {
            this.dataList.unshift(comment)
        }else{
            if (list) {
                list.replyDTOList.unshift(comment)
            }else{
            if (item.replyDTOList==null) {
                item.replyDTOList=[comment]
            }else{
                 item.replyDTOList.unshift(comment)
            }
           
            }
            
        }
        this.showcomment = this.commentText=''
        this.$emit("changenum",isfather)
      }
    },
    // 拿到表情
    getemj(value, ison) {
      if (ison) {
        this.soncomment += value;
      } else {
        this.commentText += value;
      }
    },
    // 获取焦点
    getfocus(value) {
      if (value) {
        this.$refs[this.inputid][0].focus();
      } else {
        this.$refs.name.focus();
      }
    },
     // 加载头像
    async getavatar() {
       const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
     this.avatar = '/api/photos/display?photoPath='+userInfo.userInfoDTO.avatar
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep.comment-box {
  border-top: 1px solid rgb(212, 212, 212);
  .el-input {
    padding: 10px 0;
    
  }
  .btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .comment-bod {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .comment-text {
      display: flex;
      margin: 10px 0;
      .el-image {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
  }
  .text {
    font-size: 12px;
    p {
      span {
        color: #409eff;
      }
    }
    .text-time {
      color: rgb(136, 136, 136);
      margin: 3px 0;
    }
  }
  .icon-box {
    color: rgb(117, 117, 117);
    margin: 10px 0;
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
  .reply-comment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      margin: 5px 0;
      margin-left: 40px;
    }
  }
  .reply-reply {
    margin-left: 40px;
    padding: 10px;
    border: 1px solid rgb(212, 212, 212);
    border-radius: 5px;
    .el-input__inner {
      border: none;
    }
  }
}
</style>