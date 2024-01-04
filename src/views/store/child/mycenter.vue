<template>
  <!-- 个人中心 -->
  <div class="box">
    <div class="head">
      <!-- 个人信息 -->
      <div class="s-userbar">
        <div class="mymsg">
          <el-image :lazy="true" :src="imageUrl" fit="cover"></el-image>
          <span>{{ userdata.nickname }}</span>
        </div>
        <!-- 搜索自己购买的商品 -->
        <div class="input">
          <el-input
            v-model="search.keywords"
            placeholder="请输入商品标题进行搜索"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchall(search.keywords)"
            ></el-button>
          </el-input>
        </div>
        <span @click="goaddress">我的收货地址</span>
      </div>

      <div class="s-my-counts">
        <ul @click="navbtn">
          <li :class="search.status==undefined?'sign':''">全部</li>
          <li :class="search.status==1?'sign':''">待发货</li>
          <li :class="search.status==2?'sign':''">待收货</li>
          <li :class="search.status==3?'sign':''">已完成</li>
          <li :class="search.status==4?'sign':''">已关闭</li>
        </ul>
      </div>
    </div>
    <div class="body">
      <div class="isload" v-show="isimg"></div>
      <div class="item">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :header-cell-style="{ background: '#f5f7fa' }"
          border
        >
          <el-table-column type="selection" width="60"> </el-table-column>
          <el-table-column label="商品信息">
            <template slot-scope="scope">
              <div class="goodstitle">
                创建日期：{{ scope.row.createTime }} 订单编号：{{
                  scope.row.orderCode
                }}
              </div>
              <el-table
                ref="multipleTable"
                :data="scope.row.orderItemList"
                border
                :header-cell-style="{ background: '#f5f7fa' }"
              >
                <el-table-column width="350" label="商品">
                  <template slot-scope="scope">
                    <div class="good-img">
                      <img
                        :src="`/api/photos/display?photoPath=${scope.row.picture}`"
                        alt=""
                      />
                      <div>
                        <p>{{ scope.row.name }}</p>
                        <p>规格:{{ scope.row.skuName }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量"> </el-table-column>
                <el-table-column prop="points" label="价格"> </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            prop="totalPoints"
            label="总价"
          ></el-table-column>
          <el-table-column width="80" label="订单状态">
            <template slot-scope="scope">
              <div class="status">
                <p>
                  {{ scope.row.status == 1 ? "待发货" : "" }}
                  {{ scope.row.status == 2 ? "已发货" : "" }}
                  {{ scope.row.status == 3 ? "交易完成" : "" }}
                  {{ scope.row.status == 4 ? "已关闭" : "" }}
                </p>
                <el-button type="text" @click="godetail(scope.row)"
                  >订单详情</el-button
                >
                <el-button
                  type="text"
                  @click="gologistics(scope.row)"
                  v-if="scope.row.status == 2"
                  >查看物流</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" label="交易操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="small"
                @click="salesreturn(scope.row)"
                v-if="scope.row.status==1"
                >退货</el-button
              >
              <el-button
                type="primary"
                plain
                size="small"
                @click="affirmgood(scope.row)"
                v-if="scope.row.status==1||scope.row.status==2"
                >确认收货</el-button
              >
              
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div :class="isall ? 'unload' : 'load'" v-show="isload">
        <el-divider v-if="isall"> 只有这些内容了 </el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date";
import { getUserAllGoods,submitUserOrder,cancelUserOrder} from "@/api/store/shop";
export default {
  name: "",
  components: {},
  data() {
    return {
      imageUrl: "",
      total: 0, //总条数
      pagesize: 5, //条数
      current: 1, //页码
      tableData: [], //我的订单
      isload: false, //加载动画
      isall: false,
      search: {}, //搜索内容
      isimg: true,
      userdata: {},
    };
  },
  mounted() {
    this.getavatar();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 监听窗口滚动
    handleScroll(e) {
      const scrollheight = e.target.clientHeight + e.target.scrollTop;
      const height = e.target.scrollHeight;
      if (scrollheight >= height) {
        this.isload = true;
        if (this.pagesize >= this.total) {
          this.isall = true;
          return;
        } else {
          this.pagesize = this.pagesize + 5;
          this.isall = false;
          this.allgood();
          return;
        }
      }
    },
    // 搜索
    searchall(value) {
      if (value) {
        this.allgood();
      } else {
        this.$message.error("请重新输入");
      }
    },
    // 去订单详情页面
    godetail(data) {
      this.$router.push({
        path: "/store/finishexchange",
        query:{id:data.id}
      });
    },
    // 查看物流
    gologistics(data) {
      let routeData = this.$router.resolve({ 
		path: "/store/logistics"
	});
  window.open(routeData.href, '_blank');
    },
    // 退货
    salesreturn(data) {
      this.$confirm('确定要退货吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
cancelUserOrder(data.id).then((res) => {
        this.$message.success("退货成功");
        this.allgood()
      }).catch((err) => {
        this.$message.error(err);
      });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    // 确认收货
    affirmgood(data) {
      this.$confirm('确认收到货了吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          data.endTime = dateFormat(new Date()).replace(" ","T");
          data.status = 3
submitUserOrder(data).then((res) => {
        const data = res.data.data;
      }).catch((err) => {
        this.$message.error(err);
        data.status = 2
      });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    // 去我的地址页面
    goaddress() {
      this.$router.push({
        path: "/store/address",
      });
    },
    // 导航按钮
    navbtn(e) {
      if (e.target.nodeName == "LI") {
        switch (e.target.innerText) {
          case "全部":
            this.search.status = undefined;
            break;
          case "待发货":
            this.search.status = 1;
            break;
          case "待收货":
            this.search.status = 2;
            break;
          case "已完成":
            this.search.status = 3;
            break;
          case "已关闭":
            this.search.status = 4;
            break;
          default:
        }
        this.allgood()
      }
    },
    allgood() {
      const data = {
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
        status: this.search.status,
      };
      getUserAllGoods(data).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
        this.isimg = false;
      });
    },
    // 加载头像
    async getavatar() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.imageUrl = userInfo.userInfoDTO.avatar =
        "/api/photos/display?photoPath=" + userInfo.userInfoDTO.avatar;
      this.userdata = userInfo.userInfoDTO;
      this.allgood();
    },
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll, true);
  },
};
</script>
<style lang='scss' scoped>
.box {
  width: 1160px;
  margin: 18px 0px;
  padding: 0 20px;
  .head {
    background: white;
    .s-userbar {
      height: 80px;
      padding: 0px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mymsg {
        display: flex;
        align-items: center;
        cursor: pointer;
        .el-image {
          width: 50px;
          height: 50px;
          margin-right: 20px;
        }
      }
      .input {
        width: 650px;
        flex-shrink: 0;
      }
      span {
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      span:hover {
        color: #f60;
      }
    }

    .s-my-counts {
      height: 60px;
      padding: 0 20px;
      border-top: 1px solid #e4eaee;
      ul {
        list-style: none;
        display: flex;
        li {
          margin: 20px;
          border-right: 1px solid #e4eaee;
          padding-right: 40px;
          font-size: 15px;
          font-weight: 550;
          color: #4b4b4b;
          cursor: pointer;
        }
        li:hover {
          color: #f60;
        }
        li:last-child {
          border: none;
        }
        .sign{
           color: #f60;
        }
      }
    }
  }
  .body {
    background: white;
    margin-top: 20px;
    min-height: calc(100% - 160px);
    .isload {
      height: 600px;
      background: url(@/assets/load.gif)
        no-repeat;
      background-size: 300px;
      background-position: 420px 100px;
      background-color: white;
    }
    .item {
      padding: 10px 30px;
    }
    .load {
      width: 100%;
      height: 40px;
      background: url(@/assets/logining.gif);
      background-size: 100px;
      background-repeat: no-repeat;
      background-position: 500px 0;
    }
    .unload {
      height: 40px;
    }
  }
}
::v-deep.el-table {
  margin-bottom: 20px;
  .el-table__header-wrapper {
    .el-table__header {
      .has-gutter {
        tr {
          th {
            border: none;
            text-align: center;
          }
        }
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__body {
      tbody {
        tr {
          td {
            border: none;
            padding: 0;
            .cell {
              text-align: center;
              padding: 0;
              .good-img {
                display: flex;
                align-items: center;
                margin: 10px 0;
                margin-left: 20px;
                img {
                  width: 80px;
                  height: 80px;
                  margin-right: 20px;
                  object-fit: cover;
                }
              }
              .status {
                text-align: center;
              }
              .el-input-number__decrease,
              .el-input-number__increase {
                width: 20px;
              }
              .el-input-number--mini .el-input__inner {
                padding-left: 20px;
                padding-right: 20px;
              }
              .el-button {
                margin: 0;
              }
              .el-button--primary{
                margin-bottom: 15px;
              }
              .el-button--text:hover {
                color: #ff5000;
                cursor: pointer;
              }
              .goodstitle {
                padding: 10px;
                text-align: left;
                background: #f5f7fa;
              }
            }
          }
          .el-table-column--selection {
            display: flex;
            justify-content: space-around;
            padding-top: 10px;
            border: none;
          }
        }
        tr:hover > td.el-table__cell {
          background: none;
        }
      }
    }
  }
}
</style>