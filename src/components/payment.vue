<!--即将回款 start-->
<template>
    <section>
        <section class="my-wrap">
            <div class="my-pay-stream">
                <div class="my-pay-nav compd cc">
                    <span class="pay-nav-txt w_33 t_l fl ">客户信息</span>
                    <span class="pay-nav-txt w_33 t_c fl">回款金额(元)</span>
                    <span class="pay-nav-txt w_33 t_r fl">回款时间</span>
                </div>
                <div class="pay-list compd" v-show="paymentList.on.content">
                    <p class="cc" v-for="item in paymentList.data"><span class="w_33 t_l fl">{{item.realName | formatName}}</span><span class="w_33 t_c fl c_e71">{{item.shouldReceipt | formatMoney}}</span>
                        <span class="w_33 t_r fl">{{item.deadline}}</span>
                    </p>
                </div>
                <div class="pay-list compd" v-show="investList.on.content">
                    <p class="cc" v-for="item in investList.data"><span class="w_33 t_l fl">{{item.realName | formatName}}</span><span class="w_33 t_c fl c_e71">{{item.investAmount | formatMoney}}</span>
                        <span class="w_33 t_r fl">{{item.dateCreated}}</span>
                    </p>
                </div>
                <p class="load-gif" v-text="scroll.loadTxt">
                </p>
            </div>
        </section>
        <div class="underMenu t_c cc" v-bind:class="{'hack-ios':this.$parent.IOS}">
            <div class="fl w_50" v-on:click="tabClick('payment')" v-bind:class="{'on':paymentList.on.menu}">即将回款</div>
            <div class="fr w_50" v-on:click="tabClick('invest')" v-bind:class="{'on':investList.on.menu}">近期投资</div>
        </div>
    </section>
</template>
<!--即将回款 start-->

<script>
    export default {
        data: function () {
            return {
                'money': {
                    'payToday': '0',
                    'payAdd': '0'
                },
                'paymentList': {
                    'data': [], 'offset': 0, 'on': { 'menu': true, 'content': true },
                    'first': true
                },
                'investList': {
                    'data': [], 'offset': 0, 'on': { 'menu': false, 'content': false },
                    'first': true
                },
                'scroll': {
                    'top': '',
                    'wh': '',
                    'dh': '',
                    'beforeTop': 0,
                    'flg': true,
                    'max': 10,
                    'loadTxt': ''
                }
            }
        },
        methods: {
            getData: function (url, obj) {
                var that = this;
                that.scroll.flg = false;
                that.scroll.loadTxt = '加载中...';
                Public.API_GET({
                    url: url,
                    data: { "offset": obj.offset, "max": that.max },
                    success: function (result) {
                        if (result.isSuccess) {
                            obj.data = obj.data.concat(result.data);
                            obj.offset += that.scroll.max;
                            that.scroll.flg = true;
                            if (result.data.length == 0) {
                                obj.first ? that.scroll.loadTxt = '暂无数据' : that.scroll.loadTxt = '没有更多了';
                            } else if (result.data.length < that.scroll.max) {
                                that.scroll.loadTxt = '没有更多了';
                            }
                            obj.first = false;
                        }
                    }
                });

            },
            switchOn: function (paymentOn, investOn) {
                /*选中切换*/
                this.paymentList.on.menu = paymentOn;
                this.paymentList.on.content = paymentOn;
                this.investList.on.menu = investOn;
                this.investList.on.content = investOn;
            },
            tabClick: function (type) {
                /*获取数据*/
                switch (type) {
                    case 'payment':
                        this.$parent.setTitle("即将回款");
                        this.switchOn(true, false);
                        this.getData('getRecommendMemberReceipt', this.paymentList);
                        break;
                    case 'invest':
                        this.$parent.setTitle("近期投资");
                        this.switchOn(false, true);
                        this.getData('getRecommendMemberInvest', this.investList);
                        break;
                }
            },
            initData: function () {
                var that = this;
                that.getData('getRecommendMemberReceipt', that.paymentList);
            }

        },

        created: function () {
            this.$parent.setTitle("即将回款");
            this.$parent.isIOS();
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
                        if (that.paymentList.on.menu) {
                            that.getData('getRecommendMemberReceipt', that.paymentList);
                        } else {
                            that.getData('getRecommendMemberInvest', that.investList);
                        }

                    }
                }
            });
        }
    }
</script>