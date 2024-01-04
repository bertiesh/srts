<template>
<!-- 动态组件 -->
  <div class="recentiy-box">
    <el-row>
      <el-col :span="2">
        <el-image :lazy="true" :src="imageUrl" fit="cover" @click="author(data.userId)"> </el-image>
      </el-col>
      <el-col :span="22"
        >
        <div class="grid-content">
          <h5><span @click="author(data.userId)"> {{data.nickname}}</span></h5>
          <p>{{data.createTime}}</p>
          <!-- 动态正文 -->
          <div class="text-box" @click="handle(data.id)">
           {{data.content}}
           <!-- 动态中的图片 -->
           <div class="text-img" >
<el-image :lazy="true" :src="item" alt="" fit="cover" v-for="item in imgList" :key="item"/>
           </div>
          </div>
          <div class="icon-box">
            <i :class="data.isLike?'iconfont icon-dianzan_kuai':'iconfont icon-dianzan'" @click="likebtn(data.id)"><span>{{data.likeCount==null?0:data.likeCount}}</span></i>
            <i class="iconfont icon-pinglun" @click="commentbtn(data.id)"><span>{{data.commentCount==null?"评论":data.commentCount}}</span></i>
            <i class="iconfont icon-shanchu" @click="deletebtn(data.id)"  v-if="isoneself"><span>删除</span></i>
          </div>
          </div
      ></el-col>
    </el-row>
    <comment :data='commentdata' :fatherdata ="data" :type=3 v-if="iscomment" @changenum='changenum'/>
  </div>
</template>

<script>
import { giveDiscussionLike,getCommentList,daleteDynamic } from "@/api/comment/discussion";
import comment from '@/components/comment.vue';
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {comment},
    props: {
    /* 配置项 */
    data: {
      type: Object,
      default: () => {
        return null
      },
    },
    isopen: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    },
  data() {
    return {
        imageUrl:'',
        imgList:[],
        commentdata:{},
        iscomment:false,
        img:'',
        isoneself:false,
    };
  },
   computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    this.onload()
  },
  methods: {
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
        // 进入动态详情页
    handle(id){
      this.$router.push({ path: `/comment/cdetail/${id}`})
    },
    // 删除动态
    deletebtn(id){
      const data ={
        id,
        status:2
      }
      this.$alert('确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
           }).then(() => {
            daleteDynamic(data).then((res)=>{
this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit("daletedynamic")
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });   
          
        });
    },
    // 点赞
    likebtn(id){
      this.data.isLike = !this.data.isLike
      if (this.data.isLike) {
        this.data.likeCount++
      }else{
        this.data.likeCount--
      }
giveDiscussionLike(id).then((res)=>{
})
    },
    //评论之后
    changenum(value){
      if (value) this.data.commentCount++
    },
// 评论
async commentbtn(id){
const comment =await getCommentList(id)

if (comment.data.data.count!=null) {
 comment.data.data.recordList.forEach(el => {
  el.avatar ='/api/photos/display?photoPath='+el.avatar
  });
   this.commentdata = comment.data.data.recordList

}else{
  this.commentdata = []
}
this.iscomment = !this.iscomment
      
},
    async onload(){
      this.isoneself = this.data.userId==this.userInfo.userInfoId
      this.imageUrl ='/api/photos/display?photoPath='+this.data.avatar;
      if (this.data.imgList!=null) {
         this.data.imgList.forEach((el,index) => {
this.imgList[index] = '/api/photos/display?photoPath='+el 
      });
      }
      if (this.isopen) this.commentbtn(this.data.id)
    }
    
  },
};
</script>
<style lang='scss' scoped>
.recentiy-box {
  padding: 5px 20px;
  background: rgb(255, 255, 255);
  margin-bottom: 10px;
  border-radius: 5px;
  .el-image{
        width: 40px;
        height: 40px;
        margin: 10px 0;
        cursor: pointer;
    }
  .grid-content {
    padding-top: 12px;
     h5{
            margin: 5px 0;
            
            user-select: none;
            span:hover{
          color: #409EFF;
          cursor: pointer;
        }
        }
        
        p{
          font-size: 13px;
          margin: 5px 0;
          color: rgb(136, 136, 136);
        }
    .text-box {
      width: 90%;
      font-size: 15px;
      cursor: pointer;
    .text-img{
      display: flex;
  align-items: center;
      .el-image{
        width: 150px;
        height: 150px;
        margin-right: 5px;
      }
    }
    }
    .icon-box{
        color: rgb(117, 117, 117);
        margin: 10px 0;
        .iconfont{
            font-size: 18px;
            margin-right: 5px;
            cursor: pointer;
            span{
            font-size: 13px;
            padding: 0 5px 0px 5px;
          }
        }
        .icon-shanchu{
          font-size: 16px;
        }
       
    }
  }
}
</style>