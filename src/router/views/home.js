
export default [
// 主页path/
  {
    path: '/',
    name: '主页',
    redirect: '/home',
    component: () => import(/* webpackChunkName: "about" */ '@/views/index.vue'),
    children: [
      // 首页-/home
      {
        path: '/home',
        name: 'home',
        redirect: '/home/article',
        component: () => import(/* webpackChunkName: "about" */ '@/views/home/home.vue'),
        children: [
          // 文章-article
          {
            path: 'article',
            name: '文章',
            component: () => import(/* webpackChunkName: "about" */ '@/views/home/child/article.vue'),
          },
          // 关注-attention
          {
            path: 'attention',
            name: '关注',
            component: () => import(/* webpackChunkName: "about" */ '@/views/home/child/attention.vue'),
          },
          // 热榜-hotspot
          {
            path: 'hotspot',
            name: '热榜',
            component: () => import(/* webpackChunkName: "about" */ '@/views/home/child/hotspot.vue'),
            meta: {
              ishot: true
            }
          },
          // 新闻-news
          {
            path: 'news',
            name: '新闻',
            component: () => import(/* webpackChunkName: "about" */ '@/views/home/child/news.vue'),
            meta: {
              isnew: true
            }
          },
        ]
      },
      // 搜索-/search
      {
        path: '/search',
        name: '搜索',
        // redirect: '/search/synthesis',
        component: () => import(/* webpackChunkName: "about" */ '@/views/search/index.vue'),
      },
      // 文章详情页-/article/detail/:id
      {
        path: '/article/detail/:id',
        name: '文章详情',
        component: () => import(/* webpackChunkName: "about" */ '@/views/home/child/articledetail.vue'),
      },
      // 讨论首页-/comment
      {
        path: '/comment',
        name: '讨论首页',
        redirect: '/comment/discussion',
        component: () => import(/* webpackChunkName: "about" */ '@/views/comment/index.vue'),
        children: [
          // 讨论首页-discussion
          {
            path: 'discussion',
            name: '讨论',
            component: () => import(/* webpackChunkName: "about" */ '@/views/comment/discussion.vue'),
          },
          // 讨论详情-cdetail/:id
          {
            path: 'cdetail/:id',
            name: '讨论详情',
            component: () => import(/* webpackChunkName: "about" */ '@/views/comment/discussiondetail.vue'),
          },
        ]
      },
      // 学习-/practise
      {
        path: '/practise',
        name: '学习',
        component: () => import(/* webpackChunkName: "about" */ '@/views/study/study.vue'),
      },
      // 资料详情（文档）-/practise/detail/:id
      {
        path: '/practise/detail/:id',
        name: '资料详情',
        component: () => import(/* webpackChunkName: "about" */ '@/views/study/detail.vue'),
      },
      // 直播-//live
      {
        path: '/live',
        name: '直播',
        component: () => import(/* webpackChunkName: "about" */ '@/views/live/live.vue'),
      },
  // 直播详情-/live/livedetail
      {
        path: '/live/livedetail',
        name: '直播详情',
        component: () => import(/* webpackChunkName: "about" */ '@/views/live/livedetail.vue'),
      },
      // 个人中心-/info
      {
        path: '/info',
        name: '个人',
        redirect: '/info/index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/user/info.vue'),
        meta: {},
        children: [
          // 个人首页-index
          {
            path: 'index',
            name: '个人首页',
            component: () => import(/* webpackChunkName: "about" */ '@/views/user/index.vue'),
            redirect: '/info/index/userdynamic',
            children: [
              // 个人动态-userdynamic
              {
                path: 'userdynamic',
                name: '个人动态',
                component: () => import(/* webpackChunkName: "about" */ '@/views/user/child/userdynamic.vue'),
                meta: {
                  isuser: true
                }
              },
              // 个人文章-userarticle
              {
                path: 'userarticle',
                name: '个人文章',
                component: () => import(/* webpackChunkName: "about" */ '@/views/user/child/userarticle.vue'),
                meta: {
                  isuser: true
                }
              },
              // 个人关注-userfocus
              {
                path: 'userfocus',
                name: '个人关注',
                component: () => import(/* webpackChunkName: "about" */ '@/views/user/child/userfocus.vue'),
                meta: {
                  isuser: true
                },
                redirect: '/info/index/userfocus/myattention',
                children: [
                  // 我关注的-myattention
                  {
                    path: 'myattention',
                    name: '我关注的',
                    component: () => import(/* webpackChunkName: "about" */ '@/views/user/child/myattention.vue'),
                    meta: {
                      isuser: true
                    }
                  },
                  // 关注我的-focusme
                  {
                    path: 'focusme',
                    name: '关注我的',
                    component: () => import(/* webpackChunkName: "about" */ '@/views/user/child/focusme.vue'),
                    meta: {
                      isuser: true
                    }
                  },
                ]
              },
            ]
          },
          // 编辑个人信息-infomsg
          {
            path: 'infomsg',
            name: '个人信息',
            component: () => import(/* webpackChunkName: "about" */ '@/views/user/infomsg.vue'),
          },
          // 个人积分-integral
          {
            path: 'integral',
            name: '个人积分',
            component: () => import(/* webpackChunkName: "about" */ '@/views/user/integral.vue'),
          },
        ]
      },
      // 个人消息-/message
      {
        path: '/message',
        name: '个人消息',
        redirect: '/message/mycomment',
        component: () => import(/* webpackChunkName: "about" */ '@/views/message/index.vue'),
        children: [
          {
            path: 'mycomment',
            name: '个人消息评论',
            component: () => import(/* webpackChunkName: "about" */ '@/views/message/child/mycomment.vue'),
          },
          {
            path: 'mylike',
            name: '个人消息点赞',
            component: () => import(/* webpackChunkName: "about" */ '@/views/message/child/mylike.vue'),
          },
          {
            path: 'myfocus',
            name: '个人消息关注',
            component: () => import(/* webpackChunkName: "about" */ '@/views/message/child/myfocus.vue'),
          },
        ]
      },
      // 我的私信-/message/mymsg
      {
        path: '/message/mymsg',
        name: '我的私信',
        component: () => import(/* webpackChunkName: "about" */ '@/views/message/child/mymsg.vue'),
        meta: {
          title: "我的私信"
        },
      },
    ]
  },
  // 积分商城-/store
  {
    path: '/store',
    name: '积分商城',
    redirect: '/store/pointsmall',
    component: () => import(/* webpackChunkName: "about" */ '@/views/store/shop.vue'),
    children: [
      // 商城首页-pointsmall
      {
        path: 'pointsmall',
        name: '商城首页',
        meta: {
          title: "积分商城-首页"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/pointsmall.vue'),
      },
      // 商品详情-details
      {
        path: 'details',
        name: '商品详情',
        meta: {
          title: "积分商城-商品详情"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/details.vue'),
      },
      // 个人中心-mycenter
      {
        path: 'mycenter',
        name: '个人中心',
        meta: {
          title: "积分商城-个人中心"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/mycenter.vue'),
      },
      // 收货地址-address
      {
        path: 'address',
        name: '收货地址',
        meta: {
          title: "积分商城-收货地址"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/address.vue'),
      },
      // 购物车-shopping
      {
        path: 'shopping',
        name: '购物车',
        meta: {
          title: "积分商城-购物车"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/shopping.vue'),
      },
      // 结算订单-purchase
      {
        path: 'purchase',
        name: '结算订单',
        meta: {
          title: "积分商城-结算订单"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/purchase.vue'),
      },
      // 结算成功-finishexchange
      {
        path: 'finishexchange',
        name: '结算成功',
        meta: {
          title: "积分商城-结算成功"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/finishexchange.vue'),
      },
      // 订单物流-logistics
      {
        path: 'logistics',
        name: '订单物流',
        meta: {
          title: "积分商城-订单物流"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/store/child/logistics.vue'),
      },
    ]
  },
  // 阅读资料-/book/:id/read
  {
    path: '/book/:id/read',
    name: '阅读资料',
    component: () => import(/* webpackChunkName: "about" */ '@/views/study/read.vue'),
    meta: {
      title: "阅读资料"
    },
  },
  // 创作者中心-/creator
  {
    path: '/creator',
    name: '创作者中心',
    component: () => import(/* webpackChunkName: "about" */ '@/views/creator/home.vue'),
    redirect: '/creator/first',
    children: [
      // 创作首页-first
      {
        path: 'first',
        name: '创作首页',
        meta: {
          title: "创作者中心"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/creator/child/first.vue'),
      },
      // 文章管理-posts
      {
        path: 'posts',
        name: '文章管理',
        component: () => import(/* webpackChunkName: "about" */ '@/views/creator/child/articl.vue'),
      },
      // 常见问题--question
      {
        path: 'question',
        name: '常见问题',
        component: () => import(/* webpackChunkName: "about" */ '@/views/creator/child/question.vue'),
      },
    ]
  },
  // 写文章-/creator/drafts
  {
    path: '/creator/drafts',
    name: '写文章',
    component: () => import(/* webpackChunkName: "about" */ '@/views/creator/drafts.vue'),
    meta: {
      title: "写文章-培训"
    },
  },
  // 文档习题-/practise/examination
  {
    path: '/practise/examination',
    name: '文档习题',
    component: () => import(/* webpackChunkName: "about" */ '@/views/study/examination.vue'),
  },
]
