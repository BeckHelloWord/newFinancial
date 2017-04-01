// 定义组件, 也可以像教程之前教的方法从别的文件引入
// import customer from './components/customer.vue'
// import client from './components/client.vue'
// import sales from './components/sales.vue'
// import my from './components/my.vue'
// import payment from './components/payment.vue'
// import contacts from './components/contacts.vue'
// import birthday from './components/birthday.vue'
// import brisk from './components/brisk.vue'
// import doc from './components/brisk_doc.vue'
// import sec from './components/brisk_sec.vue'
// import list from './components/brisk_list.vue'
// import memberGrade from './components/memberGrade.vue'
// import team from './components/team.vue'
// import track from './components/track.vue'
// import protocol from './components/brisk_protocol.vue'
// import search from './components/search.vue'
// import introduce from './components/introduce.vue'
// 创建一个路由器实例
// 并且配置路由规则
const routerOption = {

    base: __dirname,
    routes: [
        {
            //客户搜索
            path: "/search/:type",
            component: (resolve) => {
                require(['./components/search.vue'], resolve)
            }
        },
        {
            //客户动态
            path: '/customer',
            component: (resolve) => {
                require(['./components/customer.vue'], resolve)
            }
        },
        {
            //个人理财师业绩
            path: '/sales/:id',
            component: (resolve) => {
                require(['./components/track.vue'], resolve)
            }
        },
        {
            //个人理财师业绩
            path: '/sales',
            component: (resolve) => {
                require(['./components/track.vue'], resolve)
            }
        },
        {
            //客户列表
            path: '/client',
            component: (resolve) => {
                require(['./components/client.vue'], resolve)
            }
        },
        // {
        //     path: '/sales',
        //     component: sales
        // },
        {
            //我的佣金
            path: '/my',
            component: (resolve) => {
                require(['./components/my.vue'], resolve)
            }
        },
        {
            //即将回款
            path: '/payment',
            component: (resolve) => {
                require(['./components/payment.vue'], resolve)
            }
        },
        {
            //选择联系人
            path: '/contacts',
            component: (resolve) => {
                require(['./components/contacts.vue'], resolve)
            }
        },
        {
            //客户生日
            path: '/birthday',
            component: (resolve) => {
                require(['./components/birthday.vue'], resolve)
            }
        },
        {
            //团队业绩（普通团员）
            path: '/memberGrade',
            component: (resolve) => {
                require(['./components/memberGrade.vue'], resolve)
            }
        }, {
            //团队业绩（团队长）
            path: '/team/:id',
            component: (resolve) => {
                require(['./components/team.vue'], resolve)
            },
            children: [
                // 当 /user/:id 匹配成功，
                // UserHome 会被渲染在 User 的 <router-view> 中
                {
                    path: '/team', component: (resolve) => {
                        require(['./components/team.vue'], resolve)
                    }
                }
            ]
        },
        {
            //添添金服务协议
            path: "/protocol",
            component: (resolve) => {
                require(['./components/brisk_protocol.vue'], resolve)
            }
        },
        {
            //添添金介绍
            path: "/introduce",
            component: (resolve) => {
                require(['./components/introduce.vue'], resolve)
            }
        },
        {
            //帮助中心 
            path: "/briskHelp",
            component: (resolve) => {
                require(['./components/briskHelp.vue'], resolve)
            }
        },
        {
            //帮助主体
            path: "/briskNew/:id",
            name: "briskNew",
            component: (resolve) => {
                require(['./components/briskNews.vue'], resolve)
            }
        }
    ]
}
export default routerOption;
