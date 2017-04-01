<!--选择联系人 start-->
<template>
    <section>
        <section class="contacts-wrap">
            <div class="contacts-stream ">
                <div class="contacts-list">
                    <!--<p class="cc" v-for="item in list" v-on:click.stop="getCheck"><label><span-->
                    <!--class="w_50 t_l fl">{{item.realName | formatName}}</span><span-->
                    <!--class="w_50 t_l fl">总佣金:<span class="c_e71">{{item.reward | formatMoney}}</span>元</label></p>-->
                    <template v-for="item in list">
                        <div class="cc pt_1 pb_1 f_0">
                            <label v-on:click.stop="getCheck" class="compd dp_b">
                                <input type="checkbox" :value="item.mobile"
                                       class="box-check alone-check"  style="display: none" />
                                <div class="dp_ib w_55 f_12">
                                    <i v-if="item.avatar" class="headimg dp_ib"
                                       v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                                    <i v-else class="headimg defaultHead dp_ib "></i>
                                    <div class="dp_ib ml_5" >
                                        <p v-if="item.realName">{{item.realName | formatName}}</p>
                                        <p class="f_10 c_999 lh15">{{item.mobile|formatMobile}}</p>
                                    </div>
                                </div>
                                <div class="dp_ib w_45 t_r f_10">总佣金:<span
                                        class="c_e71">{{item.reward | formatMoney}}</span>元
                                </div>
                            </label>
                        </div>
                    </template>
                </div>
                <p class="load-gif" v-text="scroll.loadTxt">
                </p>
            </div>
            <div class="sms-wrap compd" v-show="true" v-bind:class="{'hack-ios':this.$parent.IOS}">
                <span class="dp_ib"> <label v-on:click="allCheck"><input type="checkbox" class="box-check all-check"/>全选</label></span>
                <div class="dp_ib w_80">
                    <a href="javascript:;" class="dp_ib sms-send ml_10 fl" v-on:click="cancel">取消</a>
                    <a :href="'baoxiang://APPMobilesms?mobile='+phone" class="dp_ib sms-send fr" v-on:click="formatPhone"
                       v-if="this.$parent.IOS">发送&nbsp;<template v-if="num!=0">({{num}})</template></a>
                    <a :href="'sms:'+phone" class="dp_ib sms-send ml_2 fr" v-on:click="formatPhone" v-else>发送&nbsp;<template v-if="num!=0">({{num}})</template></a>
                </div>
            </div>
        </section>
    </section>
</template>
<!--选择联系人 end-->

<script>
    export default{
        data: function () {
            return {
                'list': [],
                'scroll': {
                    'top': '',
                    'wh': '',
                    'dh': '',
                    'beforeTop': 0,
                    'flg': true,
                    'offset': 0,
                    'max': 10,
                    'loadTxt': ''
                },
                'num': 0,
                'SmsSel': false,
                'phone': [],
                'first': true,
                'checkFlg': false
            }
        },
        methods: {
            getCheck: function () {
                var that = this;
                that.phone = [];
                var i = 0;
                $('.alone-check').each(function () {
                    if ($(this).is(':checked')) {
                        ++i;
                        $(this).parent().parent().css('background','#ececec');
                        that.phone += $(this).val() + ";";
                    } else {
                        that.checkFlg = false;
                        $(this).parent().parent().css('background','transparent');
                        $(".all-check").get(0).checked = false;
                    }
                });
                that.num = i;
                that.num > 0 ? that.SmsSel = true : that.SmsSel = false;
            },
            allCheck: function () {
                var that = this;
                if ($(".all-check").is(':checked')) {
                    //全选
                    that.phone = "";
                    that.checkFlg = true;
                    $('.alone-check').each(function () {
                        $(this).prop('checked', true);
                        $(this).parent().parent().css('background','#ececec');
                        that.phone += $(this).val() + ";";
                    })
                    that.num = $('.alone-check').length;
                    that.num > 0 ? that.SmsSel = true : that.SmsSel = false;
                } else {
                    //未全选
                    that.phone = "";

                    $('.alone-check').each(function () {
                        $(this).get(0).checked = false;
                        $(this).parent().parent().css('background','transparent');
                    })
                    that.num = 0;
                    that.SmsSel = false;
                }

            },
            getData: function () {
                var that = this;
                that.scroll.flg = false;
                that.scroll.loadTxt = '加载中...';
                Public.API_GET({
                    url: 'getClientList',
                    data: {"offset": that.scroll.offset, "max": that.scroll.max},
                    success: function (result) {
                        if (result.isSuccess) {
                            that.list = that.list.concat(result.data);
                            that.scroll.offset += that.scroll.max;
                            that.scroll.flg = true;
                            if (result.data.length == 0) {
                                that.first ? that.scroll.loadTxt = '暂无数据' : that.scroll.loadTxt = '没有更多了';
                            } else if (result.data.length < that.scroll.max) {
                                that.scroll.loadTxt = '没有更多了';
                            }
                            that.first = false;

                            setTimeout(function () {
                                if (that.checkFlg) {
                                    that.allCheck();
                                }
                            }, 0)
                        }
                    }
                });
            },
            formatPhone: function () {
                //处理手机号码
                if(this.phone.length>0){
                    this.phone = this.phone.substring(0, this.phone.length - 1);
                }

            },
            cancel:function (e) {
                e.preventDefault();
                $('.alone-check').each(function () {
                    $(this).get(0).checked = false;
                    $(this).parent().parent().css('background','transparent');
                })
                $(".all-check").get(0).checked = false;
                this.phone = "";
                this.num = 0;
            }
        },
        created: function () {
            this.$parent.setTitle("选择联系人");
            this.$parent.isIOS();
            var that = this;
            Public.setPageInit(that.getData)
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
