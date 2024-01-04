<template>
    <div class="foot">
 <span>网站名称：{{webmsg.websiteName}}</span>
        <span>网站介绍：{{webmsg.websiteIntro}}</span>
        <span>网站备案号：{{webmsg.websiteRecordNo}}</span>
        <span>创建时间：{{webmsg.websiteCreateTime
}}</span>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'Footer',
    components: {},
    data () {
    return {
    }
    },
      computed: {
    ...mapGetters(["webmsg"]),
  },
    mounted () {},
    methods: {}
}
</script>
<style lang='scss' scoped>
.foot{
    color: #8d8d8d;
    padding: 10px;
    font-size: 13px;
}
</style>