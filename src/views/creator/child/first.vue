<template>
  <div>
    <div class="data">
      <div class="data-title">
        <span>数据概览</span>
        <el-tooltip placement="bottom" effect="light">
          <div slot="content">
            展示指标为关注者数为关注者数为关注者数为关注者数
          </div>
          <i class="iconfont icon-changjianwentixiangguanwenti"></i>
        </el-tooltip>
      </div>
      <div class="box">
        <div class="box-item">
          <span class="item-title">关注者总数</span>
          <span class="item-num">{{datalist.followers}}</span>
          <span class="item-time">总量</span>
        </div>
        <div class="box-item">
        <span class="item-title">文章总数</span>
          <span class="item-num">{{datalist.articleCount}}</span>
          <span class="item-time">总量</span>
        </div><div class="box-item">
          <span class="item-title">文章阅读数</span>
          <span class="item-num">{{datalist.articlesVisibleCount}}</span>
          <span class="item-time">总量</span>
        </div><div class="box-item">
          <span class="item-title">文章点赞数</span>
          <span class="item-num">{{datalist.likesCount}}</span>
          <span class="item-time">总量</span>
        </div><div class="box-item">
          <span class="item-title">文章评论数</span>
          <span class="item-num">{{datalist.commentsCount}}</span>
          <span class="item-time">总量</span>
        </div><div class="box-item">
          <span class="item-title">文章浏览数</span>
          <span class="item-num">{{datalist.viewsCount}}</span>
          <span class="item-time">总量</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCreatorHome } from "@/api/creator/index";
export default {
  name: "",
  components: {},
  data() {
    return {
      datalist:{}
    };
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload(){
      getCreatorHome().then((res)=>{
         this.datalist = res.data.data;
      })
    }
  },
};
</script>
<style lang='scss' scoped>
.data {
  background: white;
  border-radius: 2px;
  .data-title {
    padding: 20px;
    border-bottom: 1px solid rgb(212, 212, 212);
    span {
      font-size: 18px;
      margin-right: 5px;
    }
  }
  .box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px 10px;
    padding-bottom: 0;
    .box-item {
      width: 200px;
      height: 80px;
      background: #f7f8fa;
      margin-bottom: 20px;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      padding: 20px;
      span{
        margin-bottom: 10px;
      }
      .item-title{
        
      }
      .item-num{
        font-size: 20px;
        font-weight: 600;
      }
      .item-time{
        font-size: 14px;
        color: #4e5969;
      }
    }
  }
}
</style>