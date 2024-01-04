<template>
<!-- 文章 -->
  <div class="discussion-box">
    <div class="isload" v-if="isimg"></div>
    <articlecom v-for="(item, index) in tableData" :key="index" :data ="item"/>
<!-- 占位符 -->
        <el-empty v-if="!tableData" description="暂无内容"></el-empty>
    <!-- 页码 -->
    <div class="pagination">
       <el-pagination
            @current-change="handleCurrentChange"
    layout="prev, pager, next"
    :page-size="pagesize"
    :total="total">
  </el-pagination>
    </div>
   
  </div>
</template>

<script>
import { getArticleByUserId} from "@/api/home/child/article";
import { mapGetters } from "vuex";
import articlecom from '@/views/home/child/articlecom.vue';
export default {
  name: "",
  components: {articlecom},
  data() {
    return {
        imageUrl:'',
        total: 0,//总条数
        pagination:0,//页数
      pagesize: 10,//条数
      current: 1,//页码
      tableData:[],
isimg:true,

    };
  },
  created() {
    this.onLoad(this.current);
  },
   computed: {
    ...mapGetters(["usermsg"]),
  },
  mounted() {
  },
  methods: {
    // 第几页
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad(val);
    },
    // 进入加载
    onLoad(value){
      const pagesize = this.pagesize;
      getArticleByUserId(pagesize, value,this.usermsg.userInfoDTO
.userInfoId).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
      this.total = data.count;
    this.isimg = false
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.discussion-box{
  height: 100%;
  .isload{
        height: 600px;
        background: url(@/assets/load.gif) no-repeat;
    background-size: 300px;
    background-position: 170px 100px;
    background-color: white;
    }
    .el-empty{
  background: rgb(255, 255, 255);
}
    .pagination{
      width: 100%;
      background: white;
      text-align: center;
      padding: 5px 0;
    }
}
</style>