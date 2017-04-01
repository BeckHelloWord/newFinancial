<!--近期过生日的客户 start-->
<template>
    <section>
        <section class="contacts-wrap pt_40">
            <div class="contacts-sel compd">
                <label v-on:click="allCheck"><input type="checkbox" class="box-check all-check"/>全选</label>
            </div>
            <div class="contacts-stream ">
                <div class="contacts-list pay-list  compd">
                    <p class="cc" v-for="item in list" v-on:click.stop="getCheck"><label class="w_66"><span
                            class="w_33 t_l dp_ib"><input type="checkbox" :value="item.mobile"
                                                          class="box-check alone-check" />{{item.realName | formatName}}</span><span
                            class="w_33 t_l dp_ib">{{item.birth}}</span></label><span class="w_33"><a
                            :href="'sms:'+item.mobile" class="dp_ib mr_20 iconfont icon-email icon-sms"></a><a
                            :href="'tel:'+item.mobile" class="dp_ib iconfont icon-phone icon-tel fr mr_10"></a></span></p>
                </div>
                <p class="load-gif" v-text="scroll.loadTxt">
                </p>
            </div>
            <div class="sms-wrap compd" v-show="SmsSel" v-bind:class="{'hack-ios':this.$parent.IOS}">
                <span class="dp_ib w_50">已选{{num}}位联系人</span>
                <a :href="'MobileSms:'+phone" class="dp_ib sms-send" v-on:click="formatPhone" v-if="this.$parent.IOS">发送短信</a>
                <a :href="'sms:'+phone" class="dp_ib sms-send" v-on:click="formatPhone" v-else>发送短信</a>
            </div>
        </section>

    </section>
</template>
<!--近期过生日的客户 end-->

<script>
    export default{
        data: function () {
            return {
                'list': [],
                'scroll': {
                    'loadTxt': ''
                },
                'num': 0,
                'phone': "",
                'SmsSel': false
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
                        that.phone += $(this).val() + ";";
                    }else{
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
                    that.phone="";
                    $('.alone-check').each(function () {
                        $(this).prop('checked', true);
                        that.phone += $(this).val() + ";";
                    })
                    that.num = $('.alone-check').length;
                    that.num > 0 ? that.SmsSel = true : that.SmsSel = false;
                } else {
                    //未全选
                    that.phone="";
                    $('.alone-check').each(function () {
                        $(this).get(0).checked = false;
                    })
                    that.num = 0;
                    that.SmsSel = false;
                }

            },
            getData: function () {
                var that = this;
                Public.API_GET({
                    url: 'getClientBirthdayList',
                    success: function (result) {
                        if (result.isSuccess) {
                            if (result.data.length == 0) {
                                that.scroll.loadTxt = '暂无数据'
                            } else {
                                that.list = that.list.concat(result.data);
                            }
                        }
                    }
                });
            },
            formatPhone: function () {
                //处理手机号码
                this.phone = this.phone.substring(0, this.phone.length - 1);
            }
        },
        created: function () {
            this.$parent.setTitle("近期过生日客户")
            var that = this;
            Public.setPageInit(that.getData)
            Public.pageInit()
            this.$parent.isIOS();
        }
    }
</script>
