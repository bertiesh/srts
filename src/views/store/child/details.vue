<template>
<!-- 商品详情页面 -->
  <div class="d-box">
    <div class="left">
      <div class="goods-summary">
        <!-- 商品轮播图 -->
        <div class="goods-image">
          <el-carousel
            indicator-position="outside"
            height="370px"
            :autoplay="false"
          >
            <el-carousel-item v-for="item in goodata.pictureList" :key="item">
              <img
                :src="`/api/photos/display?photoPath=${item}`"
                alt="轮播图"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="goods-info">
          <h1 class="goods-title">{{ goodata.name }}</h1>
          <div class="goods-price">
            <strong class="goods-current-price">
              <span>积分：</span
              ><span class="goods-rmb">{{
                type.points || goodata.minPoints
              }}</span>
            </strong>
            <span class="goods-current-price"
              >销量：{{ goodata.salesCount }}</span
            >
          </div>
          <div class="goods-size">
            <span class="crosshead">规格:</span>
            <div class="size-img">
              <div
                v-for="(item, index) in goodata.skuDTOList"
                :key="index"
                class="img"
                :style="{ background: type.id == item.id ? '#f60' : '' }"
              >
                <img
                  :src="`/api/photos/display?photoPath=${item.picture}`"
                  alt=""
                  :title="item.name"
                  @click="selecttype(item)"
                />
              </div>
            </div>
          </div>
          <div class="caution">
            <span v-show="caution" class="caution-title">请选择商品规格!</span
            ><span class="crosshead" v-show="type.id"
              >库存：{{ type.stock }}</span
            >
          </div>
          <div class="goods-count">
            <span class="crosshead">数量：</span>
            <el-input-number
              size="small"
              v-model="productnum"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </div>
          <div class="goods-btn">
            <div class="btn btn-one" @click="exchange">立即兑换</div>
            <div class="btn btn-two" @click="addshop">
              <i class="iconfont icon-gouwuche"></i>加入购物车
            </div>
          </div>
        </div>
      </div>
      <div class="goods-detail">
        <div class="title">商品详情</div>
        <div class="img" v-html="goodata.description"></div>
      </div>
    </div>
    <div class="right">
      <div class="title">热门推荐</div>
      <ul class="goods">
        <li
          class="good"
          v-for="(item, index) in tableData"
          :key="index"
          @click="opengood(item.id)"
        >
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
    </div>
  </div>
</template>

