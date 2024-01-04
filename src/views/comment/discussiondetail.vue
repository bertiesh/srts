<template>
    <div class="body">
        <div class="heard">
            <el-button icon="el-icon-arrow-left" type="text" @click="goblack">返回</el-button>
            {{username}}
        </div>
        <div class="concent">
            <div class="isload" v-if="isimg"></div>
            <talk-component v-for="(item, index) in data" :key="index" :data ="item" :isopen='true' @daletedynamic='daletedynamic'/>
        </div>
        
<div class="unload">
      已加载完毕
    </div>
    </div>
</template>

<script>
import talkComponent from '@/views/comment/talkComponent.vue'
import { getCommentById } from "@/api/comment/discussion";
export default {
    name: '',
    components: {talkComponent},
    data () {
    return {
        data:[],
        isimg:true,
        username:""
    }
    },
    watch: {
    $route(to, from) {
      if (from.path != to.path) {
        window.location.reload();
      }
    },
  },
    created () {
        this.onload()
    },
    methods: {
        goblack(){
            this.$router.go(-1)
        },
        daletedynamic(){
            this.goblack()
        },
onload(){
    getCommentById(this.$route.params.id).then((res)=>{
this.data.push(res.data.data)
this.username = res.data.data.nickname
this.isimg = false
        }).catch((err)=>{
this.$message.error(err);
this.$router.go(-1)
        });
}
    }
}
</script>
<style lang='scss' scoped>
.body{
    background: white;
    .heard{
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        border-bottom: 1px #f0f2f7 solid;
        user-select: none;
        .el-button{
            color: black;
            float: left;
            font-size: 16px;
            font-weight: 600;
            margin-left: 10px;
        }
    }
    .concent{
        .isload{
        height: 600px;
        background: url(@/assets/load.gif) no-repeat;
    background-size: 300px;
    background-position: 170px 100px;
    background-color: white;
    }
    }
        .unload{
    width: 100%;
    height: 40px;
    background: white;
    color: rgb(87, 87, 87);
     text-align: center;
        border-top: 1px #f0f2f7 solid;
    line-height: 40px;
    font-size: 13px;
  }
    
}
</style>