<!--搜索页面-->
<template>
    <section>
        <div class="search-wrap cc pd_tb_2">
            <!--<input type="text" placeholder="搜索" class="search-input client-search t_l w_82 pl_10 fl" v-on:keyup="enterTxt" v-model="searchVal" maxlength="24"  autofocus/>-->
            <div class="pr">
            <input type="text" placeholder="搜索" class="search-input client-search t_l w_82 pl_10 fl" v-model="searchVal" maxlength="24"
                autofocus/>
            <i class="icon-search-fine icon-search iconfontSearch"></i>
            </div>
            <div class="search-btn fr" v-on:click="cancelSearch">取消</div>
        </div>
        <template v-if="jionlist.length !=0">
            <div class="invest-list search-title compd clearfix"><span class="dp_ib w_50">我的客户</span><span class="dp_ib w_25 list-center t_r">账户余额</span><span class="dp_ib w_25 list-center t_r">在投金额</span></div>
        </template>
        <template v-if="jionlist.length > 0">
            <div class="record-list compd">
                <table>
                    <tbody>
                        <tr v-for="item in jionlist" v-on:click="toCustomerDetail" :data-member="item.memberId">
                            <td width="20%">
                                <i v-if="item.avatar" class="headimg" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                                <i v-else class="defaultHead"></i>
                            </td>
                            <td width="30%" class="list-center">
                                <span class="g333">{{item.realName | formatName}}</span>
                                <p class="g999">{{item.mobile}}</p>
                            </td>
                            <td class="list-center t_r" width="25%">
                                <!--<span class="g333 client-extend" v-if="currentTab=='norealname'">{{item.extend}}</span>-->
                                <span class="c_e71">{{item.accountBalance | formatMoney}}</span>
                            </td>
                            <td class="list-center t_r" width="25%">
                                <!--<span class="g333 client-extend" v-if="currentTab=='norealname'">{{item.extend}}</span>-->
                                <span class="c_e71">{{item.extend | formatMoney}}</span>
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </template>
        <div class="prompt-txt" v-if="prompt">
            {{prompt}}
        </div>
    </section>
</template>

<script>
    export default {
        data: function () {
            return {
                jionlist: [
                    // {extend: 0, realName: "11", regTime: "2017-01-10", avatar: "", memberId: 997825,mobile:"15168250191",extend:0,accountBalance:1999.32}
                    ],
                max: 10,
                offset: 0,
                ajaxLock: true,
                currentTab: "all",
                loading: true,
                tableLock: false,
                // rightTitle: "总佣金",
                initTime: 0,
                assFlag: false,
                searchVal: '',
                prompt: '请输入客户姓名或手机号码',
                once: true
            }
        },
        methods: {
            toCustomerDetail: function (e) {
                Public.AppJump("https://" + window.location.host + "/m/index.html#!/financialPlanner/view/" + e.currentTarget.dataset.member);
            },
            cancelSearch: function () {
                // 取消
                // Public.PushNextPage(this.$router, "/client/");
                // this.$router.push("/client/");
                history.back()
            },
            enterTxt: function () {
                var _this = this;
                _this.searchVal = _this.searchVal.replace(/\s/g, '');
                var val = _this.searchVal ? _this.searchVal : " ";
                _this.prompt = "加载中";
                Public.API_GET({
                    url: 'searchList',
                    data: { 'searchParam': val, 'type':null, 'max': _this.max, 'offset': 0 },
                    success: function (result) {
                        if (result.data.list) {
                            _this.jionlist = result.data.list;
                            if (_this.jionlist.length > 0) {
                                _this.prompt = "";
                            } else if (_this.jionlist.length == 0) {
                                _this.prompt = "暂无数据";
                            } else if (!_this.prompt) {
                                _this.prompt = "请输入客户姓名或手机号码";
                            }

                        }
                    }
                });
            },
            setType: function (type) {
                // switch (type) {
                //     case 'all':
                //     case 'invote':
                //         this.rightTitle = '总佣金';
                //         break;
                //     case 'novote':
                //         this.rightTitle = '账户余额';
                //         break;
                //     case 'norealname':
                //         this.rightTitle = '手机号';
                //         break;
                //     default:
                //         this.rightTitle = '总佣金';
                //         break;
                // }
            }
        },

        created: function () {
            var _this = this;
            _this.$parent.setTitle("客户搜索");
            _this.currentTab = _this.$route.params.type;
            _this.setType(_this.currentTab);
        },
        mounted: function () {
            //按回车提交搜索
            var _this=this;
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    _this.enterTxt();
                }
            });
        }
    }
</script>