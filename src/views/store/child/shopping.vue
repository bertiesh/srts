<template>
<!-- 购物车页面 -->
  <div class="box-shop">
    <div class="head">
      <span class="title">我的购物车(全部{{total}})</span>
      <div class="close-account">
        <span>已选商品</span>
        <span class="sum">{{allpoints}}</span>
        <el-button type="danger" @click="closeaccount(selectlist)" :disabled="selectlist.length==0">兑换</el-button>
      </div>
       </div>
       <div class="isload" v-if="isimg"></div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      v-else
    >
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="商品信息" width="500">
        <template slot-scope="scope">
          <div class="goods">
            <div class="good-img">
              <img
                :src="`/api/photos/display?photoPath=${scope.row.shoppingCartSKUDTO.picture}`"
                alt=""
              />
              <span>{{ scope.row.spuName }}</span>
            </div>
            <span>分类: {{scope.row.shoppingCartSKUDTO.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="积分">
        <template slot-scope="scope">
          <p>{{scope.row.subPoints}}</p>
          <p>{{scope.row.shoppingCartSKUDTO.points}}</p>
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.num"
            :min='0'
            :style="{ width: '73px' }"
             @change="numChange(scope.$index, tableData)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="totalpoints" label="总积分"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div :class="isall ? 'unload' : 'load'" v-show="isload">
      {{ isall ? "只有这些内容了" : "" }}
    </div>
  </div>
</template>

<script>
import { getUserAllShoppingList,updateUserAllShopping } from "@/api/store/shop";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [],//购物车列表
      allpoints: 0,//总价格
      selectlist:[],//已选商品
      isload: false, //加载动画
      isall: false,
      isimg: true,
      total: 0, //总条数
      pagesize: 5, //条数
      current: 1, //页码
      pagination: 0, //页数
    };
  },
  created() {
    this.onload();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
     // 监听窗口滚动
    handleScroll(e) {
      const scrollheight = e.target.clientHeight + e.target.scrollTop;
      const height = e.target.scrollHeight;
      if (scrollheight >= height) {
        this.isload = true;
        this.current += 1;
        if (this.current <= this.pagination) {
          this.isall = false;
          const data = {
        size: this.pagesize,
        current: this.current,
      };
         getUserAllShoppingList(data).then((res) => {
                  const data = res.data.data;
          this.tableData=this.tableData.concat(data.recordList);
          this.getotalpoints(this.tableData)
                this.total = data.count;
                });
          return;
        } else {
          this.isall = true;
          return;
        }
      }
    },
    // 结算商品
    closeaccount(list){
      let idlist = []
      list.forEach(el => {
        idlist.push(el.id)
      });
      this.$router.push({ 
		path: "/store/purchase",query:{
            key:JSON.stringify(idlist)
        }
	});
    },
    // 删除购物车商品
    deleteRow(index, rows) {
       this.$confirm('确定删除此商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data ={
        id:rows[index].id,
           isDelete:1
           }
            updateUserAllShopping(data).then((res) => {
        rows.splice(index, 1);
         this.$message({
          message: '删除成功',
          type: 'success'
        });
      });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 选择变化
    handleSelectionChange(val) {
      if (val.length>2) {
       this.$alert('如果需要购买10件以上商品，请分多次结算，单次最多结算10件商品', '已选商品提示！', {
          confirmButtonText: '确定',
          type: 'warning',
           callback: action => {
           this.$refs.multipleTable.clearSelection();
            val.slice(0,10).forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
           action
          }
        })
      }else{
        this.selectlist = val
      }
      this.allpoints = 0
      val.forEach(el => {
        this.allpoints +=el.totalpoints
      });
    },
    // 数量变化
    numChange(row,list){
      list[row].totalpoints=list[row].shoppingCartSKUDTO.points * list[row].num
      this.handleSelectionChange(this.selectlist)
      const data ={
        id:list[row].id,
           num:list[row].num
      }
      updateUserAllShopping(data).then((res) => {
      }).catch((err)=>{
        this.$message({
              message: err,
              type: "error",
            });
            list[row].num--
        list[row].totalpoints=list[row].shoppingCartSKUDTO.points * list[row].num
      });
    },
    // 计算表格中总积分
    getotalpoints(data){
data.forEach(el => {
  el.totalpoints = el.shoppingCartSKUDTO.points * el.num
});
    },
    // 获取购物车
    onload() {
      const data = {
        size: this.pagesize,
        current: this.current,
      };
      getUserAllShoppingList(data).then((res) => {
        const data = res.data.data;
        if (data.count!=null) {
          this.tableData = data.recordList;
        this.getotalpoints(data.recordList)
        this.total = data.count;
        this.pagination = Math.ceil(this.total / this.pagesize);
        }
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
.box-shop {
  width: 1160px;
  margin: 20px 0px;
  padding: 0 20px;
  .head {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
        background: white;
        .title{
          color: #000;
font-size: 18px;
font-weight: 600;
        }
    .close-account{
display: flex;
align-items: center;
.sum{
  margin: 0 20px;
  font-size: 22px;
color: #FF5000;
}
            :deep(.el-button--danger){
                  border: 1px solid #ff5000;
                  color: #ff3300;
                  border-radius: 10px;
                  background: white;
            }
            .is-disabled{
             border: 1px solid #d1d1d1;
                  color: #b6b6b6;
                  border-radius: 10px;
                  background: white;
            }
    }
  }
  .isload {
    height: 600px;
    background: url(@/assets/load.gif)
      no-repeat;
    background-size: 300px;
    background-position: 170px 100px;
    background-color: white;
    margin: 20px 0;
  }
  .load {
    width: 100%;
    height: 40px;
    background: url(@/assets/loging.gif)
      no-repeat;
    background-size: 400px;
    background-position: 320px -125px;
    background-color: white;
  }
  .unload {
    width: 100%;
    height: 40px;
    color: rgb(87, 87, 87);
    text-align: center;
    line-height: 40px;
    font-size: 13px;
    border-top: 1px #f0f2f7 solid;
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
            border: none;
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

            .cell {
              text-align: center;

              .goods {
                display: flex;
                justify-content: space-between;
                align-items: center;
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
              }
              .el-input-number__decrease,
              .el-input-number__increase {
                width: 20px;
                
              }
              .el-input-number--mini .el-input__inner {
    padding-left: 20px;
    padding-right: 20px;
}
.el-button--text{
  color: #ff5000;
}
            }
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