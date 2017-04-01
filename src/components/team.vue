<!--团队成绩 start-->
<template>
    <section class="team-wrap">
        <!--为前端噩梦献身-->
        <!--<mt-loadmore :top-method="refresh" ref="my_team">-->
            <section v-bind:class="{'filter':isFilter}">
                <div class="nav-date mt_10 mb_10">
                    <ul class="cc">
                        <li class="on" v-on:click="changeTab" data-tab="today">今日</li>
                        <li v-on:click="changeTab" data-tab="yesterday">昨日</li>
                        <li v-on:click="changeTab" data-tab="thisWeek">本周</li>
                        <li v-on:click="changeTab" data-tab="thisMonth">本月</li>
                        <li v-on:click="changeTab" data-tab="lastMonth">上月</li>
                    </ul>
                </div>
                <div class="client-wrap cc b_fff mb_10 c_666">
                    <div>
                        <p class="f_12">{{teamList.newCustomersNum}}</p>
                        <p class="mt_5 c_999">新增客户</p>
                    </div>
                    <div>
                        <p class="f_12">{{teamList.investCustomersNum}}</p>
                        <p class="mt_5 c_999">投资客户</p>
                    </div>

                </div>
                <template>
                    <div class="b_fff">
                        <div class="track-chart track">
                            <my-chart :chartData="chartData" :type="currentTab"></my-chart>
                        </div>
                        <div class="cc t_c c_666">
                            <div class="fl w_50 p_tb_5 f_10">
                                <p class="f_12">{{teamList.sumInvestMoney | formatMoney}}</p>
                                <p class="mt_5 c_999">客户投资额</p>
                            </div>
                            <div class="fr w_50 p_tb_5 f_10">
                                <p class="f_12">{{teamList.sumInvestMoneyYear | formatMoney}}</p>
                                <p class="mt_5 c_999">总年化业绩</p>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="team-field prl_10 cc ">
                    <span class="w_20 t_c fl ">名次</span>
                    <span class="w_55 pl_56 fl">成员({{list.allTeamNum}}人)<i class="iconfontTeam icon-tianjiayonghu iconTeam" @click="showAdd"></i></span>
                    <span class="w_25 t_r fl">年化业绩</span>
                </div>
                <div class="team-list w_100 b_fff">
                    <template v-for="(item,index) in list.annualRanks">
                        <team-list :item="item" :index="index" :last="lastID"></team-list>
                    </template>
                </div>
                <div v-if="list.annualRanks.length != 0&&loading" class="load-gif">
                    加载中...
                </div>
                <div v-if="list.annualRanks.length != 0&&!loading" class="load-gif">
                    没有更多了
                </div>
                <div v-if="list.annualRanks.length == 0&&loading" class="customer-loading">
                    加载中...
                </div>
                <div v-if="list.annualRanks.length == 0&&!loading" class="customer-loading p_tb_5">
                    暂无数据
                </div>
            </section>
            <div class="gray-layer" v-show="isShow">
                <div class="add-member br_5">
                    <p class="pr t_c f_12 lh15 p_tb_5">{{teamList.investRealName | realName}}团队添加新成员<i class="icon-del iconfontDel layer-closed" @click="closeLayer"></i></p>
                    <div class="p_5">
                        <label class="dp_b lh_22 mb_20"><span class="w_28 dp_ib">手机号码：</span><input type="number" @keyup='verifyPhone' class="w_72 lh30 p_l_5" v-model="addMemberInfo.phoneVal" /></label>
                        <label class="dp_b lh_22 mb_30"><span class="w_28 dp_ib">验证码：</span><input type="number" @keyup='verifyCode' class="w_28 lh30 p_l_5" v-model="addMemberInfo.codeVal"/><button class="fr w_42 lh30 add-btn btn-initial br_5 isKen" @click="getCode" :disabled="addMemberInfo.isCodeDis">{{addMemberInfo.codeInfo}}</button></label>
                        <button class=" dp_b w_100 lh_40 f_16 t_c add-btn br_5 btn-initial" @click="addMember" :disabled="addMemberInfo.isPhoneDis">确认添加</button>
                    </div>
                </div>
            </div>
          <!--为前端噩梦献身-->
        <!--</mt-loadmore>-->
    </section>
