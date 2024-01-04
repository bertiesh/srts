<template>
    <div class="box">
        <div class="body">
 <div class="head">{{livedata.name }}{{livedata.isLive}}</div>
 <div class="video" v-if="livedata.liveUrl">
<videoPlayer :url="$route.query.isLive!=2?livedata.liveUrl:`/api/files/display?filePath=${livedata.liveUrl}`" :ishls='$route.query.isLive!=2' :poster="`/api/photos/display?photoPath=${livedata.cover}`"></videoPlayer>
  </div>
 <div class="video-detail">
    <div class="title">直播介绍</div>
    <div class="live-anchor">
<div class="anchor">主播介绍</div>
     <ul>
        <li v-if="livedata.userInfoDTO">姓名：{{livedata.userInfoDTO.nickname}}</li>
        <li v-if="livedata.userInfoDTO">所在医院：{{livedata.userInfoDTO.hospital}}</li>
        <li v-if="livedata.userInfoDTO">邮箱：{{livedata.userInfoDTO.email}}</li>
     </ul>
    </div>
    <div class="live-anchor">
        <div class="anchor">直播描述</div>
        <div>{{livedata.description}}</div>
    </div>
 </div>
        </div>
    </div>
</template>

<script>
import videoPlayer from "@/components/PlaeryVideo.vue";
import { getLiveById } from "@/api/live/index";
export default {
    name: '',
    components: {videoPlayer},
    data () {
    return {
        livedata:{},//页面大图
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
        onload(){
      // 获取最近直播
getLiveById(this.$route.query.id).then((res)=>{
    this.livedata = res.data.data
})
    }
    }
}
</script>
<style lang='scss' scoped>
.box{
    width: 100%;
    height: 100%;
    background: url(https://p6-live.byteimg.com/tos-cn-i-gjr78lqtd0/faa3e534621e30f31b5fd87bcd31a11d.jpg~tplv-gjr78lqtd0-3:q75.png);
    display: flex;
        justify-content: center;
        overflow-y: scroll;
    .body{
        width: 1200px;
        .head{
       height: 120px;
       display: flex;
       justify-content: center;
       align-items: center;
       color: white;
       font-weight: 600;
       font-size: 30px;
        }
        .video{
            video{
                border-radius: 4px;
                 width: 100%;
            }
           
        }
        .video-detail{
            background: #202124;
            margin-top: 20px;
            color: white;
            padding: 20px;
            border-radius: 4px;
            .title{
                padding-bottom: 16px;
                border-bottom: 1px solid #343434;
            }
            .live-anchor{
                padding: 10px 0;
                .anchor{
                    font-weight: 600;
                    font-size: 17px;
                }
                ul{
                    list-style: none;
                    margin-top: 10px;
                }
            }
        }
    }
}
</style>