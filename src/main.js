import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import VueResource from 'vue-resource'
import Public from './js/public.js'
import layer from 'vue-layer-mobile'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
window.Public = Public;
//开启debug模式
Vue.config.debug = false;

Vue.use(Mint);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(layer);

import routerOption from './router.js'


// import teamList from './components/teamList.vue'
import { Loadmore } from 'mint-ui';


const router = new VueRouter(routerOption);
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。

//图表插件
Vue.component(Loadmore.name, Loadmore);
// Vue.component('myChart',myChart)
// Vue.component('pieChart',pieChart)
// Vue.component('teamList',teamList)

/*处理名字*/
Vue.filter('formatName', function (value) {
    if (value.length != 0 && value.indexOf('null') == -1) {
        var len = value.length <= 2 ? value.length : value.length - 1;
        var symbol = value.slice(1, len).length;
        var str = "";
        for (var i = 0; i < symbol; i++) {
            str += "*";
        }
        return value.replace(value.slice(1, len), str);
    } else {
        return "未实名";
    }
})
/*处理名字2*/
Vue.filter('formatName2', function (value) {
    if (value.length != 0 && value.indexOf('null') == -1) {
        var len = value.length;
        var symbol = value.slice(1, len).length;
        var str = "";
        for (var i = 0; i < symbol; i++) {
            str += "*";
        }
        return value.replace(value.slice(1, len), str);
    } else {
        return "未实名";
    }
})
//身份证 
Vue.filter('formatIdCart',function(value){
    var length = value.length;
    var temp = "";
    for(var i = 0 ;i<value.length-4;i++){
        temp +="*";
    }
    var last =  value.substr(length - 4, length);
    return temp + last;
})
//佣金流水判断类型
Vue.filter('judgeType', function (value) {
    if (value == 'settled') {
        return '已结算';
    } else {
        return '待结算';
    }
})
/*处理手机*/
Vue.filter('formatMobile', function (value) {
    if (value && value.length == 11) {
        return value.substr(0, 3) + " **** " + value.substr(7, 11);
    }
})
/*处理产品名称*/
Vue.filter('formatRemark', function (value) {
    return value.split('">')[1].split("</")[0]
})
/*处理金额,保留两位小数*/
Vue.filter('formatMoney', function (value) {
    value=value==null?0:value;
    return Number(Math.abs(value)).toFixed(2);
})

/*未实名*/
Vue.filter('realName', function (value) {
    if (value==null) {
        return "未实名";
    }else{
        return value;
    }
})

/*处理时间*/
Vue.filter('formatMonth', function (value) {
    var out = "";
    if(value.length==8){
        out = value.substr(4,2) + "/" + value.substr(6,2);
    }else if(value.length==6){
        out = value.substr(4,2) + "月";
    }else{
        
    }
    return out;
})

const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app')