</template>
<!--团队成绩 end-->
<script>
    import hammer from '../js/hammer'
    import MyChart from './myChart3.vue'
    import TeamList from './teamList.vue'
    import { Toast } from 'mint-ui';
    export default {
        components:{
			myChart:MyChart,
            teamList:TeamList
        },
        data: function () {
            return {
                list: {
                    'allTeamNum': '0',
                    'annualRanks': [
                       //{avatar:null,investMoneyYear:108717.68,isBeDelete:true, extend: 0, realName: "赵*三", regTime: "2017-01-10", memberId: 997803,teamNum:0}
                    ]
                },
                teamList: {
                    'investMemberId': '',
                    'investRealName': '',
                    'sumInvestMoneyYear': '0',
                    'sumInvestMoney': '0',
                    'investCustomersNum': '0',
                    'newCustomersNum': '0',
                    'recentSevenGraph': []
                },
                chartData: [
                ],
                addMemberInfo: {
                    "phoneVal": '',
                    "codeVal": '',
                    "isPhoneDis": true,
                    "isCodeDis": true,
                    'codeInfo': '发送'
                },
                max: 10,
                offset: 0,
                ajaxLock: true,
                currentTab: "today",
                loading: true,
                tableLock: false,
                initTime: 0,
                isShow: false,
                assFlag: false,
                userID: '',
                countDown: 90,
                timer: '',
                isFilter: false,
                hasMore: true,
                lastID: ''
            }
        },
        methods: {
            changeTab: function (e) {
                var _this = this;
                if (_this.tableLock) {
                    return
                } else {
                $(".on").removeClass("on");
                $(e.currentTarget).addClass("on");
                _this.currentTab = e.currentTarget.dataset.tab;
                _this.list.annualRanks = [];
                _this.teamList = [];
                _this.chartData = [];
                _this.ajaxLock = true;
                _this.loading = true;
                _this.offset = 0;
                    _this.getDate(this.currentTab);
                    _this.tableLock = true;
                }
            },
            refresh() {
                setTimeout(() => {
                    this.offset = 0;
                    this.getDate();
                }, 2000)
            },
            getDate: function () {
                var _this = this;
                var parameter = { 'timeFlag': _this.currentTab };
                if (_this.userID) {
                    parameter = { 'investMemberId': _this.userID, 'timeFlag': _this.currentTab };
                }
                Public.API_GET({
                    //信息API
                    url: 'getCafpTeamIndex',
                    data: parameter,
                    success: function (result) {
                        if (result.isSuccess) {
                            _this.userID = result.data.investMemberId;
                            _this.lastID = _this.$route.query.last ? _this.$route.query.last : _this.userID;
                            _this.teamList = result.data;
                            _this.chartData = result.data.recentSevenGraph;
                            //设置title
                            _this.$parent.setTitle(_this.teamList.investRealName + '团队业绩');
                            Public.API_GET({
                                //列表API
                                url: 'getAnnualRankList',
                                data: { investMemberId: _this.userID, timeFlag: _this.currentTab, offset: _this.offset, max: _this.max },
                                success: function (result) {
                                       _this.tableLock=false
                                    if (result.isSuccess) {
                                        _this.list = result.data;
                                        if (result.data.annualRanks && (result.data.annualRanks.length < _this.max)) {
                                            _this.ajaxLock = false
                                            _this.loading = false;
                                        } else {
                                            _this.ajaxLock = true
                                            _this.loading = true;
                                        }
                                        _this.offset = _this.max;
                                    }

                                }
                            });

                        }
                        // 为前端噩梦献身
                        // _this.$refs.my_team.onTopLoaded();
                    }
                });

            },
            getMore: function (currentTab) {

                var _this = this;

                if (!_this.userID) {
                    return false;
                }
                var sendData = {
                    investMemberId: _this.userID, timeFlag: _this.currentTab, offset: _this.offset, max: _this.max
                }
                if (_this.offset >= _this.max) {
                    //阻止重复提交
                    Public.API_GET({
                        url: 'getAnnualRankList',
                        data: sendData,
                        success: function (result) {
                            _this.tableLock = false;
                            if (result.data.annualRanks && (result.data.annualRanks && result.data.annualRanks.length > 0)) {
                                _this.list.allTeamNum = result.data.allTeamNum;
                                _this.list.annualRanks = _this.list.annualRanks.concat(result.data.annualRanks);
                            }
                            if (result.data.annualRanks && (result.data.annualRanks.length < _this.max)) {
                                _this.ajaxLock = false
                                _this.loading = false;
                            } else {
                                _this.loading = true;
                                _this.ajaxLock = true
                            }
                            _this.offset += _this.max;
                        }
                    });
                }

            },
            getCode: function () {
                /*ajax获取数据*/
                var _this = this;
                if (!_this.addMemberInfo.isDisabled) {
                    _this.addMemberInfo.isCodeDis = true;
                    var userid = _this.lastID ? _this.lastID : _this.userID;
                    Public.API_GET({
                        url: 'sendVerifyMessage',
                        data: { 'receiveNo': _this.addMemberInfo.phoneVal, 'inviterId': userid },
                        success: function (result) {
                            if (result.isSuccess) {
                                _this.timer = setInterval(function () {
                                    if (_this.countDown < 1) {
                                        _this.addMemberInfo.codeInfo = '发送';
                                        _this.addMemberInfo.isCodeDis = false;
                                        _this.countDown = 90;
                                        clearInterval(_this.timer);
                                    } else {
                                        _this.addMemberInfo.codeInfo = _this.countDown + '秒后可再获取';
                                        --_this.countDown;
                                    }
                                }, 1000);
                                _this.popUpInfo('验证已经通过站内信发送，请询问新成员获得');
                            } else {
                                _this.popUpInfo(result.message);
                                _this.addMemberInfo.isCodeDis = false;
                            }
                        }
                    });
                }

            },
            addMember: function () {

                var _this = this;
                /*ajax获取数据*/
                Public.API_GET({
                    url: 'addCafpTeam',
                    data: { 'receiveNo': _this.addMemberInfo.phoneVal, 'belongToMemberId': _this.userID, 'verifyNo': _this.addMemberInfo.codeVal },
                    success: function (result) {
                        if (result.isSuccess) {
                            _this.popUpInfo('添加成功');
                            _this.offset=0;
                            _this.getDate();
                            _this.clearData();
                        } else {
                            _this.popUpInfo(result.message);
                        }
                    }
                });

            },
            closeLayer: function () {
                /*关闭层*/
                $("body").removeClass('embarScroll');
                this.isFilter = false;
                this.isShow = false;
                this.clearData();
            },
            verifyPhone: function () {
                var _this = this;
                if (_this.addMemberInfo.phoneVal.toString().length >= 11) {
                    _this.addMemberInfo.phoneVal = _this.addMemberInfo.phoneVal.toString().substring(0, 11);
                    if (_this.countDown == 90) {
                        _this.addMemberInfo.isCodeDis = false;
                    }
                } else {
                    _this.addMemberInfo.isCodeDis = true;
                }
            },
            verifyCode: function () {
                var _this = this;
                if (_this.addMemberInfo.codeVal.toString().length >= 6) {
                    _this.addMemberInfo.codeVal = _this.addMemberInfo.codeVal.toString().substring(0, 6);
                    if (_this.addMemberInfo.phoneVal.length == 11) {
                        _this.addMemberInfo.isPhoneDis = false;
                    }
                } else {
                    _this.addMemberInfo.isPhoneDis = true;
                }
            },
            showAdd: function () {
                $("body").addClass('embarScroll');
                var _this = this;
                _this.isFilter = true;
                _this.isShow = true;
            },
            clearData: function () {
                //清空添加人员数据
                this.addMemberInfo.phoneVal = "";
                this.addMemberInfo.codeVal = "";
                this.addMemberInfo.isPhoneDis = true;
                this.addMemberInfo.isCodeDis = true;
                this.addMemberInfo.codeInfo = '发送';
                this.countDown = 90;
                clearTimeout(this.timer);
            },
            popUpInfo: function (info) {
                Toast({
                    message: info,
                    position: 'bottom',
                    duration: 3000
                });
            }
        },
        created: function () {
            var _this = this;
            _this.userID = this.$route.params.id;
            // Public.setPageInit(_this.getDate)
            // Public.pageInit()
            _this.getDate();

            var wh = $(window).height();
            $(window).on("scroll", function () {
                var top = $(this).scrollTop();
                // _this.androidTop.top = top + 80;
                var dh = $(document).height();
                if (top + wh >= dh) {
                    if (_this.ajaxLock) {
                        _this.loading = true
                        _this.ajaxLock = false
                        _this.getMore(_this.currentTab);
                    }
                }
            });
        },
        mounted: function () {
        },
        watch: {
            '$route': function () {
                this.userID = this.$route.params.id;
                this.lastID = this.$route.query.last;
                this.offset = 0;
                this.getDate();
            },
            userID:function(){
                $(".personal").removeClass('on');
            }
        }

    }
</script>