<!--团员成绩 start-->
<template>
    <mt-loadmore :top-method="refresh" ref="my_memberGrade">
    <section class="memberGrade-wrap">
        
            <template v-for="item in list">
                <div class="cc pt_1 pb_1 f_0 prl_10 dp_b b_fff" v-if="item.isCurrent">
                    <div class="dp_ib w_20 c_999 f_12 t_c">
                        <span class="dp_ib noun" v-if="item.i < 4" v-bind:class="'noun'+(item.i-1)"></span>
                        <span v-else>{{item.i}}</span>
                    </div>
                    <div class="personal w_53">
                        <i v-if="item.avatar" class="team-img dp_ib" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                        <i v-else class="team-img defaultHead dp_ib "></i>
                        <div class="personal-name ml_8 w_64">
                            <p class="c_666 realname ellipsis w_100">{{item.realName | realName}}</p>
                            <p class="f_10 c_999 lh15">{{item.mobile}}</p>
                        </div>
                    </div>
                    <div class="dp_ib w_27 t_r f_10 c_999"><span>{{item.personInvestYear | formatMoney}}</span>元
                    </div>
                </div>
            </template>
            <div class="team-field prl_10 cc">
                <span class="w_20 t_c fl ">名次</span>
                <span class="w_53 pl_56 fl">成员</span>
                <span class="w_27 t_r fl">本月年化业绩</span>
            </div>
            <template v-for="item in list">
                <div class="cc pt_1 pb_1 f_0 prl_10 dp_b b_fff" v-bind:class="{'bg_ec':item.memberId==id}" v-if="!item.isCurrent">
                    <div class="dp_ib w_20 c_999 f_12 t_c">
                        <span class="dp_ib noun" v-if="item.i < 4" v-bind:class="'noun'+(item.i-1)"></span>
                        <span v-else>{{item.i}}</span>
                    </div>
                    <div class="personal w_53">
                        <i v-if="item.avatar" class="team-img dp_ib" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                        <i v-else class="team-img defaultHead dp_ib "></i>
                        <div class="personal-name ml_8 w_64">
                            <p class="c_666 realname ellipsis w_100">{{item.realName | realName}}</p>
                            <p class="f_10 c_999 lh15">{{item.mobile}}</p>
                        </div>
                    </div>
                    <div class="dp_ib w_27 t_r f_10 c_999"><span>{{item.personInvestYear | formatMoney}}</span>元
                    </div>
                </div>
            </template>
            
    </section>
</mt-loadmore>
</template>
<!--团员成绩 end-->

<script>
    export default {

        data: function () {
            return {
                list: [],
                id:''
            }
        },
        methods: {
            refresh() {
                setTimeout(() => {
                    this.initData();
                }, 2000)
            },
            initData: function () {
                $(document.body).css("backgroundColor","#efefef");
                var _this = this;
                Public.API_GET({
                    //信息API
                    url: 'listPersonTeamMoneyYear',
                    success: function (result) {
                        if (result.isSuccess) {
                            _this.list = result.data.personTeamMoney;
                            _this.id=result.data.memberId;
                            _this.$refs.my_memberGrade.onTopLoaded();
                        }
                    }
                });
            }
        },
        created: function () {
            var _this = this;
            _this.$parent.setTitle("团队业绩");
            _this.initData();

        }
    }
</script>