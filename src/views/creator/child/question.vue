<template>
    <div class="box">
<el-tabs v-model="activeName">
    <el-tab-pane label="常见问题" name="first">
        <el-collapse accordion>
  <el-collapse-item :title="item.question" :name="index" v-for="(item, index) in questionlist" :key="index">

    <div>{{item.answer}}</div>
  </el-collapse-item>
</el-collapse>
    </el-tab-pane>
  </el-tabs>
    </div>
</template>

<script>
import { getCommonProblem} from "@/api/creator/index";
export default {
    name: '',
    components: {},
    data () {
    return {
        activeName: 'first',
        questionlist:[],
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
        onload(){
            getCommonProblem().then((res)=>{
this.questionlist = res.data.data
            })
        }
    }
}
</script>
<style lang='scss' scoped>
.box{
    background: white;
    min-height: 100%;
    padding: 20px;
}
</style>