<template>
  <div class="discussion-box">
    <div class="isload" v-if="isimg"></div>
    <talk-component v-for="item in tableData" :key="item.id" :data ="item" @daletedynamic='daletedynamic'/>
    <div :class="isall?'unload':'load'" v-show="isload">
      {{isall?'只有这些内容了':''}}
    </div>
  </div>
</template>

<script>
import talkComponent from '@/views/comment/talkComponent.vue'
import { getRecentlyTalk } from "@/api/comment/discussion";
export default {
  name: "",
  components: {talkComponent},
  data() {
    return {
        imageUrl:'',
        total: 0,//总条数
        pagination:0,//页数
      pagesize: 5,//条数
      current: 1,//页码
      tableData:[],
      isload:false,//加载动画
      isall:false,
isimg:true
    };
  },
  created() {
    this.onLoad(this.current);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll,true);
  },
  methods: {
handleScroll(e){
      const scrollheight = e.target.clientHeight+e.target.scrollTop
      const height = e.target.scrollHeight
      if (scrollheight >= height) {
        this.isload =true
        this.current+=1
        if (this.current<=this.pagination) {
          this.isall = false
         getRecentlyTalk(this.pagesize, this.current).then((res) => {
        const data = res.data.data;
this.tableData=this.tableData.concat(data.recordList);
      this.total = data.count;
        
      });
         return
          }else{
            this.isall = true
            return
          }
      }
    },
    daletedynamic(){
      this.onLoad()
    },
    // 进入加载
    onLoad(value){
      const pagesize = this.pagesize;
      getRecentlyTalk(pagesize, value).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
      this.total = data.count;
    this.pagination =Math.ceil(this.total/this.pagesize) 
    this.isimg = false
      });
    },
  },
  beforeDestroy() { // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll,true)
   },
};
</script>
<style lang='scss' scoped>
.discussion-box{
  .isload{
        height: 600px;
        background: url(@/assets/load.gif) no-repeat;
    background-size: 300px;
    background-position: 170px 100px;
    background-color: white;
    }
  .load{
    width: 100%;
    height: 40px;
    background: url(@/assets/loging.gif);
    background-size: 400px;
    background-position: 120px -125px ;
  }
  .unload{
    width: 100%;
    height: 40px;
    background: white;
    color: rgb(87, 87, 87);
    text-align: center;
    line-height: 40px;
    font-size: 13px;
  }
}
</style>