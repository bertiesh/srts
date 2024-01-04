<template>
  <div class="registerbox">
<div class="registertitle">
          <img src="../assets/logo.png" alt="">
<span>培训系统</span>
      </div>
      <el-form ref="loginForm" :model="formData" :rules="loginRules">
  <el-form-item prop="username">
    <el-input v-model="formData.username" placeholder="请输入用户名">
      <template slot="prepend">邮箱</template>
    </el-input>
  </el-form-item>
  <el-form-item prop="password">
<el-input v-model="formData.password" show-password placeholder="请输入密码">
  <template slot="prepend">密码</template>
</el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" style="width: 300px" @click="login">登录</el-button>
  </el-form-item>
</el-form>
<div class="registerfoot">
<span @click="closelogin">邮箱注册</span>
</div>
  </div>
</template>

<script>
export default {
  name: "Loginpage",
  data() {
    return {
      formData: {
          username: '',
          password: '',
        },
loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
        }
  },
  mounted () {
  },
  methods:{
    
    // 去注册页面
    closelogin(){
      this.$router.push({ path: `/user/register` });
    },
    // 登录按钮
    login(){
 this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // $loading弹窗遮盖
          const loading = this.$loading({
            lock: true,
            text: "登录中,请稍后。。。",
            spinner: "el-icon-loading",
            background:"rgba(0, 0, 0, 0.8)"
          });
          // 将表单信息发送post请求
          this.$store
            .dispatch("LoginByUsername", this.formData)
            .then((res) => {
            if (res.data.data.loginType==1) {
              this.$message({
            message: "登陆成功",
            type: "success",})
            this.$store.dispatch("UserVisitWebsite")
            .then((res) => {
              this.$router.push({ path:'/' });
            }).catch((err) => {
              
                  this.$message.error(err)
        });
            }else{
               this.$confirm('账号未激活，前往激活?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit("activate",true)
        }).catch(() => {
                   
        });
            }
              loading.close(); 
            })
            .catch((err) => {
              this.$message.error(err+" 请先注册")
              loading.close();
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
 ::v-deep.registerbox{
        width: 400px;
    height: 450px;
    background: rgba(255, 255, 255, 0.753);
    border-radius: 5px;
    box-shadow: 0 0 5px 1px white;
    .registertitle{
        height: 110px;
        margin-left: 50px;
        margin-bottom: 40px;
        display: flex;
        align-items: flex-end ;
        span{
          font-size: 40px;
        }
    }
    .el-form {
  border-radius: 5px;
  margin: auto;
 .el-form-item {
    width: 300px;
    margin: 25px auto;
  } 
 .el-input__inner {
    border-radius: 0px;
    border: none;
    margin: 0 auto;
    font-size: 15px;
    line-height: 10px;
    border-bottom: 1px solid rgba(180, 180, 180, 0.589);
    background-color: rgba(255, 255, 255, 0);
    padding-left: 10px;
  }
  .el-input-group__prepend{
    padding-right: 10px;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(180, 180, 180, 0.589);
    border-radius: 0;
    color: #606266;
  }
}
.registerfoot{
  padding: 0px 50px;
    margin-bottom: 20px;
    display: flex;
  justify-content: flex-end;
            font-size: 13px;
            color: #606266;
cursor: pointer;
}

    
  }
  </style>