<template>
  <div class="shophome">
    <!-- 积分商城首页 -->
    <div class="input">
      <el-input v-model="keywords" placeholder="请输入内容">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchall(keywords)"
        ></el-button>
      </el-input>
    </div>
    <ul class="nav">
      <li>
        <span
          @click="selectprice('')"
          :style="{ color: price == '' ? '#f60' : '' }"
          >总价格</span
        >
        <div class="icon">
          <i
            class="iconfont icon-xiangshang2"
            :style="{ color: price == 2 ? '#f60' : '' }"
            @click="selectprice(2)"
          ></i
          ><i
            class="iconfont icon-xiangxia2"
            :style="{ color: price == 1 ? '#f60' : '' }"
            @click="selectprice(1)"
          ></i>
        </div>
      </li>
      <li>
        <span
          :style="{ color: price == 3 ? '#f60' : '' }"
          @click="selectprice(3)"
          >销量</span
        >
      </li>
    </ul>
    <div class="isload" v-if="isimg"></div>
    <ul class="goods">
        <span v-show="!tableData">没有符合条件的商品</span>
      <li class="good" v-for="(item, index) in tableData" :key="index" @click="opengood(item.id)">
        <img
          :src="`/api/photos/display?photoPath=${item.cover}`"
          :alt="item.name"
        />
        <div class="title">{{ item.name }}</div>
        <div class="price-box">
          <span class="price">积分{{ item.points }}</span
          ><span>销量：{{ item.salesCount }}</span>
        </div>
      </li>
    </ul>
    <div :class="isall ? 'unload' : 'load'" v-show="isload">
      {{ isall ? "只有这些内容了" : "" }}
    </div>
  </div>
</template>
<script>
import { getAllGoodsList} from "@/api/store/shop";
export default {
  name: "",
  components: {},
  data() {
    return {
      price: '',//商品类型
      keywords:'',//搜索关键词
      isload: false, //加载动画
      isall: false,
      isimg: true,
      total: 0, //总条数
      pagesize: 5, //条数
      current: 1, //页码
      pagination: 0, //页数
      tableData: [], //商品列表
    };
  },
  created() {
    this.onload(this.current,this.price,this.keywords);
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
       type:this.price,
        keywords:this.keywords
      };
                   getArticleList(data).then((res) => {
                  const data = res.data.data;
          this.tableData=this.tableData.concat(data.recordList);
                this.total = data.count;
                });
          return;
        } else {
          this.isall = true;
          return;
        }
      }
    },
    // 进入商品详情页
    opengood(id){
        let routeData = this.$router.resolve({ 
		path: "/store/details",query:{
            key:id
        }
	});
  window.open(routeData.href, '_blank');
    },
     // 全文搜索
    searchall(value) {
    this.onload(this.current,this.price,this.keywords)
    },
    // 选择商品类型
    selectprice(num) {
      this.price = num;
      this.isimg = true;
      this.onload(this.current,this.price,this.keywords)
    },
// 获取商品
    onload(value,type,keywords) {
      const data = {
        size: this.pagesize,
        current: value,
        type,
        keywords
      };
      getAllGoodsList(data).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
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
.shophome {
  width: 1180px;
  min-height: calc(100% - 40px);
  padding: 20px 0;
  .input{
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .nav {
    display: flex;
    align-items: center;
    background: rgb(255, 255, 255);
    margin-right: 20px;
    list-style: none;
    padding: 0 10px;
    li {
      padding: 10px 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon {
        display: flex;
        flex-direction: column;
        margin-left: 5px;
        margin-top: 3px;
        .iconfont {
          font-size: 12px;
        }
      }
    }
  }
  .goods {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    .good {
      width: 275px;
      height: 375px;
      background: rgb(255, 255, 255);
      margin: 0 20px 20px 0;
      font-size: 12px;
      cursor: pointer;
      img {
        object-fit: cover;
        width: 275px;
        height: 275px;
      }
      .title {
        color: #333;
        font-weight: 600;
        padding: 20px 15px 0;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price-box {
        display: flex;
        justify-content: space-between;
        padding: 5px 15px;
        .price {
          color: #f60;
        }
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
    margin-right: 20px;
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
</style>