<template>
    <!--我的 start-->
    <section class="my-wrap">
        <nav class="my-pay cc compd">
            <div class="pay-today fl">
                <p class="pay-money">{{money.reward | formatMoney}}</p>
                <p class="pay-txt">今日发放佣金(元)</p>
            </div>
            <div class="pay-add  fr">
                <p class="pay-money">{{money.sumReward | formatMoney}}</p>
                <p class="pay-txt">累计发放佣金(元)</p>
            </div>
        </nav>
        <div class="my-pay-stream">
            <div class="my-pay-nav compd cc">
                <span class="pay-nav-txt w_33 t_l fl ">日期</span>
                <span class="pay-nav-txt w_33 t_c fl">金额(元)</span>
                <span class="pay-nav-txt w_33 t_r fl">状态</span>
            </div>
            <div class="pay-list compd">
                <p class="cc" v-for="item in list"><span class="w_33 t_l fl">{{item.fundDate}}</span><span
                        class="w_33 t_c fl c_e71">{{item.fund | formatMoney}}</span><span class="w_33 t_r fl">{{item.fundStatus | judgeType}}</span>
                </p>
            </div>
            <p class="load-gif" v-text="scroll.loadTxt">
            </p>
            <!--<div v-on:click="test" id="test">test</div>-->
        </div>
    </section>
    <!--我的 start-->
</template>

<script>
    window.setToken = function(accessToken){
        Public.Auth.set({"accessToken": accessToken});

        /*
         if(publicArr.path === '/view/:id'){
         publicArr.me.getCustomer(publicArr.me.$route.params.id);
         }else{
         loadMore(publicArr.me);
         }
         */
    }
    export default{
        data: function () {
            return {
                'money': {
                    'sumReward': '',
                    'reward': ''
                },
                'list': [],
                'scroll': {
                    'top': '',
                    'wh': '',
                    'dh': '',
                    'beforeTop': 0,
                    'flg': true,
                    'max': 10,
                    'offset': 0,
                    'loadTxt': ''
                }, 'first': true,
                initTime:0,
                assFlag:false
            }
        },
        methods: {
            getData: function () {
                //佣金流水
                var that = this;
                that.scroll.flg = false;
                that.scroll.loadTxt = '加载中...';
                Public.API_GET({
                    url: 'getRecommendRewardList',
                    data: {"offset": that.scroll.offset, "max": that.scroll.max},
                    success: function (result) {
                        if (result.isSuccess ) {
                            that.list = that.list.concat(result.data);
                            that.scroll.offset += that.scroll.max;
                            that.scroll.flg = true;
                            if(result.data.length == 0){
                                that.first ? that.scroll.loadTxt = '暂无数据' : that.scroll.loadTxt = '没有更多了';
                            }else if(result.data.length < that.scroll.max){
                                that.scroll.loadTxt = '没有更多了';
                            }
                            that.first=false;
                        }
                    }
                });
            },
            initData: function () {
                //佣金流水
                var that = this;
                that.scroll.flg = false;
                if(Public.Auth.get()==0){
                    that.assFlag=true
                }else{
                    that.assFlag=false
                }
                Public.API_GET({
                    url: 'getRecommendRewardList',
                    data: {"offset": that.scroll.offset, "max": that.scroll.max},
                    success: function (result) {
                        if(result.isSuccess){

                        }else if(that.assFlag){
                            if(that.initTime < 10){
                                window.setTimeout( function(){
                                    that.initData()
                                },500)
                                that.initTime++;
                            }
                        }
                        if (result.isSuccess && result.data.length > 0) {
                            that.list = that.list.concat(result.data);
                            that.scroll.offset += that.scroll.max;
                            that.scroll.flg = true;
                            that.getFund();
                            if (result.data.length < that.scroll.max) {
                                that.scroll.loadTxt = '没有更多了';
                            }
                        } else {
                            that.scroll.loadTxt = '暂无数据';
                        }
                    }
                });
            },
            getFund: function () {
                //佣金总计
                var that = this;
                Public.API_GET({
                    url: 'getRecommendRewardAll',
                    success: function (result) {
                        if (result.isSuccess) {
                            that.money = result.data;
                        }
                    }
                });
            }
        },

        mounted: function () {
            this.$parent.setTitle("我的佣金")
            var that = this;
            Public.setPageInit(that.initData)
            Public.pageInit()
            /*滚动加载*/
            that.scroll.wh = $(window).height();
            $(window).on("scroll", function () {
                that.scroll.top = $(this).scrollTop();
                that.scroll.dh = $(document).height();
                if (that.scroll.top + that.scroll.wh >= that.scroll.dh) {
                    if (that.scroll.flg) {
                        that.getData();
                    }
                }
            });
        }
    }
</script>
