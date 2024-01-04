<template>
  <div class="box">
    <div class="left">
      <div class="msg-box">
        <!-- 消息列表 -->
        <div
          class="left-msg"
          v-for="(item, index) in usermessages"
          :key="index"
          :style="{ background: index === msgindex ? '#f6f6f6' : '' }"
          @click="openmsg(index, item, $event)"
        >
        <!-- 头像和小红点通知 -->
          <el-badge
            :hidden="item.messageUnreadCount == 0"
            :value="item.messageUnreadCount"
            :max="99"
            class="item"
          >
            <el-image
              :src="`/api/photos/display?photoPath=${item.avatar}`"
              :lazy="true"
              fit="cover"
            >
            </el-image>
          </el-badge>
          <!-- 用户名和最近一条消息 -->
          <div class="msg-name">
            <div class="name">
              <span>{{item.conversationCode.indexOf('_')!=-1?item.nickname
                  : item.conversationCode
              }}</span
              ><span class="time">{{ item.createTime.split("T")[1] }}</span>
            </div>
            <div class="concent">{{ item.messageContent.includes('hdfs')?"[图片]":item.messageContent }}</div>
          </div>
          <!-- 删除顶置按钮 -->
          <div
            class="btn"
            :style="{ background: index === msgindex ? '#f6f6f6' : '' }"
          >
            <el-dropdown>
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>删除</el-dropdown-item>
                <el-dropdown-item>顶置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="right" v-if="msgindex != null">
      <div class="title">
        {{ username.indexOf('_')!=-1? msglist.nickname:username }}
      </div>
      <!-- 聊天框信息框 -->
      <div class="msgBox" ref="msgbox" @scroll="handleScroll">
        <div class="past" v-show="ispast">
          <img src="@/assets/logining.gif" alt="" />
        </div>
        <div v-for="(item, index) in list" :key="index">
          <div v-if="minemsg.userInfoId != item.fromId" class="concent">
            <img
              :src="`/api/photos/display?photoPath=${msglist.avatar}`"
              alt=""
            />
            <div class="body">
              <p class="pleft">
                {{ msglist.nickname == "管理员" ? username : msglist.nickname
                }}<span>{{ item.createTime }}</span>
              </p>
              <div class="icon">
                <i class="iconfont icon-xiangzuo2"></i>
                <div class="textbox">
                  {{ item.messageContent }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="concent concent-mine">
            <img
              :src="`/api/photos/display?photoPath=${minemsg.avatar}`"
              alt=""

            />
            <div class="body-mine">
              <p class="pright">
                {{ item.createTime }}<span>{{ minemsg.nickname }}</span>
              </p>
              <div class="icon">
                <i class="iconfont icon-xiangyou" v-if="!item.messageContent.includes('hdfs')"></i>
                <div class="textbox textright" v-if="!item.messageContent.includes('hdfs')">{{ item.messageContent}}</div>
                <img v-else :src="`/api/photos/display?photoPath=${item.messageContent}`" alt="" class="concent-img">
              </div>
            </div>
          </div>
        </div>
        <!-- 出现滚动条 -->
        <div class="pull"></div>
      </div>
      <i class="iconfont icon-xiangxia2" @click="updown"></i>
      <div class="put" v-if="username != '系统通知'">
        <div class="btn-up">
            <emoji @emoji="getemj" @givefocus="getfocus" :top="'-250px'"/>
            <el-upload
              action="api/admin/articles/images"
              :on-error="handlePictureError"
              :on-success="handlePictureSuccess"
              list-type="picture"
              :show-file-list="false"
            >
              <i class="iconfont icon-tupian"></i>
            </el-upload>
          </div>
        <div class="put-upimg">
          <el-input
            type="textarea"
            placeholder="快来分享新鲜事~"
            v-model="textarea"
            maxlength="300"
            show-word-limit
            ref="name"
            class="aaa"
          >
          </el-input>
          <span class="words">{{ textarea.length }}/300</span>
        </div>
        <div class="btn">
          <el-button type="primary" size="medium" @click="putcomment"
            >发布</el-button
          >
        </div>
      </div>
      <div class="noput" v-else>
        要反馈 <span class="butler" @click="openbutler">@小管家</span>
      </div>
    </div>
    <div class="placeholder" v-else>暂未选中或发起聊天，快和好友聊聊吧～</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import emoji from "@/components/emoji.vue";
import homeright from "@/components/homeright.vue";
import { dateFormat } from "@/util/date";
import {
  getUserMessages,
  getUserMessageList,
  postMessageToUser,
  postMessageToHelp
} from "@/api/message/index";
export default {
  name: "",
  components: { homeright, emoji },
  data() {
    return {
      textarea: "", //输入框内容
      minemsg: {}, //个人信息
      usermessages: [], //消息列表
      msgindex: null, //当前消息序号
      msglist: {}, //当前对话人信息
      list: [], //当前信息li
      username: "", //当前对话人名字
      ispast:false,//上滑历史记录
      total: 0, //总条数
      pagination: 0, //页数
      pagesize: 5, //条数
      current: 1, //页码
    };
  },
  mounted() {
    this.onload();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 滚动事件
    handleScroll() {
      if (this.$refs.msgbox.scrollTop<=0) {
        this.ispast =true
        let msgdata =this.usermessages[this.msgindex]
        if (msgdata.size<msgdata.messageCount) {
          msgdata.size=msgdata.size+5
const data = {
          current: msgdata.current,
        size: msgdata.size,
          conversationCode: this.username,
        };
getUserMessageList(data).then((res) => {
        this.msglist = res.data.data;
        this.list = res.data.data.messages.messageList.reverse();
const total = res.data.data.messages.count;
        this.usermessages[this.msgindex].pagination = Math.ceil(total / 5);
this.ispast = false
this.$refs.msgbox.scrollTo(0,10);
      });
         return
          }else{
        this.ispast = false
        this.$refs.msgbox.scrollTo(0,10);
            return
          }
      }

    },
    // 滚动到底部
    updown(){
this.$refs.msgbox.scrollTo(0,this.$refs.msgbox.scrollHeight);
    },
    // 图片上传成功后
    handlePictureSuccess(response, file, fileList){
      if (response.code==200) {
        const time = dateFormat(new Date());
        const msglist = {
        createTime:time,
        fromId:this.minemsg.userInfoId,
        messageContent: response.data,
      }
      const data = {
        toId: this.msglist.userId,
        messageContent: response.data,
      };
      postMessageToUser(data).then((res) => {
         this.list.push(msglist)
      }).catch((err)=>{
 this.$message.error(err);
      });
      }
    },
    // 图片上传失败后
    handlePictureError(err, file, fileList){
    },
    // 拿到表情
    getemj(value) {
      this.textarea += value;
    },
    // 获取焦点
    getfocus(value) {
      this.$refs.name.focus();
    },
    // 发送消息
    putcomment() {
      const time = dateFormat(new Date());
      const msglist = {
        createTime:time,
        fromId:this.minemsg.userInfoId,
        messageContent: this.textarea,
      }
      // 判断是否给小管家发消息
   if (this.username=="小管家") {
    const data = {
        messageContent: this.textarea,
      };
      postMessageToHelp(data).then((res) => {
         this.list.push(msglist)
      }).catch((err)=>{
 this.$message.error(err);
      });
   }else{
    const data = {
        toId: this.msglist.userId,
        messageContent: this.textarea,
      };
      postMessageToUser(data).then((res) => {
         this.list.push(msglist)
      }).catch((err)=>{
 this.$message.error(err);
      });
   }
      this.textarea=''
    },
    // 从系统通知页进入小管家消息界面
    openbutler() {
      const index = this.usermessages.findIndex(
        (item) => "小管家" == item.conversationCode
      );
      this.msgindex = index;
      let msglist =this.usermessages[index];
      if (!msglist.current) msglist.current=1;
        if (!msglist.size) msglist.size=5;
        this.username = msglist.conversationCode;
      const data = {
        current: msglist.current,
        size: msglist.size,
        conversationCode: "小管家",
      };
     this.getusermsg(data)
    },
    // 获取单个用户信息
    getusermsg(data){
      getUserMessageList(data).then((res) => {
        this.msglist = res.data.data;
        this.list = res.data.data.messages.messageList.reverse();
const total = res.data.data.messages.count;
        this.usermessages[this.msgindex].pagination = Math.ceil(total / 5);
        this.$nextTick(() => {
this.$refs.msgbox.scrollTo(0,this.$refs.msgbox.scrollHeight);
})
      });
    },
    // 打开消息页面
    openmsg(index, item, event) {
      if (
        event.target.className != "el-icon-more el-dropdown-selfdefine " &&
        event.target.className != "btn" &&
        event.target.className != "el-dropdown"
      ) {
        this.msgindex = index;
        if (!item.current) item.current=1;
        if (!item.size) item.size=5;
        this.username = item.conversationCode;
        const data = {
          current: item.current,
        size: item.size,
          conversationCode: item.conversationCode,
        };
        this.getusermsg(data)
      }
    },
    // 进入加载
    async onload() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.minemsg = userInfo.userInfoDTO;
      // 获取用户信息列表
      getUserMessages().then((res) => {
        this.usermessages = res.data.data;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  width: 1000px;
  height: 750px;
  background: white;
  margin-top: 20px;
  box-shadow: 0 0 4px 0 hsla(0, 0%, 7%, 0.1);
  border-radius: 3px;
  display: flex;
  .left {
    width: 280px;
    padding: 10px 0;
    border-right: 1px solid #ebebeb;
    .msg-box {
      height: 680px;
      overflow-y: scroll;
      position: relative;
      .btn {
        height: 50px;
        background: white;
        padding: 0 10px;
        position: absolute;
        right: 0;
        opacity: 0;
        transition: opacity 0.5s;
      }
    }
    .left-msg {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      padding-left: 20px;
      border-bottom: 1px solid #f0f0f0d3;
      :deep(.el-badge__content) {
        height: 15px;
        line-height: 15px;
        padding: 0 4px;
      }
      .el-image {
        width: 40px;
        height: 40px;
        border-radius: 25px;
      }
    }
    .left-msg:hover {
      cursor: pointer;
    }
    .left-msg:hover .btn {
      opacity: 1;
    }
    .msg-name {
      padding-right: 10px;
      width: 190px;
      font-size: 15px;
      .name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        color: #444;
        .time {
          color: #999;
          font-size: 13px;
        }
      }
      .concent {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #999;
      }
    }
  }
  .right {
    width: 720px;
    position: relative;
    .title {
      height: 60px;
      border-bottom: 1px solid #ebebeb;
      text-align: center;
      line-height: 60px;
      user-select: none;
      margin: 0 10px;
    }

    .msgBox {
      height: 460px;
      background: rgb(255, 255, 255);
      overflow: auto;
      position: relative;
      .past {
        height: 50px;
        text-align: center;
        img {
          width: 80px;
        }
      }
      .concent {
        padding: 5px;
        display: flex;
        align-items: flex-start;
        margin: 0 10px;
        img {
          border-radius: 25px;
          width: 40px;
          height: 40px;
          object-fit: cover;
          margin-right: 5px;
          margin-top: 15px;
        }
        .iconfont {
          font-size: 14px;
          color: #f3f3f3;
        }

        .pleft,
        .pright {
          font-size: 12px;
          margin: 5px;
          span {
            font-size: 11px;
            margin-left: 7px;
          }
        }
        .body {
          .pleft {
            margin-left: 15px;
          }
          .icon {
            display: flex;
            align-items: flex-start;
            .icon-xiangzuo2 {
              position: relative;
              top: 10px;
              left: 4px;
            }
          }
        }
        .textbox {
          background: #f3f3f3;
          max-width: 400px;
          border-radius: 3px;
          font-size: 15px;
          padding: 5px;
          word-break: break-all;
          word-wrap: break-word;
          padding: 5px 10px;
        }
        .concent-img{
          width: 320px;
min-height: 20px;
height: 180px;
          border-radius: 8px;
    margin-right: 10px;
    margin-top: 0px;
        }
      }
      .concent-mine {
        flex-direction: row-reverse;
        .body-mine {
          .pright {
            text-align: right;
            margin-right: 15px;
          }
          .icon {
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
            .icon-xiangyou {
              position: relative;
              top: 10px;
              right: 4px;
            }
          }
        }
      }
      .pull {
        width: 1px;
        height: 1px;
        position: absolute;
        bottom: -1px;
        background: #409eff;
      }
      
    }
.icon-xiangxia2{
        background: #f3f3f3;
        padding: 5px;
            border-radius: 25px;
    position: absolute;
    right:10px;
    bottom:255px;
    cursor: pointer;
      }
    .put {
      width: 700px;
      box-sizing: border-box;
      padding: 10px;
      border-top: 1px solid #ebebeb;
      margin: 0 10px;
      .btn-up {
          display: flex;
          .el-image {
            width: 40px;
          }
        }
      .put-upimg {
        border-radius: 4px;
        padding: 10px 0;
        position: relative;
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
            flex-direction: row-reverse;
        .icon-tupian {
          font-size: 18px;
        }
        .iconfont:hover {
          color: #409eff;
        }
      }
    }
    .noput {
      height: 220px;
      width: 700px;
      box-sizing: border-box;
      border-top: 1px solid #ebebeb;
      margin: 0 10px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 14px;
      .butler {
        cursor: pointer;
        color: #a2a2a2;
      }
    }
  }
  .placeholder {
    width: 720px;
    background: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8a919f;
  }
}
</style>