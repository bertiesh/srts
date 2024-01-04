// 购买页面
<template>
  <div class="box">
    <!-- 顶部进度条 -->
    <div class="head">
      <span class="head-title">当前进度</span>
      <el-steps :active="1">
        <el-step title="查看购物车"></el-step>
        <el-step title="兑换商品"></el-step>
        <el-step title="确认收货"></el-step>
      </el-steps>
    </div>
    <!-- 页面主体 -->
    <div class="body">
      <!-- 确认收货地址行 -->
      <div class="body-title">
        <span>确认收货地址</span>
        <span class="site" @click="toaddress">管理收货地址</span>
      </div>
      <!-- 收货地址行 -->
      <el-radio-group v-model="radio" @input="radiochange">
        <el-radio
          :label="index"
          v-for="(item, index) in addresslist"
          :key="index"
        >
          {{ item.lastaddress }} ({{ item.receiverName }} 收) {{ item.phone }}
          <span class="default" @click="setdefault(item)"
            >设置为默认收货地址</span
          >
          <span
            class="update-address"
            v-show="radio == index"
            @click="upaddress(item)"
            >修改本地址</span
          >
        </el-radio>
      </el-radio-group>
      <!-- 订单信息 -->
      <div class="table">
        <p class="table-title">确认订单信息</p>
        <!-- 商品表格 -->
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
          <el-table-column label="商品信息" width="350">
            <template slot-scope="scope">
              <div class="good-img">
                <img
                  :src="`/api/photos/display?photoPath=${scope.row.shoppingCartSKUDTO.picture}`"
                  alt=""
                />
                <span>{{ scope.row.spuName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品属性">
            <template slot-scope="scope">
              <span>分类: {{ scope.row.shoppingCartSKUDTO.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="积分">
            <template slot-scope="scope">
              <p>{{ scope.row.shoppingCartSKUDTO.points }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量"> </el-table-column>
          <el-table-column prop="totalpoints" label="总积分"> </el-table-column>
        </el-table>
        <!-- 备注 -->
        <div class="remark">
          <span class="title">备注：</span>
          <el-input
            size="small"
            type="textarea"
            placeholder="选填，请输入"
            v-model="goodremark"
          >
          </el-input>
        </div>
        <!-- 提交订单框 -->
        <div class="table-affirm">
          <div class="affirm-box">
            <p class="integral">
              总需积分: <span class="num">{{ allpoint }}</span>
            </p>
            <!-- 收货信息 -->
            <p class="integral">
              寄送至：<span class="details">
                {{ address.lastaddress }}
              </span>
            </p>
            <p>
              收货人：<span class="details">
                {{ address.receiverName }} {{ address.phone }}</span
              >
            </p>
            <!-- 提交按钮 -->
            <div class="affirm-btn">
              <div class="goshopp" @click="$router.push({
                path:'/store/shopping'
              })">返回购物车</div>
              <div class="submit" @click="submitorder">提交订单</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改默认地址 -->
    <el-dialog title="修改地址" :visible.sync="dialogTableVisible">
      <div class="form">
        <div class="nation">当前配送 <span>中国大陆</span></div>
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          :rules="rules"
          label-width="120px"
          ref="ruleForm"
        >
          <el-form-item label="地址信息：" prop="regionCode">
            <el-cascader
              placeholder="请选择省/市/区"
              size="small"
              v-model="citycode"
              :options="city"
              :props="{
                value: 'code',
                label: 'name',
                children: 'children',
              }"
              @change="seclectcity"
              style="width: 300px"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="detailAddress">
            <el-input
              size="small"
              type="textarea"
              placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"
              v-model="formInline.detailAddress"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="邮政编码：">
            <el-input
              size="small"
              placeholder="请填写邮编"
              v-model="formInline.postalCode"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="收货人姓名：" prop="receiverName">
            <el-input
              size="small"
              placeholder="长度不超过25个字符"
              v-model="formInline.receiverName"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input
              size="small"
              placeholder="请输入手机号"
              v-model="formInline.phone"
              style="width: 300px"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formInline.isDefault"
              >设置为默认收货地址</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onsubmit(formInline)"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isMobile } from "@/util/validate";
import {
  getUserAddressList,
  getUserShoppingById,
  postUserAddress,
  getCityList,
  submitUserOrder,
} from "@/api/store/shop";
import { getUserIntegral } from "@/api/user";
export default {
  name: "",
  components: {},
  data() {
    var phonenum = (rule, value, callback) => {
      if (isMobile(value)) {
        callback();
      } else {
        callback(new Error("手机号不规范！"));
      }
    };
    return {
      goodremark: "", //订单备注
      radio: 3, //默认地址索引值
      address: {}, //默认地址
      tableData: [], //购物车列表
      addresslist: [], //地址列表
      allpoint: 0, //商品总积分
      totalscores:0,//用户总积分
      dialogTableVisible: false, //是否打开弹出框
      formInline: {
        regionCode: "",
        detailAddress: "",
        postalCode: "",
        receiverName: "",
        phone: "",
        isDefault: "",
      },
      citycode: [], //地址代码
      city: [], //省市区数据
      rules: {
        regionCode: [
          { required: true, trigger: "blur", message: "请选择地址" },
        ],
        detailAddress: [
          {
            required: true,
            trigger: "blur",
            message: "详细地址长度需要在5-120个汉字或字符，不能包含表情符号",
          },
        ],
        receiverName: [
          {
            required: true,
            trigger: "blur",
            message:
              "收货人姓名长度需要在2-25个汉字或字符之间，不能包含特殊字符",
          },
        ],
        phone: [{ validator: phonenum, trigger: "blur", required: true }],
      },
    };
  },
  mounted() {
    this.onload();
  },
  methods: {
    // 更换地址
    radiochange() {
      this.$confirm("更换地址后，您需要重新确认订单信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.address = this.addresslist[this.radio];
          this.$message({
            type: "success",
            message: "更新成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更新",
          });
        });
    },
    // 管理收货地址
    toaddress() {
      this.$router.push({
        path: "/store/address",
      });
    },
    // 设置为默认地址
    setdefault(item) {
      item.isDefault = true;
      postUserAddress(item).then((res) => {
        this.$message({
          message: "设置成功",
          type: "success",
        });
      });
    },
    // 修改默认地址
    upaddress(item) {
      this.dialogTableVisible = true;
      this.citycode = [
        item.region.provinceCode,
        item.region.cityCode,
        item.region.districtCode,
      ];
      this.formInline = item;
    },
    // 选择地址代码
    seclectcity(value) {
      this.formInline.regionCode = value[2];
    },
    // 保存地址
    onsubmit(data) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          postUserAddress(data).then((res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.$refs.ruleForm.resetFields();
            this.citycode = [];
            getUserAddressList().then((res) => {
              this.addresslist = res.data.data;
              this.addresslist.forEach((el, index) => {
                if (el.isDefault) this.radio = index;
              });
            });
            this.dialogTableVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 提交订单  提醒用户商品兑换后不能退回有疑问联系客服
    submitorder() {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
if (this.totalscores<this.allpoint) {
  this.$message({
              message: "您的积分不够",
              type: "error",
            });
}else{
  let shoppingCartIds = [];
      let orderItems = {};
      this.tableData.forEach((el) => {
        shoppingCartIds.push(el.id);
        orderItems[el.shoppingCartSKUDTO.id] = el.num;
      });
      const data = {
        addressId: this.address.id,
        status: 1,
        remarks: this.goodremark,
        shoppingCartIds,
        orderItems,
      };
      submitUserOrder(data).then((res) => {
loading.close();
        this.$router.push({ path:'/store/finishexchange'});
      }).catch((err)=>{
        this.$message({
              message: err,
              type: "error",
            })
      });
}
      loading.close();
    },
    // 获取购物车
    onload() {
      // 获取订单
      const id = JSON.parse(this.$route.query.key).join(",");
      this.allpoint = 0;
      getUserShoppingById(id).then((res) => {
        this.tableData = res.data.data;
        this.tableData.forEach((el) => {
          el.totalpoints = el.shoppingCartSKUDTO.points * el.num;
          this.allpoint += el.totalpoints;
        });
      });
      //   获取用户地址
      getUserAddressList().then((res) => {
        this.addresslist = res.data.data;
        this.addresslist.forEach((el, index) => {
          el.lastaddress =
            el.region.provinceName +
            " " +
            el.region.cityName +
            " " +
            el.region.districtName +
            " " +
            el.detailAddress;
          if (el.isDefault) {
            this.radio = index;
            this.address = el;
          }
        });
      });
      // 获取城市
      getCityList().then((res) => {
        this.city = res.data.data[0].children;
      });
      getUserIntegral().then((res)=>{
        this.totalscores = res.data.data[0].totalPoints
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  width: 1160px;
  margin: 20px 0px;
  padding: 0 20px;
  .head {
    padding: 20px;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    background: white;
    .head-title {
      font-size: 20px;
      font-weight: 550;
    }
    .el-steps {
      width: 70%;
      :deep(.el-step__head.is-finish) {
        color: #ff5500;
        border-color: #ff5500;
      }
      :deep(.el-step__title.is-finish) {
        color: #ff5500;
      }
    }
  }
  .body {
    background: white;
    padding: 20px;
    .body-title {
      padding: 20px 5px;
      display: flex;
      justify-content: space-between;
      color: #333;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 2px solid #f1f1f1;
      .site {
        color: #3366cc;
      }
      .site:hover {
        color: #ff5500;
        cursor: pointer;
      }
    }
    .el-radio-group {
      display: flex;
      flex-direction: column;
      padding: 20px 0;

      .el-radio {
        padding: 10px;
        padding-left: 100px;
        margin-right: 0;
        :deep(.el-radio__input.is-checked + .el-radio__label) {
          color: #333;
          font-weight: 550;
        }
      }
      .el-radio:hover .default {
        opacity: 1;
      }
      .is-checked {
        border: 1px solid #f40;
        background-color: #fff0e8;
      }
      .default {
        color: #3366cc;
        opacity: 0;
      }
      .default:hover {
        color: #ff5500;
      }
      .update-address {
        float: right;
        color: #3366cc;
      }
    }
    .table {
      .table-title {
        padding-top: 10px;
        color: #333;
        font-weight: 700;
        font-size: 14px;
      }
      .remark {
        display: flex;
        background: #fbfcff;
        padding: 20px;
        margin-bottom: 20px;
        .title {
          width: 60px;
        }
        :deep(.el-textarea__inner) {
          resize: none;
          width: 300px;
        }
      }
      .table-affirm {
        display: flex;
        flex-direction: row-reverse;
        border-top: 1px solid #ebeef5;
        padding-top: 20px;
        .affirm-box {
          border: 1px solid #ff0036;
          padding: 20px 10px;
          text-align: right;
          font-weight: 700;
          color: #333;
          font-size: 15px;
          .integral {
            padding-bottom: 15px;
            .num {
              font: 700 26px tahoma;
              color: rgb(255, 80, 0);
            }
          }
          .details {
            font-weight: 500;
          }
          .affirm-btn {
            display: flex;
            justify-content: right;
            padding-top: 30px;
            div {
              padding: 10px 20px;
              cursor: pointer;
            }
            .goshopp:hover{
color: rgb(255, 80, 0);
            }
            .submit {
              background: #ff5000;
              color: white;
            }
          }
        }
      }
    }
  }
  .el-dialog {
    .form {
      background: white;
      padding: 10px 40px;
      .nation {
        width: 100%;
        background: #f2f2f2;
        padding: 10px 10px;
        margin: 10px 0;
        margin-bottom: 20px;
        font-size: 15px;
        span {
          font-weight: 550;
        }
      }
      .el-form {
        display: flex;
        flex-direction: column;
        :deep(.el-textarea__inner) {
          resize: none;
          width: 300px;
        }
      }
    }
  }
}
::v-deep.el-table {
  margin: 20px 0;
  .el-table__header-wrapper {
    .el-table__header {
      margin: 20px 0;
      .has-gutter {
        tr {
          th {
            text-align: center;
          }
        }
      }
    }
  }
  .el-table__body-wrapper {
    margin-bottom: 25px;
    .el-table__body {
      tbody {
        tr {
          td {
            border: none;
            background: #fbfcff;
            .cell {
              text-align: center;
              .good-img {
                display: flex;
                align-items: center;
                img {
                  width: 80px;
                  height: 80px;
                  margin-right: 20px;
                  object-fit: cover;
                }
              }
              .el-input-number__decrease,
              .el-input-number__increase {
                width: 20px;
              }
              .el-input-number--mini .el-input__inner {
                padding-left: 20px;
                padding-right: 20px;
              }
              .el-button--text {
                color: #ff5000;
              }
            }
          }
        }
        tr:hover > td.el-table__cell {
          background: #fbfcff;
        }
      }
    }
  }
}
</style>