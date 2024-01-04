<template>
  <!-- 习题 -->
  <div class="box">
    <div class="content">
      <span v-show="false">{{center}}</span>
      <div class="head">{{ textlist.name }}</div>
      <el-form
        :inline="true"
        :model="textlist"
        class="demo-form-inline"
      >
      
      <div v-for="item in textlist.questionDTOs" :key="item.id">
 <el-form-item v-if="!item.hidden">
<template slot="label">
  {{item.id}}
      <p>{{item.questionTitle}}<el-image
            v-if="item.images!=null"
            style="max-width: 100px; max-height: 50px;margin: 0 7px;"
            :src="`/api/photos/display?photoPath=${item.images[0]}`"
            fit="scale-down"
          ></el-image
        >:</p>
    </template>
    <span>注释：{{item.questionDescription}}</span><br/>
    <span style="color:#F56C6C" v-if="item.type == 1||item.type == 2">注意：总和为1则表示其他的人不愿意展示自己的选项</span><br/>
    <!-- 单选 -->
          <el-radio-group v-model="item.answer" v-if="item.type == 1" @input="change($event,item)">
        <el-radio
          :label="items"
          v-for="(items, index) in item.possibleAnswerList"
          :key="index"
          ><p class="item-text" v-html="items"></p
        ><span v-if="item.possible&&textlist.status==1" class="percent">{{(item.possible[index][items]*100).toFixed(2)+"%"}}的人也选择了</span>
        </el-radio>
      </el-radio-group>
      <!-- 多选 -->
      <el-checkbox-group v-model="item.answer" v-if="item.type == 2" @change="change($event,item)">
        
        <el-checkbox
          :label="items"
          v-for="(items, index) in item.possibleAnswerList"
          :key="index"
          >
          <p class="item-text" v-html="items"></p
        ><span v-if="item.possible&&textlist.status==1" class="percent">{{(item.possible[index][items]*100).toFixed(2)+"%"}}的人也选择了</span>
        </el-checkbox>
      </el-checkbox-group>
      <!-- 填空 -->
      <el-input v-model="data[item.id]" v-if="item.type == 3 || item.type == 4"></el-input>
      <!-- 评分 -->
      <el-rate v-model="data[item.id]" v-if="item.type == 7"></el-rate>
      <!-- 下拉选择 -->
      <el-select v-model="data[item.id]" placeholder="请选择" v-if="item.type == 5">
        <el-option v-for="(items, index) in item.possibleAnswerList"
          :key="index"
          :label="items"
          :value="items"
          ></el-option>
      </el-select>
      <!-- 上传 -->
      <el-upload
        v-if="item.type == 8"
        class="upload-demo"
        drag
        action="/api/admin/questions/images"
        :on-success="function (response) {
               return imgHandleSuccess(response, item) }"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传</div>
        {{item.correctAnswerList}}
      </el-upload>
      <p v-if="item.answer&&item.type == 8">我的上传：<el-button type="text" @click="getdocument(item.answer)">{{item.answer}}</el-button></p>
      <p v-if="item.correctAnswerList&&textlist.status==2">正确答案： <el-button type="text" @click="getdocument(item.correctAnswerList)">{{item.correctAnswerList}}</el-button></p>
       <p v-if="item.questionAnalysis&&textlist.status==2">答案解析： {{item.questionAnalysis}}</p>
        </el-form-item>
      </div>
       
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="submit(data)">提交</el-button>
      </div>
    </div>
    <el-dialog title="查看详情" :visible.sync="dialogVisible">
      <iframe :src="`/api/files/display?filePath=${url}`" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { getExerciseById,postExercise,haveDoneExercise } from "@/api/study/document";
