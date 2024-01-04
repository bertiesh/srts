<template>
  <div class="discussion-box" @scroll="handleScroll" ref="discussionbox">
    <div class="isload" v-if="isimg"></div>
<articlecom v-for="(item, index) in tableData"
      :key="index"
      :data="item"/>
    <div :class="isall ? 'unload' : 'load'" v-show="isload"><el-divider v-if="isall">只有这些内容了 </el-divider></div>
  </div>
</template>

<script>
import { getArticleList} from "@/api/home/child/attention";
import articlecom from './articlecom.vue';
export default {
  name: "",
  components: {articlecom},
  data() {
    return {
      imageUrl: "",
      total: 0, //总条数
      pagination: 0, //页数
      pagesize: 10, //条数
      current: 1, //页码
      tableData: [],
      isload: false, //加载动画
      isall: false,
      iscomment:false,
      commentdata:{},
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
    // 监听窗口滚动
    handleScroll(e){
      const scrollheight = e.target.clientHeight+e.target.scrollTop
      const height = e.target.scrollHeight
      if (scrollheight >= height) {
        this.isload =true
        this.current+=1
        if (this.current<=this.pagination) {
          this.isall = false
         getArticleList(this.pagesize, this.current).then((res) => {
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
    // 进入加载
    onLoad(value) {
      const pagesize = this.pagesize;
      getArticleList(pagesize, value).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
        this.pagination = Math.ceil(this.total / this.pagesize);
        this.isimg = false
      });
    },
  },
  beforeDestroy() {
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener("scroll", this.handleScroll,true);
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/home/index.scss";
</style>