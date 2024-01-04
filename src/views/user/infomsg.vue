<template>
  <div class="info-msg">
    <div class="info-avatar">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          action="/api/users/avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="filechange"
          :auto-upload="false"
          :data="filemsg"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="uploaded" v-show="isup" size="small">确定</el-button>
        <el-button type="primary" @click="unuploaded" v-show="isup" size="small">取消</el-button>
    </div>
       <el-form ref="registerForm" :model="formData" >
      <el-form-item>
        <el-input v-model="formData.nickname">
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formData.username">
          <template slot="prepend">职位</template>
        </el-input>
      </el-form-item>
       <el-form-item>
        <el-input v-model="formData.hospital">
          <template slot="prepend">医院</template>
        </el-input>
      </el-form-item>
       <el-form-item>
        <el-input v-model="formData.email">
          <template slot="prepend">邮箱</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formData.phone">
          <template slot="prepend">手机号</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formData.intro">
          <template slot="prepend">个人简介</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
        size="small"
        @click="handle(formData)"
          >修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {update } from "@/api/setup/users";
import { mapGetters } from "vuex";
export default {
  name: "pup",
  components: {},
  data() {
    return {
      imageUrl: "",
      filemsg: {},
      isup: false,
      isuploaded:true,
      formData: {
      },
    };
  },
  created() {
    this.getavatar();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 确认修改
    handle(form) {
      update(form).then(
        (res) => {
          this.$message.success("修改成功");
          this.getavatar();
        },
        (error) => {
          this.$message.error("修改信息出错!");
        }
      );
    },
    // 上传头像
    uploaded() {
        this.isuploaded = true
      this.submitUpload();
    },
    // 取消上传
    unuploaded(){
this.isuploaded = false
this.isup = false
this.submitUpload();
    },
    // 发送
    submitUpload() {
      if (this.isup) {
        this.$refs.upload.submit();
      } else {
        this.$message({
          message: "请选择图片",
          type: "error",
        });
      }
    },
    // 文件状态改变
    filechange(file) {
      this.isup = !this.isup;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 发送成功后
    handleAvatarSuccess(res, file) {
      this.$message({
        message: "上传成功",
        type: "success",
      });
      window.location.reload();
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!this.isuploaded) {
this.$message.warning("你取消了上传");
this.getavatar()
return false
      }
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
        this.getavatar()
        return false
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        this.getavatar()
        return false
      }
      
      return isJPG && isLt2M;
    },
    // 加载头像
    async getavatar() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
         this.userInfo.userInfoId
      );
      this.imageUrl = '/api/photos/display?photoPath='+userInfo.userInfoDTO.avatar
      this.formData = userInfo.userInfoDTO
    },
  },
};
</script>
<style lang='scss'>
.info-msg{
  background: white;
    padding: 10px 0;
    box-shadow: 0 0 3px 1px rgb(221, 221, 221);
    .info-avatar{
    padding: 0 0 0 150px;
    display: flex;
  align-items: flex-end;
   .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  img{
    object-fit: cover;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
} 
.el-button{
    margin-bottom: 20px;
    margin-left: 20px;
}
}
.el-form {
    border-radius: 5px;
    margin: auto;
    padding: 0 0 0 150px;
    .el-form-item {
      width: 100%;
      margin: 20px auto;
      .el-col {
        .el-button {
          background: rgba(255, 255, 255, 0);
          border: none;
          border-bottom: 1px solid rgba(180, 180, 180, 0.589);
          border-radius: 0;
        }
      }
    }
    .el-input__inner {
      border-radius: 0px;
      border: none;
      margin: 0 auto;
      font-size: 15px;
      line-height: 10px;
      border-bottom: 1px solid rgba(231, 231, 231, 0.589);
      background-color: rgba(255, 255, 255, 0);
      padding-left: 10px;
    }
    .el-input-group__prepend {
      padding-right: 10px;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(236, 236, 236, 0.589);
      border-radius: 0;
      color: #606266;
    }
  }
}


</style>