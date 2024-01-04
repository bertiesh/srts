<template>
  <div class="study" v-loading="loading">
    <!-- 轮播图 -->
    <el-carousel trigger="click" :interval="5000">
      <!-- 最近阅读 -->
    <div class="reading" v-if="lastlist">
      <p class="title">
        最近阅读
      </p>
      <div class="item" @click="openread(item)"
      v-for="item in lastlist" :key="item.id" >
        <el-image :src="`/api/photos/display?photoPath=${item.collectionCover}`" fit="cover"> </el-image>
        <div class="item-title">
          <span class="name">{{item.collectionName}}</span>
          <span class="describe">{{item.collectionDesc}}</span>
        </div>
      </div>
    </div>
      <el-carousel-item v-for="item in hotlist" :key="item.id">
       <el-image :src="item.collectionCover" fit="cover" class="slideshow" @click="openread(item)"></el-image>
      </el-carousel-item>
    </el-carousel>
    <!-- 路由 -->
    <div class="body">
      <div class="concent">
        <!-- 内容 -->
        <div v-for="(items, index) in concent" :key="index">
          <!-- 标题 -->
          <p class="title">{{ items.name }}</p>
          <div class="document" v-if="items.list">
            <div
              class="item"
              v-for="(item, index) in items.list"
              :key="index"
              @click="openread(item)"
            >
              <el-image :src="item.collectionCover" :lazy="true" fit="cover"> </el-image>
              <div class="item-title">
                <span class="name">{{
                  item.collectionName
                }}</span>
                <span class="describe">{{
                  item.collectionDesc
                }}</span>
                <p class="buy"><span v-if="item.status!=1">
                  {{item.notPurchased==1?'所需积分: '+item.status:'已兑换'}}
                </span>
                  </p>
                <p class="tip">
                  <span>{{ item.fileCount }}篇</span>
                  <span>{{ item.viewsCount || 0 }}浏览</span>
                </p>
                
              </div>
            </div>
          </div>
          <!-- 占位符 -->
          <el-empty v-else description="暂无内容"></el-empty>
          <!-- 加载更多 -->
          <div class="getmore" v-if="items.list">
            <span @click="getmore(items)">{{ items.footertitle }}</span>
          </div>
        </div>
      </div>
    </div>
    <homefooter />
  </div>
</template>

<script>
import {
  getDocumentList,
  getVideoList,
  getHotList,
  getLastList,
} from "@/api/study/document";
import homefooter from "@/components/homefooter.vue";
export default {
  name: "",
  components: { homefooter },
  data() {
    return {
      hotlist:[],//轮播图
      lastlist:{},//最近在看
      // 文档和视频
      concent: [
        {
          name: "文档",
          list: [],
          footertitle: "加载更多",
          pagesize: 6, //条数
          current: 1, //页码
        },
        {
          name: "视频",
          list: [],
          footertitle: "加载更多",
          pagesize: 6, //条数
          current: 1, //页码
        },
      ],
      loading:true
    };
  },
  created() {
    this.gethotlist(getLastList);
    this.gethotlist(getHotList);
    this.getdocument(getDocumentList, 0);
    this.getdocument(getVideoList, 1);
  },
  methods: {
    // 进入阅读页面
    openread(item) {
  this.$router.push({path:`/practise/detail/${item.id}`,query:{status:item.status}});     
    },
    // 加载更多
    getmore(value) {
      const num = Math.ceil(value.count / value.pagesize);
      if (value.current < num) {
        value.current++;
        if (value.name == "文档") {
          this.getdocument(getDocumentList, 0);
        } else if (value.name == "视频") {
          this.getdocument(getVideoList, 1);
        }
      }
    },
    //  文档
    getdocument(name, id) {
      name(this.concent[id].current, this.concent[id].pagesize).then((res) => {
        let arry = res.data.data.recordList
        arry.forEach((element) => {
        element.collectionCover = '/api/photos/display?photoPath='+element.collectionCover
        });
        this.concent[id].list=res.data.data.recordList;
        this.concent[id].count = res.data.data.count;
        const num = Math.ceil(res.data.data.count / this.concent[id].pagesize);
        if (this.concent[id].current >= num)
          this.concent[id].footertitle = "没有其他内容了";
      });
    },
    gethotlist(name){
      name().then((res) => {
        let arry = res.data.data
        if (name == getLastList) {
             this.lastlist = arry;
        }else{
           arry.forEach((element) => {
          element.collectionCover = '/api/photos/display?photoPath='+element.collectionCover
        });
        this.hotlist=arry
        }
        this.loading = false
      });
      
    }
  },
};
</script>
<style lang='scss' scoped>
.study {
  width: 100%;
  .slideshow{
    cursor: pointer;
    width: 100%;
  }
  .reading{
    width: 280px;
    height: 260px;
    background: #ffffff59;
    position: absolute;
    z-index: 66;
    // top: 65px;
    right: 70px;
    padding: 20px;
    // border-radius: 5px;
    overflow-y: scroll;
    .title {
        user-select: none;
        font-weight: 500;
        margin-bottom: 10px;
        margin-left: 10px;
      }
      .item {
          width: 240px;
          height: 80px;
          margin: 10px;
          border-radius: 5px;
          padding: 5px;
          user-select: none;
          cursor: pointer;
          display: flex;
          .el-image {
            width: 70px;
            border-radius: 5px;
          }
          .item-title {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            .describe {
              color: #5c5c5c;
              font-size: 14px;
              margin: 10px 0;
            }
            .tip {
              width: 40%;
              display: flex;
              justify-content: space-between;
              color: #5c5c5c;
              font-size: 14px;
            }
          }
        }
        .item:hover{
          background: #00000036;
        }
  }
  .body {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 100px;
    margin-top: 20px;
    .concent {
      width: 1040px;
      padding: 10px;
      .title {
        user-select: none;
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 30px;
        margin-left: 10px;
      }
      .document {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 280px;
          height: 100px;
          background: white;
          margin: 10px;
          border-radius: 5px;
          padding: 5px;
          user-select: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          .el-image {
            width: 90px;
            border-radius: 5px;
          }
          .item-title {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            .describe {
              color: #5c5c5c;
              font-size: 14px;
              margin: 5px 0;
            }
            .buy{
              margin-bottom: 7px;
              color: #ffa116;
              font-size: 14px;
              height: 19px;
            }
            .tip {
              width: 40%;
              display: flex;
              justify-content: space-between;
              color: #5c5c5c;
              font-size: 12px;
            }
          }
        }
        .item:hover {
          box-shadow: 1px 1px 3px 1px rgb(241, 241, 241);
          transform: translate(0px, -2px);
        }
        .item:hover .name {
          transform: translate(0px, -1px);
        }
      }
      .el-empty{
        background: white;
      }
      .getmore {
        padding: 10px;
        text-align: center;
        span {
          padding: 5px 30px;
          background: #eaebed;
          border-radius: 8px;
          font-size: 14px;
        }
        span:hover {
          cursor: pointer;
          background: #efeff1;
        }
      }
    }
  }
}

 

</style>