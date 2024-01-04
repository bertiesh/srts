<template>
<!-- 我的消息-评论 -->
    <div v-loading="loading" v-infinite-scroll="load" infinite-scroll-delay='400'>
<div class="body" v-for="(item, index) in data"
      :key="index">
<div class="title">
    
    <span class="name" @click="author(item.fromUserId)">{{item.fromUserName}}</span>
    <span class="time">{{item.createTime}}</span>
    <span class="tip">评论了你的{{item.messageContent}}{{item.originalId==null?'':` -- `}}
        <span class="tip-body">{{item.originalId==null?'':`${item.commentedContent}`}}</span>
        </span>
</div>
<div class="content" @click="open(item)">
     <span v-if="item.originalId!=null" class="contentauthor">{{item.originalUserName}}</span>
    <span v-if="item.originalId!=null" class="contenttitle">{{item.originalContent}}</span>
    <span v-else  class="contenttitle">{{item.commentedContent}}</span>
 
</div>
</div>
<el-empty v-if="data.length==0" description="暂无内容"></el-empty>
    </div>
</template>

<script>
import { getMyComment } from "@/api/message/index";
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
        author(id){
            this.$store.dispatch(
        "GetUserInfo",
        id
    ).then((res)=>{
this.$store.commit('SET_USER_MSG', res)
            this.$router.push({ name: "个人动态"});
    })
            
        },
        // 进入文章页
open(value){
if (value.messageContent=="文章") {
    this.$router.push({ path: `/article/detail/${value.commentedId}`})
}else if (value.messageContent=="讨论") {
    this.$router.push({ path: `/comment/cdetail/${value.commentedId}`})
}else if (value.messageContent=="评论"){
if (value.originalType==3) {
   this.$router.push({ path: `/comment/cdetail/${value.originalId}`})
}else if (value.originalType==1) {
    this.$router.push({ path: `/article/detail/${value.originalId}`})
}
}
},
        onload(){
            const data = {
                current:this.current,
                size:this.pagesize
            }
            getMyComment(data).then((res) => {
        this.data =res.data.data.recordList
        this.count = res.data.data.count
      this.loading = false
      }).catch((err) => {
        this.$message.error(err);
        this.loading = false
      });
        }
    },
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
        .time{
            font-size: 13px;
            color: #909aae;
        }
        .tip{
            margin: 5px 0;
            font-size: 14px;
            .tip-body:hover{
color: #409EFF;
cursor: pointer;
            }
        }
    }
    .content{
        cursor: pointer;
        border-radius: 10px;
        background: #f9f9f9;
        padding: 10px;
         display: flex;
        flex-direction: column;
        .contenttitle{
         font-weight: 600;
        }
        .contentauthor{
            font-size: 15px;
            margin: 5px 0;
        }
    }
    .content:hover{
            background: #f0f0f0;
        }
}
</style>