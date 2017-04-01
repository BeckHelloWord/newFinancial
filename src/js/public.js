/**
 * Created by huangyexin on 2016/10/31.
 */
define(function (require,exports,module) {
    var Interface = require("./interface.js");
    var MD5 = require("./md5.js");
    var options={
        debug:false//生产
        //  debug:true
    }
	//全局站点信息
    var siteInfo={
        "siteName" : "宝象金融",
        "shortName" : "宝象",
        "domain" : "www.bxjr.com",
        "currentDeposit" : "添添金",
        "company":"上海宝象金融信息服务有限公司",
        "agreementAddress":"上海市浦东新区向城路288号国华人寿金融大厦5F",
        "agreementAddressShort":"上海市浦东新区"
    }
    exports.siteInfo = siteInfo;
    var pageInitFunc;
    var setPageInit=function(func){
        pageInitFunc=func
    }
    exports.setPageInit = setPageInit;
    var pageInit=function(){
        if(window.setTokenFlag){
            pageInitFunc()
        }else{
            window.setTimeout( function(){
                pageInit()
            },200)
        }
    }
    exports.pageInit = pageInit;
    var PushNextPage=function(route,path){
        var appFunc;
        var httpStr="http";
        if(window.location.host.indexOf("com")>-1){
           httpStr="https";
        }
        try{
            appFunc = JSON.parse(localStorage['appFunc']);
            if(appFunc&&appFunc.indexOf('APPWebView') != -1){
                window.location.href='baoxiang://APPWebView?openUrl='+encodeURIComponent(httpStr+"://"+window.location.host+'/m/financial/index.html#'+path)
            }else{
                route.push(path)
            }
        }catch(r){
            appFunc = sessionStorage['appFunc'] && JSON.parse(sessionStorage['appFunc']);
            if(appFunc&&appFunc.indexOf('APPWebView') != -1){
                window.location.href='baoxiang://APPWebView?openUrl='+encodeURIComponent(httpStr+"://"+window.location.host+'/m/financial/index.html#'+path)
            }else{
                route.push(path)
            }
        }
    }
    var AppJump=function(url){
        if(!window.location.host.indexOf("com")>-1){
            url.replace("https","http")
        }
        try{
           var appFunc = JSON.parse(localStorage['appFunc']);
            if(appFunc&&appFunc.indexOf('APPWebView') != -1){
                window.location.href='baoxiang://APPWebView?openUrl='+encodeURIComponent(url)
            }else{
                window.location.href = url
            }
        }catch(r){
            appFunc = sessionStorage['appFunc'] && JSON.parse(sessionStorage['appFunc']);
            if(appFunc&&appFunc.indexOf('APPWebView') != -1){
                window.location.href='baoxiang://APPWebView?openUrl='+encodeURIComponent(url)
            }else{
                window.location.href = url
            }
        }
    }

    exports.AppJump = AppJump;
    exports.PushNextPage = PushNextPage;
    var Auth = {
        get: function () {
            var result = {};
            try{
                result = JSON.parse(localStorage['persion']);
            }catch(r){
                result = sessionStorage['persion'] && JSON.parse(sessionStorage['persion']);
            }
            if("object" === typeof result){
                return result['accessToken'];
            }
            return 0;
        },
        set: function (_user) {
            if(_user.accessToken&&_user.accessToken=="app"){
                this.remove()
			}else{
                try{
                    window.setTokenFlag=true
                    localStorage['persion'] = JSON.stringify(_user);
                    //DOTO! 使用此方法需要解决切换用户后第一次访问的问题(立即token覆盖问题)
                }catch(r){
                    sessionStorage['persion'] = JSON.stringify(_user);
                }
            }
        },
        remove: function () {
            try{
                localStorage.removeItem('persion');
            }catch(r){
                sessionStorage.removeItem('persion');
            }
        }
    };
    exports.Auth = Auth;
    var API_GET = function(config){
        var data = config['data'] || {};
        config['success'] = config['success'] || function(){};
        config['fail'] = function(response){
            //console.log(response);
            if(/重新登录/.test(response.message)){
                Auth.remove();
            }
        };
        var _config = {
            'API_KEY' : Auth.get(), //不可为null
            'SECRET' : 'UYGGYG876T6759HUHI975T7GGKJO9786456EDC08'
        };

        var param = function(obj) {
            //console.log(_config);
            var newobj = { 'api_key' : _config['API_KEY'], 'ct' : 1, 'bt' : 2 },
                tmparr = ['api_key', 'ct', 'bt'],
                query = [], name, value, subName, querytext;

            for(name in obj) {
                tmparr.push(name);
                newobj[name] = obj[name]; //复制一个新的obj,为了不影响原有formData数据
            }
            tmparr.sort();

            for(var i = 0, len = tmparr.length; i < len; i++) {
                name = tmparr[i];
                value = newobj[name];
                if(value instanceof Array) {
                    value = value.join(',');
                }else if(value instanceof Object) { //解决 select BUG
                    for(subName in value) {
                        value = value[subName];
                        break;
                    }
                }
                if(value !== undefined && value !== null){
                    query.push(name + '=' + value);
                    //query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
                }
            }
            querytext = _config['SECRET'] + query.join('').split('=').join('');
            return query.join('&') + '&sign=' + MD5.MD5(querytext).toUpperCase();

        };

        $.ajax({
            type: 'POST',
            url: Interface.Model[config['url']],
            data: (String(data) == '[object Object]' ? param(data) : data),
            dataType: 'json',
            success: function(response){
                if(response.data == null){ response.data = []; }
                //publicArr[cache['url']][cache['data']] = JSON.stringify(response);
                config['success'](response);
                if(response.isSuccess == false){
                    if(response.message.indexOf('您不是专职理财师')>-1){
                        window.location.href="baoxiang://APPMyWealth";
                    }
                    config['fail'](response);
                    //	alert('访问接口时发生意外错误：\r\n接口地址: ' + config.url + '\r\n错误信息：' + response.message);
                }
            },
            error: config['error']
        });

    };
    exports.API_GET = API_GET;

    if(options.debug && !/.com/.test(location.host) && Auth.get() == 0){
        setTimeout(function(){
            var str1=prompt('请输入用户名','');
            var str2=prompt('请输入密码','');
            if(str1 && str2){
                API_GET({
                    url : 'loginOn',
                    data : { username : str1, password : str2 },
                    success : function(result){
                        if (result.isSuccess) {
                            Auth.set(result.data);
                        }else{
                            alert(result.message);
                        }
                    }
                });
            }
        },0);
    }
    var jumpApp = function(response) {
        try{localStorage.setItem('appFunc',JSON.stringify(response));}catch(r)
        {sessionStorage.setItem('appFunc',JSON.stringify(response));}
    }
    window.setToken = function(accessToken){

        Auth.set({"accessToken": accessToken});
    }

});