<template>
  <div class="registerbox">
    <div class="registertitle">
      <img src="../assets/logo.png" alt="" />
      <span>培训系统</span>
    </div>
    <el-form ref="registerForm" :model="formData" :rules="registerRules">
      <el-form-item prop="invitationCode" v-if="!activate">
        <el-input v-model="formData.invitationCode" placeholder="请输入邀请码" autofocus="autofocus">
          <template slot="prepend">邀请码</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="formData.username" placeholder="请输入邮箱">
          <template slot="prepend">邮箱</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" v-if="!activate">
        <el-input v-model="formData.password" show-password placeholder="请输入密码">
          <template slot="prepend">密码</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" v-if="!activate">
        <el-input v-model="formData.confirmPassword" show-password placeholder="请输入确认密码">
          <template slot="prepend">确认密码</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="formData.code" placeholder="请输入验证码">
              <template slot="prepend">验证码</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button
              style="width: 100px"
              :disabled="authcode.iscode"
              @click="getcode"
              >{{ authcode.title }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 300px" @click="register"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
    <div class="registerfoot">
      <span @click="closeregister">账号登录</span>
    </div>
  </div>
</template>

<script>
import { getUserCode,activateUserId } from "@/api/user";
import { validateEmail } from "@/util/validate";
export default {
  name: "Loginpage",
  props: {
    /* 配置项 */
   activate:{
      type: Boolean,
      default: () => {
        return false
      },
    },
    },
  data() {
    let isEmail = (rule, value, callback) => {
      if (value) {
        if (!validateEmail(value)) {
          callback(new Error("请输入合法邮箱"));
        }
        callback();
      } else {
        callback(new Error("请输入邮箱"));
      }
    };
    return {
      formData: {
        invitationCode: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      registerRules: {
        invitationCode: [
          { required: true, message: "请输入邀请码", trigger: "blur" },
        ],
        username: [{ validator: isEmail, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      authcode: { title: "获取验证码", iscode: false },
    };
  },
  mounted() {
  },
  methods: {
    // 去登录页面
    closeregister() {
      this.$router.push({ path: `/user/login` });
    },
    // 验证码
    getcode() {
      this.authcode.iscode = true;
      let time = 60;
      this.authcode.title = time + "s后重新发送";
      let timer = setInterval(() => {
        time--;
        this.authcode.title = time + "s后重新发送";
        if (time <= 0) {
          clearInterval(timer);
          this.authcode.iscode = false;
          this.authcode.title = "获取验证码";
        }
      }, 1000);
      if (!this.authcode.iscode) return;
      if (this.formData.username) {
        getUserCode(this.formData.username).then((res) => {
          const data = res.data.data;
          this.$message({
            message: "已发送验证码",
            type: "success",
          });
        });
      } else {
        this.$message({
          message: "请输入邮箱号",
          type: "error",
        });
      }
    },
    // 注册
    register() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          // $loading弹窗遮盖
          const loading = this.$loading({
            lock: true,
            text: "注册中,请稍后。。。",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)",
          });
          if (this.activate) {
            const data={
              code:this.formData.code,
              email:this.formData.username
            }
            activateUserId(data).then((res) => {
              this.$message({
                message: "激活成功",
                type: "success",
              });
              this.closeregister();
              loading.close();
            })
            .catch((err) => {
              this.$message.error(err);
              
            });
          }else{
            // 将表单信息发送post请求
          this.$store
            .dispatch("RegisterByUsername", this.formData)
            .then((res) => {
              this.$message({
                message: "注册成功",
                type: "success",
              });
              this.closeregister();
              loading.close();
            })
            .catch((err) => {
              this.$message({
                message: err,
                type: "error",
              });
              
            });
          }
          loading.close();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.registerbox {
  width: 500px;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.753);
  border-radius: 5px;
  box-shadow: 0 0 5px 1px white;
  .registertitle {
    height: 95px;
    margin-left: 50px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 30px;
      font-weight: 550;
      margin-right: 80px;
    }
    img {
      width: 35px;
      margin-right: 15px;
    }
  }
  .el-form {
    border-radius: 5px;
    margin: auto;

    .el-form-item {
      width: 300px;
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
      border-bottom: 1px solid rgba(180, 180, 180, 0.589);
      background-color: rgba(255, 255, 255, 0);
      padding-left: 10px;
    }
    .el-input-group__prepend {
      width: 60px;
      padding:0 10px;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(180, 180, 180, 0.589);
      border-radius: 0;
      color: #606266;
    }
  }
  .registerfoot {
    padding: 0px 50px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
    color: #606266;
  }
}

</style>