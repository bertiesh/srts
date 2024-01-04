<template>
  <!-- 个人积分页 -->
  <div class="info-msg">
    <div class="head">
      <el-button type="text" icon="el-icon-arrow-left" @click="goblack">上一页</el-button>
    </div>
    <div class="body">
        <el-collapse>
  <el-collapse-item>
    <template slot="title">
      <div class="overall">
        <p>
          <span>{{ totalscores }}</span
          >积分
        </p>
        <el-button type="text"
          >积分规则</el-button>
      </div>
    </template>
    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
  </el-collapse-item>
        </el-collapse>
      <div v-for="(item, index) in datalist"
      :key="index" class="each"> 
      <div class="each-title">
        <span>{{item.event}}</span>
        <span class="each-time">{{item.createTime}}</span>
      </div>
      <div class="each-title each-last">
      <span>{{item.points >0 ? `+${item.points}`:item.points}}</span>
      <span class="each-time">剩余积分{{item.totalPoints}}</span>
      </div>
       </div>
    </div>
  </div>
</template>

<script>
import { giveUserIntegral } from "@/api/setup/users";
export default {
  name: "",
  components: {},
  data() {
    return {
      datalist:[],
      totalscores:''
    };
  },
  mounted() {
    this.onload()
  },
  methods: {
    // 返回上一页
    goblack(){
this.$router.push({ path: "/info/index/userdynamic"});
    },
    onload(){
      giveUserIntegral().then((res)=>{
        this.datalist = res.data.data
        if (this.datalist!=false) {
          this.totalscores=res.data.data[0].totalPoints
        }else{
          this.totalscores =0
        }
        
      })
    }
  },
};
</script>
<style lang='scss' scoped>
.info-msg {
  background: white;
  padding: 10px 0;
  box-shadow: 0 0 3px 1px rgb(221, 221, 221);
  .el-button {
    color: black;
  }
  .head {
    padding: 0 20px;
    border-bottom: 1px solid rgb(212, 212, 212);
  }
  .body {
    padding: 20px;
    :deep(.el-collapse){
         border: none;}
        :deep(.el-collapse-item__header){
    border: none;
           .overall {
            width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      p {
        span {
          font-weight: 600;
          font-size: 20px;
          margin-right: 5px;
        }
    }
    }
    }
    
    .each{
        display: flex;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid rgb(212, 212, 212);
.each-title{
display: flex;
flex-direction: column;
.each-time{
    padding-top: 5px;
    font-size: 15px;
color: #8590a6;
}
}
.each-last{
  align-items: flex-end;
}
    }
  }
}
</style>