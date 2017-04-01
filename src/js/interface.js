/**
 * Created by huangyexin on 2016/10/27.
 */
define(function (require,exports,module) {

 var domain=window.location.host.indexOf("localhost")>-1?"10.0.20.101":window.location.host;
 //var domain=window.location.host.indexOf("localhost")>-1?"10.0.1.140:9095/web":window.location.host;
//var domain=window.location.host.indexOf("localhost")>-1?"10.0.1.33:8686/web":window.location.host;
//var domain=window.location.host.indexOf("localhost")>-1?"172.16.1.57":window.location.host;
// var host="http://"+domain;
// var host="http://10.0.20.13";
//正式版本服务器
var host="";
    var Model={
        //获取rem文字
        getSiteInfo:host+"/secure/get-site-string.html",
        //登录
        loginOn:host+"/wd_api/userCenter/loginOn",
        //获取客户生日信息列表
        getClientBirthdayList:host+"/wd_api/financialPlanner/getClientBirthdayList",
        //获取客户信息列表
        getClientList:host+"/wd_api/financialPlanner/getClientList",
        //邀请好友的回款列表(默认30天之内的)
        getRecommendMemberReceipt:host+"/wd_api/financialPlanner/getRecommendMemberReceipt",
        //邀请好友的投资列表(默认30天之内的)
        getRecommendMemberInvest:host+"/wd_api/financialPlanner/getRecommendMemberInvest",
        //理财师邀请的佣金总计
        getRecommendRewardAll:host+"/wd_api/financialPlanner/getRecommendRewardAll",
        //理财师邀请的佣金流水
        getRecommendRewardList:host+"/wd_api/financialPlanner/getRecommendRewardList",
        //客户动态
        recommendMoneyRecord:host+"/wd_api/recommendMoneyRecord/list",
        //客户列表
        recommendMember:host+"/wd_api/recommendMember/list",
        //添添金产品说明页面
        briskRecommand:host+"/wd_api/wealthApp/getBriskProductOn",
        //添添金项目展示列表
        briskProductList:host +"/wd_api/wealthApp/showBriskProductListOn",
        //根据文章类型以及文章标识获取文章
        briskArticle:host +"/wd_api/about/getNoticeDetailByTypeOn",
        //常见问题
        briskQuestions:host + "/wd_api/helpApp/getHelpListOn",
        //协议接口
        protocol: host +"/wd_api/wealthApp/getBriskMemberInfo",
        //获取理财师团队业绩首页展示数据
        getCafpTeamIndex: host +"/wd_api/financialPlanner/getCafpTeamIndex",
        //年化业绩排名列表
        getAnnualRankList: host +"/wd_api/financialPlanner/getAnnualRankList",
        //团队成员移除
        removeTeamMember:host+"/wd_api/financialPlanner/removeTeamMember",
        //添加团队会员时发送验证信息
        sendVerifyMessage:host+"/wd_api/financialPlanner/sendVerifyMessage",
        //确认添加新团队会员
        addCafpTeam:host+"/wd_api/financialPlanner/addCafpTeam",
        //获取理财师个人所属团队本月年化业绩倒序前5名列表
        listPersonTeamMoneyYear:host+"/wd_api/financialPlanner/listPersonTeamMoneyYear",
        //获取理财师个人业绩首页展示数据(客户年化业绩)
        getPersonSales:host+"/wd_api/financialPlanner/getCafpPersonYearMoney",
        //获取理财师个人业绩首页展示数据(客户质量分析)
        getPersonSalesQuality:host+"/wd_api/financialPlanner/getCafpPersonQuality",
        //邀请好友客户列表
        searchList:host+"/wd_api/recommendMember/list",
        //获取帮助信息
        getHelpList:host+"/wd_api/helpApp/getHelpTypeOn",
        //获取帮助详情 
        getNoticeDetailOn:host+'/wd_api/helpApp/getNoticeDetailOn'
    }
    exports.Model =  Model;
});