<script>
import {
  getFiveGoodsList,
  getGoodsById,
  addGoodsToShop,
} from "@/api/store/shop";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: [], //热门推荐
      goodata: [], //商品详情
      productnum: "", //商品数量
      type: {}, //当前规格
      dialogVisible: false,//兑换确认信息
      caution: false,
    };
  },
  watch: {
    $route(to, from) {
      if (from.query.key != to.query.key) {
        window.location.reload();
      }
    },
  },
  mounted() {
    this.onload();
  },
  methods: {
    // 立即兑换
    exchange(){

    },
    // 加入购物车
    addshop() {
      if (this.type.id) {
        const data = {
          skuId: this.type.id,
          addNum: this.productnum,
        };
        addGoodsToShop(data).then((res) => {
          this.$message.success({
            message: "加入购物车成功",
          });
        }).catch((res) => {
          this.$message.error({
            message: res,
          });
        });
      } else {
        this.caution = true;
      }
    },
    // 选择规格
    selecttype(item) {
      this.type = item;
      this.caution = false;
    },
    // 将伦比指示器换为图片
    indicatorToimage() {
      // 获取轮播指示器
      var carouseli = document.querySelectorAll(".el-carousel__indicator");
      // 获取轮播指示器按钮
      var carouselbtn = document.querySelectorAll(".el-carousel__button");
      this.goodata.pictureList.forEach((element, index) => {
        // 创造一个img元素
        const img = document.createElement("img");
        img.src =
          "/api/photos/display?photoPath=" + element;
        // 给轮播指示器添加img元素
        carouseli[index].appendChild(img);
        const child = carouselbtn[index];
        // 删除轮播指示器btn
        carouseli[index].removeChild(child);
      });
    },
    // 进入商品详情页
    opengood(id) {
      this.$router.push({
        path: "/store/details",
        query: {
          key: id,
        },
      });
    },
    onload() {
      // 获取商品详情
      getGoodsById(this.$route.query.key).then((res) => {
        const data = res.data.data;
        this.goodata = data;
        this.$nextTick(() => {
          this.indicatorToimage();
        });
      });
      // 获取热门商品
      getFiveGoodsList().then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.d-box {
  width: 1200px;
  margin: 20px 0px;
  display: flex;
  .left {
    width: 900px;
    .goods-summary {
      height: 450px;
      background: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .goods-image {
        width: 450px;
        .el-carousel__item {
          width: 470px;
          height: 370px;
          img {
            width: 470px;
            height: 370px;
            object-fit: cover;
          }
        }
        :deep(.el-carousel__indicator) {
          padding: 4px;
          padding-bottom: 0px;
          margin-top: 20px;
          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
        }
        :deep(.el-carousel__indicator.is-active) {
          background: #f60;
        }
      }
      .goods-info {
        width: 390px;
        .goods-title {
          color: #333;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
          margin: 15px 0;
        }
        .goods-price {
          padding: 25px 10px;
          background: #fff2e8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .goods-current-price {
            color: #6c6c6c;
            font-size: 15px;
            margin-right: 10px;
            .goods-rmb {
              font-size: 24px;
              color: #f60;
              font-size: 30px;
            }
          }
        }
        .crosshead {
          color: #6c6c6c;
          font-size: 15px;
          margin-right: 10px;
        }
        .goods-size {
          display: flex;
          align-items: center;
          padding: 25px 10px;
          padding-bottom: 0;
          .size-img {
            display: flex;
            .img {
              padding: 4px;
              padding-bottom: 0;
              border: 1px solid #dcdcdc;
              margin: 0 4px;
              cursor: pointer;
              img {
                width: 45px;
                height: 45px;
                object-fit: cover;
              }
            }
            .img:hover {
              background: #f60;
            }
          }
        }
        .caution {
          padding: 10px;
          height: 20px;

          .caution-title {
            color: #ff4400;
            font-size: 15px;
            font-weight: 600;
          }
        }
        .goods-count {
          padding: 5px 10px;
        }
        .goods-btn {
          padding: 25px 10px;
          display: flex;
          .btn {
            padding: 10px 30px;
            margin-right: 10px;
            color: rgb(255, 255, 255);
            font-size: 15px;
            border-radius: 2px;
            cursor: pointer;
            .icon-gouwuche {
              margin-right: 5px;
            }
          }
          .btn-one {
            background: #ffe4d0;
            color: #e75f2e;
            border: 1px solid #f0cab6;
          }
          .btn-one:hover {
            background: #ffddc5;
          }
          .btn-two {
            background: #ff4400da;
          }
          .btn-two:hover {
            background: #ff4400;
          }
        }
      }
    }
    .goods-detail {
      padding: 20px;
      background: white;
      .title {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        background-color: #f8f8f8;
        border-top: 1px solid #e6e6e6;
        padding: 12px 15px;
        margin-bottom: 25px;
      }
    }
  }
  .right {
    width: 300px;
    .title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      padding: 20px;
      margin-left: 20px;
    }
    .goods {
      display: flex;
      flex-direction: column;
      align-items: center;
      list-style: none;
      .good {
        width: 200px;
        height: 250px;
        background: white;
        margin: 0 20px 20px 0;
        font-size: 12px;
        cursor: pointer;
        img {
          object-fit: cover;
          width: 200px;
          height: 175px;
        }
        .title {
          color: #333;
          font-weight: 600;
          padding: 10px 15px 0;
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
  }
}
</style>