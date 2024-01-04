<template>
    <div class="hotspot" v-loading="isimg">
      <el-row v-for="(item, index) in data"
      :key="index">
  <el-col :span="2">
    <h4 :class="index<3?'bg':''">{{index+1}}</h4> 
  </el-col>
  <el-col :span="22">
    <h2 @click="open(item.id)">{{item.articleTitle}}</h2>
    <p :title="item.articleTitle" class="articleContent" @click="open(item.id)">{{item.articleContent}}</p>
        <p class="liulanliang"><i class="iconfont icon-liulanliang"></i>浏览量{{item.viewsCount}}</p>
  </el-col>
</el-row>
<div class="unload" v-if="!isimg"><el-divider> 只有这些内容了 </el-divider></div>
    </div>
</template>

<script>
import { getHotArticle } from "@/api/home/child/hotspot";
export default {
    name: '',
    components: {},
    data () {
    return {
        data:[],
        isimg:true
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
         // 上一篇
    open(id) {
      this.$router.push({ path: `/article/detail/${id}` });
    },
        onload(){
getHotArticle().then((res)=>{
    this.data= res.data.data
    this.isimg = false
})
        }
    }
}
</script>
<style lang='scss' scoped>
.hotspot{
    height: calc(100% - 41px);
    .el-row{
border-top: 1px #f0f2f7 solid;
padding: 10px 0;
        .el-col-2{
        padding-top: 5px;
        text-align: center;
        .bg{
            color: #ff9607;
        }
    }
    .el-col-22{
        padding-right: 20px;
        h2{
            font-size: 17px;
            padding: 5px 0;
            cursor: pointer;
        }
        
.articleContent{
    color: #535353;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
     white-space: nowrap;
     padding: 5px 0;
     cursor: pointer;
}
.liulanliang{
color: #999999;
font-size: 13px;
.icon-liulanliang{
    margin-right: 5px;
    font-size: 15px;
}
}
    }
    }
 .unload {
    padding-bottom: 25px;
  }   
}
</style>