<template>
  <div class="box">
    <div class="head">
      <el-input v-model="title" placeholder="输入文章标题 . . ."></el-input>
      <div class="head-btn">
        <span class="prompt">{{ articleprompt }}</span>
        
        <el-popover placement="bottom" width="600" trigger="manual" v-model="visible">
          <div class="send-box">
            <p class="box-title">
              <span>{{ $route.query.id ? "更新" : "发布" }}文章</span>
            </p>
            <el-form
              :inline="true"
              :model="formInline"
              :rules="rules"
              ref="ruleForm"
            >
              <el-form-item label="标签" prop="tag">
                <el-select
                  size="small"
                  v-model="formInline.tag"
                  multiple
                  default-first-option
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in articleTags"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item.tagName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="文章封面">
                <el-upload
                  class="avatar-uploader"
                  action="/api/users/avatar"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="coverimg" :src="`api/photos/display?photoPath=${coverimg}`" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <p v-if="!coverimg">上传封面</p>
                </el-upload>
              </el-form-item>
              <el-form-item label="文章类型" prop="type">
                <el-radio-group v-model="formInline.type">
                  <el-radio :label="1">原创</el-radio>
                  <el-radio :label="2">转载</el-radio>
                  <el-radio :label="3">翻译</el-radio>
                </el-radio-group>
                <el-input
                  v-show="formInline.type == 3 || formInline.type == 2"
                  size="small"
                  v-model="formInline.originalUrl"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="form-btn">
              <div class="btn one" @click="cancel">取消</div>
              <div slot="reference" class="btn two" @click="submit(html,status)">
                确定
              </div>
            </div>
          </div>

          <div slot="reference" class="btn">
            <span class="one" @click="openpopover(2)">草稿箱</span>
            <span class="two" @click="openpopover(1)">{{ $route.query.id ? "更新" : "发布" }}</span>
          </div>
        </el-popover>
        <el-dropdown>
          <el-image
            :lazy="true"
            :src="`/api/photos/display?photoPath=${imageUrl}`"
            fit="cover"
          ></el-image>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="info">我的主页</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <mavon-editor
      v-model="content"
      ref="md"
      @change="change"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
      @save="save"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { getArticleById } from "@/api/home/child/article";
