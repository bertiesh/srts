<template>
  <div class="homebox">
    <div class="put" v-if="$route.path=='/comment/discussion'">
      <div class="put-upimg" :style="{border:isfocus?'1px solid #409eff':'1px solid #dcdfe6'}">
        <el-input
          type="textarea"
          placeholder="快来分享新鲜事~"
          v-model="textarea"
          maxlength="300"
          show-word-limit
          ref="name"
          @focus="namefocus"
          @blur="nameblur"
          class="aaa"
        >
        </el-input>
        <div class="img">
         <el-upload
  action="#"
  list-type="picture-card"
  :file-list="fileList"
  :auto-upload="false" 
  :on-change="beforechange"
  :on-remove="handleRemove"
  v-show="fileList.length!=0">
    <i slot="default" class="el-icon-plus"></i>
    <div slot="fileList" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt="" loading="lazy"
      >
      <!-- 图片按钮 -->
      <span class="el-upload-list__item-actions">
        <!-- 删除 -->
        <span
          class="el-upload-list__item-delete"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>
        </div>
        <span class="words">{{textarea.length}}/300</span>
      </div>
      <div class="btn">
        <div class="btn-up">
          <emoji @emoji="getemj" @givefocus="getfocus" />
          <el-upload
            action="#"
            :auto-upload="false"
            :on-change="befor"
           list-type="picture"
           :show-file-list="false"
          >
            <i class="iconfont icon-tupian"></i>
          </el-upload>
        </div>
        <el-button type="primary" size="medium" @click="putcomment"
          >发布</el-button
        >
      </div>
    </div>
    <div class="dynamic">
      <el-row :gutter="20">
        <el-col :span="16"
          ><div class="grid-content">
            <router-view /></div
        ></el-col>
        <el-col :span="8">
          <homeright />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import emoji from "@/components/emoji.vue";
import homeright from "@/components/homeright.vue";
import { postDynamic,postDynamicImg } from "@/api/comment/discussion";
export default {
  name: "",
  components: { homeright, emoji },
  data() {
    return {
      textarea: "",
        fileList: [],
        isfocus:false,
    };
  },
  mounted() {
  },
  methods: {
    // 点击图片后将图片添加进入数组
      befor(file){
this.fileList.push(file)
      },
      // 点击加号后添加图片
      beforechange(file,fileList){
         this.fileList = fileList
      },
      // 删除图片队列中地图片
      handleRemove(file,fileList){
this.fileList = fileList
      },
    // 拿到表情
    getemj(value) {
      this.textarea += value;
    },
    // 获取焦点
    getfocus(value) {
      this.$refs.name.focus();
    },
    // 输入框获取焦点时
    namefocus(){
      this.isfocus = true
    },
    // 输入框失去焦点时
    nameblur(){
      this.isfocus =false
    },
    // 发布动态
async putcomment() {
let images
let data
if (this.fileList.length!=0) {
  let imagelist =new FormData()
this.fileList.forEach((element) => {
  imagelist.append("file", element.raw)
})
images =await postDynamicImg(imagelist)
 data ={
  content:this.textarea,
  images:JSON.stringify(images.data.data)
}
}else{
  data ={
  content:this.textarea,
}
}
postDynamic(data).then((res)=>{
this.textarea = ''
this.fileList = []
location.reload();
})
    },
  },
};
</script>
<style lang='scss' scoped>
.homebox {
  margin: 10px;
  width: 1040px;
  margin-bottom: 0;
  .put {
    width: 100%;
    background: white;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 4px 1px rgb(238, 238, 238);
    .put-upimg {
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 20px;
      position: relative;
      .img {
        :deep(.el-upload--picture-card){
        width: 80px;
        height: 80px;
        }
        :deep(.el-icon-plus){
          font-size: 18px;
          position: relative;
          bottom: 30px;
        }
        :deep(.el-upload-list__item){
          width: 80px;
        height: 80px;
        }
        .el-upload-list__item-thumbnail{
          width: 80px;
        height: 80px;
        object-fit: cover;
        }
      }
      .words{
        color: #8a919f;
        font-size: 12px;
        user-select: none;
        position: absolute;
        right: 20px;
        bottom: 10px;
      }
    }
    :deep(.el-textarea__inner) {
      height: 100px;
      border: none;
      resize: none;
    }
    .el-textarea {
      margin-bottom: 10px;
      
      :deep(.el-input__count){
      display: none;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      .btn-up {
        display: flex;
        .el-image {
          width: 40px;
        }
      }
      .icon-tupian {
        font-size: 18px;
      }
      .iconfont:hover {
        color: #409eff;
      }
    }
  }
  .dynamic {
    padding-top: 10px;
    .grid-content {
      box-shadow: 0 0 4px 1px rgb(238, 238, 238);
      border-radius: 5px;
    }
    .dynamic-right {
      .right-content {
        background: rgb(255, 255, 255);
        height: 700px;
      }
      .foote {
        height: 400px;
        background: #409eff;
      }
    }
  }
}
</style>