<template>
  <!-- 粉丝 -->
  <div class="discussion-box">
    <div class="isload" v-if="isimg"></div>
    <div v-else>
      <div class="body" v-for="(item, index) in tableData" :key="index">
        <div class="avatar">
          <el-image :src="item.avatar" :lazy="true" fit="cover" @click="author(item.id)"> </el-image>
          <div>
            <h4 @click="author(item.id)">{{ item.nickname }}</h4>
            <p>{{ item.intro }}</p>
          </div>
        </div>
        <!-- 占位符 -->
        <el-empty v-if="!tableData" description="暂无内容"></el-empty>
        <div class="avatar-btn">
          <el-button
            type="primary"
            :icon="item.islike ? '' : 'el-icon-plus'"
            @click="attention(item)"
            @mouseenter.native="onMouseOver(item)"
            @mouseleave.native="onMouseOut(item)"
            >{{ item.islike ? item.focustitle : "关注" }}</el-button
          >
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="pagesize"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import talkComponent from "@/views/comment/talkComponent.vue";
import { getFocusMeById, giveUserAttention } from "@/api/setup/users";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: { talkComponent },
  data() {
    return {
      total: 0, //总条数
      pagesize: 10, //条数
      current: 1, //页码
      tableData: [],
      isimg: true,
      userdata: {},
      userFocusID: [],
    };
  },
  created() {
    this.getuser();
  },
  computed: {
    ...mapGetters(["usermsg"]),
  },
  mounted() {},
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
    // 鼠标移入关注按钮
    onMouseOver(value) {
      value.focustitle = "取消关注";
    },
    // 鼠标移出关注按钮
    onMouseOut(value) {
      value.focustitle = "已关注";
    },
    // 关注
    attention(value) {
      let data;
      if (value.islike) {
        this.userFocusID = this.userFocusID.filter((item) => item != value.id);
        value.islike = false;
        data = {
          userIdList: this.userFocusID,
        };
      } else {
        data = {
          followIdList: [value.id],
        };
        value.islike = true;
      }
      giveUserAttention(data).then((res) => {
        
      });
    },
    // 第几页
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad(val);
    },
    // 获取用户
    getuser() {
      this.$store
        .dispatch("GetUserInfo", this.usermsg.userInfoDTO.userInfoId)
        .then((res) => {
          this.userdata = res;
          this.userdata.userInfoDTO.usersFollowed.forEach((el) => {
            this.userFocusID.push(el.followId);
          });
          this.onLoad(this.current);
        });
    },
    // 进入加载
    async onLoad(value) {
      
      const pagesize = this.pagesize;
      const userFocus = await getFocusMeById(
        pagesize,
        value,
        this.usermsg.userInfoDTO.userInfoId
      );
      if (userFocus.data.data.recordList.length!=0) {
        // 加载头像
      userFocus.data.data.recordList.forEach((el) => {
        el.islike = this.userFocusID.includes(el.id);
        el.focustitle = "已关注";
        el.avatar = '/api/photos/display?photoPath='+el.avatar
      });
      this.tableData = userFocus.data.data.recordList
      this.isimg = false;
      }else{
        this.isimg = false;
      }
      
      this.total = userFocus.data.data.count;
    },
  },
};
</script>
<style lang='scss' scoped>
.discussion-box {
  height: 100%;
  padding: 0 20px;
  background: rgb(255, 255, 255);
  .isload {
    height: 600px;
    background: url(@/assets/load.gif)
      no-repeat;
    background-size: 300px;
    background-position: 170px 100px;
    background-color: white;
  }
  .body {
    background-color: white;
    border-top: 1px #f0f2f7 solid;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .avatar {
      display: flex;
      .el-image {
        width: 60px;
        height: 60px;
        margin-right: 20px;
        cursor: pointer;
      }
      h4{
        font-weight: 600;
      }
      h4:hover{
            color: #409EFF;
            cursor: pointer;
        }
      p {
        font-size: 15px;
        padding: 10px 0;
        color: #727272;
      }
    }
    .avatar-btn {
      display: flex;
      align-items: center;
      .el-button {
        width: 100px;
        padding: 10px 0;
      }
    }
  }
  .pagination {
    width: 100%;
    text-align: center;
    padding: 5px 0;
  }
}
</style>