import {
  getArticleTags,
  uploadArticlePicture,
  uploadArticle,
} from "@/api/creator/index";
export default {
  name: "",
  // 注册
  components: {
    mavonEditor,
  },
  data() {
    const TurndownService = require("turndown").default;
    return {
      turndownService:new TurndownService(),
      articleprompt: "文章将自动保存",
      articleTags: [], //文章标签
      content: "", // 输入的markdown
      html: "", // 及时转的html
      title: "", //文章标题
      imageUrl: "", //头像
      coverimg: "", //封面图片
      visible:false,
      status:'',
      formInline: {
        tag: [],
        class: "",
        type: "",
        originalUrl: "",
      },
      rules: {
        tag: [
          {
            required: true,
            message: "请至少选择一个文章标签",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请至少选择一个文章类型",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.getavatar();
  },
  methods: {
    // 封面上传成功后
    handleAvatarSuccess(res, file) {
      this.coverimg = res.data
    },
    // 上传封面之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 保存文档
    save(){
      this.visible = true
      this.status=2
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    // 上传图片
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      uploadArticlePicture($file).then((res) => {
        const url = "/api/photos/display?photoPath="+res.data.data;
        this.$refs.md.$img2Url(pos, url);
      });
    },
    // 删除图片
    $imgDel(pos) {
      delete this.img_file[pos];
    },
    // 草稿箱
    openpopover(value) {
      this.visible = true
      // this.submit(value)
      this.status=value
    },
    // 取消
cancel(){
this.visible = false
},
    // 发布
    submit(value,num) {
      const data = {
        articleContent: this.html,
        articleCover: this.coverimg,
        articleTitle: this.title,
        categoryName: "综合",
        tagNameList: this.formInline.tag,
        status: num,
        type: this.formInline.type,
        originalUrl: this.formInline.originalUrl,
      };
      if (this.$route.query.id) {
        data.id = this.$route.query.id * 1;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (data.articleContent==''||data.articleTitle=='') {
        this.$message.error("文章内容和题目不能为空！");
      }else{
        uploadArticle(data).then((res) => {
            this.$message.success(num==1?"发布成功":"保存成功");
            if (num==1) {
              window.close()
              this.$router.push({ path: "/creator/posts" });
            }
          });
      }
          
        }
      });
    },
    // 选择分类
    selectclass(index) {
      if (typeof this.classindex=="number") {
        this.classindex=""
      }else{
        this.classindex = index;
      }
      

    },
    // / 个人信息
    info() {
      this.$store.commit("SET_USER_MSG", this.userdata);
      this.$router.push({ name: "个人动态" });
    },
    // 退出登录
    logout() {
      this.$confirm("确定退出登录吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch(() => {});
    },
    // 加载头像
    async getavatar() {
      
   
      // 获得文章标签
      getArticleTags().then((res) => {
        this.articleTags = res.data.data.recordList;
        
      });
      // 获取文章内容
      if (this.$route.query.id) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getArticleById(this.$route.query.id).then((res) => {
          const data = res.data.data;
         this.content= this.turndownService.turndown(data.articleContent)
          this.title = data.articleTitle;
          // 处理文章标签
          let taglist = [];
          data.tagDTOList.forEach((el) => {
            taglist.push(el.tagName);
          });
          this.formInline.tag = taglist;
          this.coverimg =data.articleCover;
          this.formInline.type = data.type;
          loading.close();
        }).catch((err)=>{
           this.$message.error(err);
          loading.close();
        });
      }
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.imageUrl = userInfo.userInfoDTO.avatar;
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  height: 100%;
}
.head {
  padding: 20px 30px;
  display: flex;
  :deep(input::placeholder) {
    color: #84868a;
  }
  :deep(.el-input__inner) {
    border: 1px solid #ffffff;
    font-size: 22px;
    font-weight: 500;
    color: #1d2129;
  }
  .head-btn {
    display: flex;
    align-items: center;
    width: 500px;
    .prompt {
      color: #84868a;
      font-size: 14px;
    }
    .btn {
      text-align: center;
      height: 30px;
      padding: 0px 10px;
      font-size: 15px;
      display: flex;
      cursor: pointer;
      align-items: center;
          width: 150px;
    justify-content: space-between;
    }
    .two {
      color: #1d7dfa;
      border: 1px solid #1d7dfa;
      padding:5px 10px;
    }
    .one {
      background: #1d7dfa;
      color: white;
      padding:5px 10px;
      border: 1px solid #1d7dfa;
    }
    .one:hover {
      background: #1d7dfae0;
    }
    .el-image {
      width: 35px;
      height: 35px;
      cursor: pointer;
      margin-left: 20px;
    }
  }
}
.markdown-body {
  height: calc(100% - 80px);
}
.el-popover {
  padding: 0;
  .send-box {
    .box-title {
      padding: 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .form-btn {
      display: flex;
      flex-direction: row-reverse;
      padding: 20px;
      padding-bottom: 10px;
      .btn{
        text-align: center;
        width: 50px;
        height: 30px;
        line-height: 30px;
        padding: 0px 10px;
        font-size: 15px;
        margin-left: 20px;
        cursor: pointer;
        border: 1px solid #1d7dfa;
      }
      .one {
        color: #1d7dfa;
      }
      .two {
        background: #1d7dfa;
        color: white;
        width: 80px;
      }
      .two:hover {
        background: #1d7dfae0;
      }
    }
    .el-form {
      padding: 20px;
      border-top: 1px solid #e5e6eb;
      border-bottom: 1px solid #e5e6eb;
      .el-form-item {
        width: 100%;
      }
      .el-tag {
        margin: 0 5px;
      }
      .el-tag:hover {
        background: #ececec;
        cursor: pointer;
      }
      :deep(.avatar-uploader .el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: #fafafa;
      }
      :deep(.avatar-uploader-icon) {
        color: #8c939d;
        width: 180px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 18px;
      }
      :deep(.avatar) {
        width: 180px;
        height: 80px;
        display: block;
        object-fit: cover;
      }
    }
  }
}
</style>