export default {
  name: "",
  components: {},
  data() {
    return {
      textlist: {},
      center:'',
      data:{},
      in:'',
      url:'',
      dialogVisible:false
    };
  },
  mounted() {
    this.onload();
  },
  methods: {
    imgHandleSuccess(res, file){
if (res.code == 510) {
        file.status = "error";
       this.$message.error(file.name + "上传服务器失败请重新上传");
      } else {
        this.data[file.id] = [res.data]
      }
    },
    // 逻辑
    change(value,list){
      const index = list.id
      const item = list.answer
      this.data[index]=item;
      if (this.textlist.cascadesMapList!=null) {
      const luoji = this.textlist.cascadesMapList[index]
      if (luoji) {
      let all = []
      for (const key in luoji) {
        all.push(luoji[key])
      }
this.textlist.questionDTOs.forEach(el => {
          if (all.includes(el.id)) {
          el.hidden = all.includes(el.id)
        }
        if (Array.isArray(item)) {
          item.forEach(element => {
            const itemindex =list.possibleAnswerList.findIndex((item)=>item==element)

              if (el.id==luoji[itemindex]) {
          el.hidden=false
        }
            
          });
        }else{
const itemindex =list.possibleAnswerList.findIndex((item)=>item==list.answer)
  if (el.id==luoji[itemindex]) {
          el.hidden=false;
        }

        }
        
      });
      }
      }
      this.center = value
    },
    getdocument(value){
        this.url=value;
        this.dialogVisible=true
    },
    // 提交问卷
    submit(value){
      this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         const list = {...value}
      for (const key in list) {
        if (!Array.isArray(list[key])) {
          list[key]= String(list[key])
          list[key]=[list[key]]
        }
      }
      const data = {
        projectId:this.$route.query.id*1,
        isDelete:0,
        answer:JSON.stringify(list)
      }
postExercise(data).then((res) => {
        this.$message({
            type: 'success',
            message: '提交成功!'
          });
}).catch((err)=>{
this.$message.error(err); 
})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
   async onload() {
const res =await getExerciseById(this.$route.query.id)
// 处理所有题
this.textlist = res.data.data;
        let hidden = [];
        for (const key in this.textlist.cascadesMapList) {
          hidden = Object.values(this.textlist.cascadesMapList[key] ).concat(hidden);
        }
        this.textlist.questionDTOs.forEach((el) => {
            el.hidden=hidden.includes(el.id)
           if(this.textlist.cascadesMapList) el.relevance={...this.textlist.cascadesMapList[el.id]}
            el.answer=el.type==2?[]:null
            el.images = JSON.parse(el.images);
        });
        haveDoneExercise(this.$route.query.id).then((res)=>{
       // 处理上次提交的题
         res.data.data.forEach(el => {
          if (el.type==7) {
            el.answerDTO.myAnswers[0] =el.answerDTO.myAnswers[0]*1
          }
    this.data[el.id] = el.answerDTO.myAnswers[0]
    let index=this.textlist.questionDTOs.find((item)=>item.id==el.id)
    index.correctAnswerList=el.answerDTO.correctAnswerList
    index.questionAnalysis = el.answerDTO.questionAnalysis
    index.possible=el.answerDTO.possibleAnswerList
    if (index.type==2) {
      index.answer=el.answerDTO.myAnswers
      this.change(el.answerDTO.myAnswers,index)
    }else{
      index.answer=el.answerDTO.myAnswers[0]
     
    }
    if (index.type==1) {
       this.change(el.answerDTO.myAnswers[0],index)
    }
  });
          }).catch((err)=>{
          })
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  min-height: 100%;
  display: flex;
  justify-content: center;
  background: #f7f8fa;
  .content {
    width: 80%;
    max-width: 1040px;
    min-height: 100%;
    background: white;
    padding-bottom: 20px;
    .head {
      height: 100px;
      background: rebeccapurple;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
    }
    .demo-form-inline {
      display: flex;
      flex-direction: column;
      .el-form-item {
        margin: 20px 50px;
        padding: 20px;
        border-radius: 5px;
        border: 1px solid rgb(228, 228, 228);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        span{
          color: #909399;
        }
        :deep(.el-form-item__label) {
          text-align: left;
          font-size: 17px;
          font-weight: 600;
          color: black;
        }
      }
    }
    .btn{
      text-align: center;
    }
  }
}
:deep(.el-upload-dragger) {
  width: 200px;
  height: 100px;
  .el-icon-upload {
    line-height: 0;
    font-size: 60px;
    margin: 30px;
    .el-upload__text {
      margin-top: 15px;
    }
  }
}
.el-radio,
.el-checkbox {
  display: flex;
  margin: 10px 0;
  align-items: center;
  :deep(.el-radio__label),:deep(.el-checkbox__label){
    display: flex;
    .percent{
      padding-left: 200px;
      color: #E6A23C !important;
    }
  }
}
</style>