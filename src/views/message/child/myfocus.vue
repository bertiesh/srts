<template>
<!-- 我的消息-关注 -->
    <div v-loading="loading" v-infinite-scroll="load" infinite-scroll-delay='400'>
<div class="body" v-for="(item, index) in data"
      :key="index">
<div class="title">
    
    <div>
      <span class="name" @click="author">{{item.fromUserName}}</span>
      <span class="concent">关注了你</span>
      </div>
    <span class="time">{{item.createTime}}</span>
</div>
</div>
<el-empty v-if="data.length==0" description="暂无内容"></el-empty>
    </div>
</template>

<script>
import { getMyFocus } from "@/api/message/index";
export default {
    name: '',
    components: {},
    data () {
    return {
        data:[],
        loading:true,
        pagesize: 10, //条数
      current: 1, //页码
      count:0
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
        load(){
            if (this.pagesize<=this.count) {
                this.pagesize+= 10
            this.onload()
            }else{
                return
            }
        },
        // 进入作者详情页
        author(){},

        onload(){
            const data = {
                current:this.current,
                size:this.pagesize
            }
            getMyFocus(data).then((res) => {
        this.data =res.data.data.recordList
        this.count = res.data.data.count
      this.loading = false
      }).catch((err) => {
        this.$message.error(err);
        this.loading = false
      });
        }
    }
}
</script>
<style lang='scss' scoped>
.body{
    border-radius: 5px;
    background: white;
    margin: 10px 0;
    padding: 15px 20px;
    .title{
        display: flex;
        flex-direction: column;
          .name{
font-weight: 600;
cursor: pointer;
margin: 5px 0;
        }
        .name:hover{
            color: #409EFF;
        
        }
        .concent{
          margin-left: 3px;
          font-size: 15px;
        }
        .time{
            font-size: 13px;
            color: #909aae;
            padding-top: 7px;
        }
    }
}
.el-empty{
background: white;
margin-top: 10px;
}
</style>