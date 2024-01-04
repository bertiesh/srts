<template>
  <div class="homebox">
    <div>
      <el-input v-model="input" placeholder="请输入内容">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchall(input)"
        ></el-button>
      </el-input>
    </div>
    <div class="dynamic">
      <el-row :gutter="20">
        <el-col :span="16"
          ><div class="grid-content">
            <div class="nav">
              <div>综合</div>
            </div>
            <div class="discussion-box">
              <div class="isload" v-if="isimg"></div>
              <articlecom
                v-for="(item, index) in tableData"
                :key="index"
                :data="item"
              />
              <div :class="isall ? 'unload' : 'load'" v-show="isload">
                {{ isall ? "只有这些内容了" : "" }}
              </div>
            </div>
          </div></el-col
        >
        <el-col :span="8">
          <homeright />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { searchArticle } from "@/api/search/index";
import articlecom from "@/views/home/child/articlecom.vue";
import homeright from "@/components/homeright.vue";
export default {
  name: "",
  components: { homeright, articlecom },
  data() {
    return {
      input: "",
      tableData: [],
      isload: false, //加载动画
      isall: false,
      isimg: true,
    };
  },
  created() {
    this.onLoad(this.$route.query.key);
  },
  mounted() {
    this.input = this.$route.query.key;
    window.addEventListener("scroll", this.handleScroll, true);
  },
  watch: {
    $route(to, from) {
      if (from.query.key != to.query.key) {
        window.location.reload();
      }
    },
  },
  methods: {
    // 全文搜索
    searchall(value) {
      if (value != "") {
        this.$router.push({
          path: "/search",
          query: {
            key: value,
          },
        });
      } else {
        this.$message("请输入内容");
      }
    },

    // 监听窗口滚动
    handleScroll(e) {
      const scrollheight = e.target.clientHeight + e.target.scrollTop;
      const height = e.target.scrollHeight;
      if (scrollheight >= height) {
        this.isload = true;
        if (this.current <= this.pagination) {
          this.isall = false;
          return;
        } else {
          this.isall = true;
          return;
        }
      }
    },
    // 进入加载
    onLoad(value) {
      searchArticle(value).then((res) => {
        const data = res.data.data;
        this.tableData = data;
        this.pagination = Math.ceil(this.total / this.pagesize);
        this.isimg = false;
      });
    },
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll, true);
  },
};
</script>
<style lang='scss' scoped>
.homebox {
  margin: 10px;
  width: 1040px;
  margin-bottom: 0;
  .dynamic {
    padding-top: 10px;
    .grid-content {
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      border-radius: 5px;
      .nav {
        display: flex;
        align-items: center;
        background: rgb(255, 255, 255);
        div {
          padding: 10px 10px;
        }
      }
      .discussion-box {
        height: 100%;
        overflow: auto;
        .isload {
          height: 600px;
          background: url(@/assets/load.gif)
            no-repeat;
          background-size: 300px;
          background-position: 170px 100px;
          background-color: white;
        }
        .load {
          width: 100%;
          height: 40px;
          background: url(@/assets/loging.gif);
          background-size: 400px;
          background-position: 120px -125px;
        }
        .unload {
          width: 100%;
          height: 40px;
          background-color: white;
          border-top: 1px #f0f2f7 solid;
          color: rgb(87, 87, 87);
          text-align: center;
          line-height: 40px;
          font-size: 13px;
        }
      }
    }
    .dynamic-right {
      .right-content {
        background: rgb(255, 255, 255);
        height: 700px;
      }
      .foote {
        height: 400px;
        background: #409eff;
      }
    }
  }
}
</style>
