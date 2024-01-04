<template>
<!-- 个人中心-我的地址 -->
    <div class="box">
<div class="nav">
              <div>我的收货地址</div>
            </div>
            <!-- //添加收货地址 -->
            <div class="form">
                <div class="added">新增收货地址</div>
                <div class="nation">当前配送 <span>中国大陆</span></div>
<el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="rules" label-width="120px" ref="ruleForm">
  <el-form-item label="地址信息：" prop="regionCode">
    <el-cascader
    placeholder="请选择省/市/区"
    size="small"
    v-model="citycode"
    :options="city"
    :props="{
       value: 'code', 
       label: 'name', 
       children: 'children', 
     }"
     @change="seclectcity"
    style="width:400px"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址：" prop="detailAddress">
    <el-input
    size="small"
  type="textarea"
  placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"
  v-model="formInline.detailAddress"
>
</el-input>
  </el-form-item>
  <el-form-item label="邮政编码：">
    <el-input
    size="small"
  placeholder="请填写邮编"
  v-model="formInline.postalCode"
  style="width:400px"
>
</el-input>
  </el-form-item>
  <el-form-item label="收货人姓名：" prop="receiverName">
    <el-input
    size="small"
  placeholder="长度不超过25个字符"
  v-model="formInline.receiverName"
  style="width:400px"
>
</el-input>
  </el-form-item>
  <el-form-item label="手机号码：" prop="phone">
    <el-input
    size="small"
  placeholder="请输入手机号"
  v-model="formInline.phone"
  style="width:400px"
>
</el-input>
  </el-form-item>
  <el-form-item>
    <el-checkbox v-model="formInline.isDefault">设置为默认收货地址</el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" size="small" @click="onsubmit(formInline)">保存</el-button>
  </el-form-item>
</el-form>
            </div>
            <!-- 所有收货地址 -->
            <div class="address">
              <div class="title">只保存了5条地址呦</div>
              <div class="table">
                <el-table
    :data="tableData"
    :header-cell-style="{background:'#ebecf0','text-align':'center'}"
    :cell-style="{'text-align':'center'}"
    :style="{'font-size':'12px'}">
    <el-table-column
      prop="receiverName"
      label="收货人">
    </el-table-column>
    <el-table-column
      label="所在地区">
      <template slot-scope="scope">
        {{scope.row.address}}
      </template>
    </el-table-column>
    <el-table-column
      prop="detailAddress"
      label="详细地址">
    </el-table-column>
    <el-table-column
      prop="postalCode"
      label="邮编">
      <template slot-scope="scope">
        {{scope.row.postalCode||'000000'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="phone"
      label="电话/手机">
    </el-table-column>
     <el-table-column
      label="操作">
       <template slot-scope="scope">
        <el-button @click="revise(scope.row)" type="text" size="small">修改</el-button>
        <el-button type="text" size="small" @click="deleterow(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
     <el-table-column
      label="">
      <template slot-scope="scope">
        <el-button @click="setdefault(scope.row)" type="text" size="small" v-if="!scope.row.isDefault">设为默认</el-button>
         <el-button size="small" v-else>默认地址</el-button>
      </template>
    </el-table-column>
  </el-table>
              </div>
            </div>
    </div>
</template>

<script>
import {isMobile} from '@/util/validate'
import { getCityList,getUserAddressList,postUserAddress } from "@/api/store/shop";
export default {
    name: '',
    components: {},
    data () {
      var phonenum = (rule, value, callback) => {
       if (isMobile(value)) {
        callback();
       }else{
        callback(new Error('手机号不规范！'));
       }
      };
    return {
        formInline: {
          regionCode: '',
          detailAddress: '',
          postalCode:'',
          receiverName:'',
          phone:'',
          isDefault:'',
        },
        citycode:[],//地址代码
        city:[],//省市区数据
     rules: {
	regionCode: [{required: true, trigger: 'blur', message: '请选择地址'}],
    detailAddress: [{required: true, trigger: 'blur', message: '详细地址长度需要在5-120个汉字或字符，不能包含表情符号'}],
    receiverName: [{required: true, trigger: 'blur', message: '收货人姓名长度需要在2-25个汉字或字符之间，不能包含特殊字符'}],
    phone: [ { validator: phonenum, trigger: 'blur',required: true }]
},
tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        }]
    }
    },
    mounted () {
        this.onload()
    },
    methods: {
      // 编辑地址
      revise(scope){
        this.citycode=[scope.region.provinceCode,scope.region.cityCode,scope.region.districtCode]
        this.formInline = scope
      },
      // 删除地址
deleterow(index, rows){

let data = rows[index]
data.isDelete=true
delete data.region
postUserAddress(data).then((res)=>{
  this.$message({
          message: '删除成功',
          type: 'success'
        });
  rows.splice(index, 1);
})
},
      // 设置为默认地址
setdefault(scope){
let data = scope
data.isDefault=true
delete data.region
postUserAddress(data).then((res)=>{
  this.$message({
          message: '设置成功',
          type: 'success'
        });
  data.isDefault=false
})
},
        // 保存地址
        onsubmit(data){
            this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            postUserAddress(data).then((res)=>{
              this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.$refs.ruleForm.resetFields()
        this.citycode = []
              getUserAddressList().then((res)=>{
                this.tableData = res.data.data
                this.tableData.forEach(element => {
                  element.address=element.region.provinceName+" "+element.region.cityName+" "+element.region.districtName
                });})
            })
          } else {
            return false;
          }
        });
        },
        // 选择地址代码
        seclectcity(value){
this.formInline.regionCode = value[2]
        },
        onload(){
          // 获取用户地址
          getUserAddressList().then((res)=>{
                this.tableData = res.data.data
                this.tableData.forEach(element => {
                  element.address=element.region.provinceName+" "+element.region.cityName+" "+element.region.districtName
                });
            })
          // 获取城市
            getCityList().then((res)=>{
                this.city = res.data.data[0].children
            })
        }
    }
}
</script>
<style lang='scss' scoped>
.box {
  width: 1160px;
  margin: 20px 0px;
  padding: 0 20px;
.nav {
    margin-bottom: 20px;
        display: flex;
        align-items: center;
        background: rgb(255, 255, 255);
        div {
          padding: 10px 40px;
        }
      }
      .form{
        background: white;
        padding:10px 40px;
        .added{
            padding: 10px 0;
            color: #ff5000;
            font-size: 15px;
            font-weight: 550;
        }
        .nation{
            width: 100%;
            background: #f2f2f2;
            padding: 10px 10px;
            margin: 10px 0;
            margin-bottom: 20px;
            font-size: 15px;
            span{
            font-weight: 550;
            }


}
        .el-form{
display: flex;
flex-direction: column;
:deep(.el-textarea__inner) {
      resize: none;
      width: 400px;
    }
      }
      }
      .address{
        padding: 20px;
        background: white;
        margin-top: 20px;
        .title{
      padding: 10px;
      background: #e3f2fd;
      color: #666666;
      margin-bottom: 10px;
        }
        .table{
          .el-table{
            .el-button{
              color: #666666;
            }
            .el-button:hover{
              color: #ff3300;
            }
            :deep(.el-button--default){
                  border: 1px solid #ff5000;
                  color: #ff3300;
            }
          }
        }
      }
}
</style>