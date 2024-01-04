<template>
<!-- 结算成功 -->
    <div class="box">
      <div class="top">您的位置：<span @click="$router.push({
                path:'/store/pointsmall'
              })">商城首页</span>><span @click="$router.push({
                path:'/store/mycenter'
              })">已兑换商品</span></div>
    <div class="head">
      <el-steps :active="stepnum" v-if="stepnum!=5">
        <el-step title="查看购物车"></el-step>
        <el-step title="兑换商品"></el-step>
        <el-step title="商品发货"></el-step>
        <el-step title="确认收货"></el-step>
      </el-steps>
      <div class="step">
        <p class="step-title" v-if="stepnum==2">当前订单状态：您已成功兑换{{tableData.totalPoints}}积分，等待发货，有疑问可以联系客服</p>
        <p class="step-title" v-if="stepnum==3">当前订单状态：订单已经发货，请查看页面下方物流信息了解详情</p>
        <p class="step-title" v-if="stepnum==4">当前订单状态：交易已成功</p>
        <p class="step-title" v-if="stepnum==5">当前订单状态：交易已关闭</p>
        <ul class="notes">
            <li>付款超过365天仍未发货，系统将自动关闭子订单并退款给您</li>
        </ul>
      </div>
    </div>
    <div class="body">
     <div class="expressage">
    <p class="title">
        物流信息
    </p>
    <ul class="concent" v-if="tableData.freights==null">
        <li>发货方式：——</li>
        <li>物流公司：——</li>
        <li>运单号码：——</li>
    </ul>
    <div v-else>
       <ul class="concent" v-for="(item, index) in tableData.freights" :key="index">
        <li>发货方式：快递</li>
        <li>物流公司：{{item.freightBrand}}</li>
        <li>运单号码：{{item.freightCode}}</li>
    </ul>
    </div>
   
     </div>
     <div class="goodmsg">
 <p class="title">
        订单信息
    </p>
    <ul class="good-concent">
        <li>
            <span class="title">收货地址：</span>
            <span v-if="tableData.userAddressDTO"> {{tableData.userAddressDTO.receiverName}}，{{tableData.userAddressDTO.phone}}，{{tableData.userAddressDTO.region.provinceName}} {{tableData.userAddressDTO.region.cityName}} {{tableData.userAddressDTO.region.districtName}} {{tableData.userAddressDTO.detailAddress}} ，{{tableData.userAddressDTO.regionCode}}</span>
        </li>
        <li>
            <span class="title">运送方式：{{$route.query.id?'快递':''}}</span>
        </li>
        <li>
            <span class="title">订单信息：</span>
            <ul class="order">
                <li>订单编号:{{tableData.orderCode}}</li>
                <li>创建时间:{{tableData.createTime}}</li>
            </ul>
            <el-table ref="multipleTable" :data="tableData.orderItemList" tooltip-effect="dark">
          <el-table-column label="商品信息" width="350">
            <template slot-scope="scope">
              <div class="good-img">
                <img
                  :src="`/api/photos/display?photoPath=${scope.row.picture}`"
                  alt=""
                />
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品属性">
            <template slot-scope="scope">
              <span>分类: {{ scope.row.skuName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="积分">
            <template slot-scope="scope">
              <p>{{ scope.row.points }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量"> </el-table-column>
          <el-table-column label="总积分">
            <template slot-scope="scope">
              <p>{{ scope.row.points*scope.row.num }}</p>
            </template>
          </el-table-column>
        </el-table>
        </li>
    </ul>
     </div>
    </div>
    </div>
</template>

<script>
import {getUserOrderNew } from "@/api/store/shop";
export default {
    name: '',
    components: {},
    data () {
    return {
        tableData: {},//购物车列表
        stepnum:0,//步骤
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
onload() {
      const data = {
        size: 1,
        current: 1,
      };
      if (this.$route.query.id) {
        getUserOrderNew({orderId:this.$route.query.id}).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList[0]
        this.stepnum = this.tableData.status+1
      });
      }else{
        this.stepnum = 2
        getUserOrderNew().then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList[0]
      });
      }
      
    },
    }
}
</script>
<style lang='scss' scoped>
.box {
  width: 1160px;
  margin: 20px 0px;
  padding: 0 20px;
  .top{
    padding: 20px;
    padding-top: 30px;
    background: white;
    span{
      color: #409EFF;
    }
    span:hover{
      color: #ff5500;
      cursor: pointer;
    }
  }
  .head {
    padding: 20px;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
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
    .step{
        width: calc(100% - 80px);
        padding: 30px;
        margin-top: 20px;
        background: #FFF7EB;
border: 1px solid #F58B0F;
.step-title{
    font-weight: 600;
}
.notes{
    padding: 20px 0 0 20px;
    font-size: 15px;
}
    }
  }
  .body{
    background: white;
    padding: 20px;
    margin-top: 20px;
    .title{
font-weight: 600;
padding: 10px;
border-bottom: 1px solid #e6e6e6;
    }
    .expressage{
        .concent{
            padding: 10px;
            list-style: none;
            li{
                color: #404040;
                font-size: 14px;
                padding: 5px;
            }
        }
    }
    .goodmsg{
        .good-concent{
            list-style: none;
            padding: 20px 0;
            li{
                padding: 10px 0;
                font-size: 15px;
                color: #404040;
                .title{
                   border: none;
                   font-size: 15px;
                }
                .order{
              list-style: none;
              display: flex;
            padding-left: 100px;
            font-size: 15px;
              li{
margin-right: 30px;
              }
                }
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