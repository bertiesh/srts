<template>
    <div class="emoji-box">   
<div class="affixbox" v-show="isemoj" :style="{top:top}">
  <!-- 表情导航 -->
    <div class="emojtext">
            <span
            class="emojitems"
              v-for="(item, index) in emoji"
              :key="index"
              @click="changemj(item, index)"
              
              :style="{ background: nowindex == index ? '#d1d1d1b4' : '' }"
              >{{ item.description }}</span
            >
          </div>
          <!-- 表情列表 -->
          <div class="emojicobox">
            <span
              class="emojitems"
              title="表情"
              v-for="(items, index) in emojitem"
              :key="index"
              @click="getemj(items.unicode)"
              >{{ items.unicode }}</span
            >
          </div>
          
        </div>
        <!-- 表情按钮 -->
        <div class="icon">
            <i class="iconfont icon-smiling" title="表情" @click="showemj"></i>
          </div>
    </div>
</template>

<script>
import emojiArr from '@/config/all-emoji.json'
export default {
    name: '',
    components: {},
    props: {
    /* 配置项 */
   ison:{
      type: Boolean,
      default: () => {
        return false
      },
    },
    // 表情框位置
    top:{
      type: String,
      default:'28px',
    },
    },
    data () {
    return {
      isemoj: false,
      emoji: emojiArr,
      emojitem: [],
      nowindex: "",
    }
    },
    mounted () {
    },
    methods: {
         // 选择表情类
    changemj(value, index) {
      this.emojitem = value.emojiList;
      this.nowindex = index;
    },
    // 显示表情
    showemj() {
      this.isemoj = !this.isemoj;
      this.emojitem = emojiArr[0].emojiList;
      document.addEventListener("click",this.closeemj)
      this.$emit("givefocus",this.ison)
    },
    closeemj(e){
if (e.target.className!="emojicobox"&&e.target.className!="emojitems"&&e.target.className!="emojtext"&&e.target.className!="iconfont icon-smiling") {
  this.isemoj = false;
  document.removeEventListener("click",this.closeemj)
}

    },
    // 传递表情
    getemj(value) {
this.$emit("emoji",value,this.ison)
this.$emit("givefocus",this.ison)
    },
    }
}
</script>
<style lang='scss' scoped>
.emoji-box{
    position: relative;
    .iconfont{
        cursor: pointer;
        font-size: 20px;
        margin-right: 15px;
    }
    .iconfont:hover{
      color: #409EFF;
    }
    .affixbox {
      background: rgb(238, 238, 238);
      width: 400px;
      min-height: 235px;
      border-radius: 5px;
      position: absolute;
      z-index: 333;
    left: -15px;
    border: 1px #d1d1d1b4 solid;
      .emojtext {
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        margin: 0 5px;
        height: 35px;
        line-height: 30px;
        span {
          margin: 3px;
          border-radius: 5px;
          padding: 3px;
          padding-top: 2px;
          cursor: pointer;
        }
      }
      .emojicobox {
        overflow: auto;
        max-height: 200px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 5px;
        .emojitems{
          font-size: 19px;
          margin: 4px;
          cursor: pointer;
        }
      }
    }
}
    
</style>