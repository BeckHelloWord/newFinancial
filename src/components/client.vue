<template>
    <section>
        <div class="view" style="padding-bottom:51px">
            <div class="search-wrap" v-show="flg">
                <!--<input type="text" placeholder="搜索"   disabled />-->
                <div class="search-input"  v-on:click="jumpSearch"><i class="icon-search-local icon-search-bold iconfontSearch"></i>搜索</div>
                
            </div>
            
            <div class="invest-list compd customer-title clearfix">我的客户<span >{{rightTitle}}</span><span class="client-center-title" v-show="currentTab=='all'">账户余额</span></div>
            <template v-if="jionlist.length > 0">
                <div class="record-list compd">
                    <table>
                        <tbody>
                            <tr v-for="item in jionlist" v-on:click="toCustomerDetail" :data-member="item.memberId">
                                <td width="15%">
                                    <i v-if="item.avatar" class="headimg" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                                    <i v-else class="defaultHead"></i>
                                </td>
                                <td width="31%" class="list-center">
                                    <span class="g333">{{item.realName|formatName}}</span>
                                    <p v-if="currentTab=='norealname'" class="g999">注册时间:{{item.regTime}}</p>
                                    <p class="g999" v-else>{{item.mobile}}</p>
                                </td>
                               <td class="list-right client-center-list" v-show="currentTab=='all'" width="27%">
                                   
                                    <span class="g333 ">{{item.accountBalance | formatMoney}}</span>
                                </td>
                                <td class="list-right" width="27%">
                                    <span class="g333 client-extend" v-if="currentTab=='norealname'">{{item.mobile}}</span>
                                    <span class="g333" v-else>{{item.extend | formatMoney}}</span>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                </div>
            </template>
            <div v-if="jionlist.length != 0&&loading" class="load-gif">
                加载中...
            </div>
            <div v-if="jionlist.length != 0&&!loading" class="load-gif">
                没有更多了
            </div>
            <div v-if="jionlist.length == 0&&loading" class="customer-loading">
                加载中...
            </div>
            <div v-if="jionlist.length == 0&&!loading" class="customer-loading">
                暂无数据
            </div>
        </div>
        <div class="client-tab">
            <ul>
                <li class="on" v-on:click="changeTab" data-tab="all">全部</li>
                <li v-on:click="changeTab" data-tab="invote">在投客户</li>
                <li v-on:click="changeTab" data-tab="novote">空仓客户</li>
                <li v-on:click="changeTab" data-tab="norealname">未实名</li>
            </ul>
        </div>
    </section>
</template>

<script>
    export default {
        data: function () {
            return {
                jionlist: [],
                max: 10,
                offset: 0,
                ajaxLock: true,
                currentTab: "all",
                loading: true,
                tableLock: false,
                rightTitle: "在投金额",
                initTime: 0,
                assFlag: false,
                flg: false
            }
        },
        methods: {
            toCustomerDetail: function (e) {
                Public.AppJump("https://" + window.location.host + "/m/index.html#!/financialPlanner/view/" + e.currentTarget.dataset.member)
                //                window.location.href = "http://"+window.location.host+"/m/#!/financialPlanner/view/"+e.currentTarget.dataset.member
            },
            changeTab: function (e) {
            
                var _this = this;
                $(".on").removeClass("on");
                $(e.currentTarget).addClass("on");
                _this.currentTab = e.currentTarget.dataset.tab;
                _this.jionlist = [];
                _this.ajaxLock = true;
                _this.loading = true;
                _this.offset = 0;
                if (this.currentTab == "norealname") {
                    _this.rightTitle = "手机号码"
                } else if (this.currentTab == "invote" || this.currentTab == "all") {
                    _this.rightTitle = "在投金额"
                } else {
                    _this.rightTitle = "账户余额"
                }
                if (_this.tableLock) {
                    return
                } else {
                    _this.getMore(this.currentTab)
                   
                }
            },
            jumpSearch: function () {
                // 搜索跳转
                this.$router.push("/search/" + this.currentTab)
                // Public.PushNextPage(this.$router, "/search/" + this.currentTab);
            },
            getDate: function () {
                var _this = this;
                if (Public.Auth.get() == 0) {
                    _this.assFlag = true
                } else {
                    _this.assFlag = false
                }
                Public.API_GET({
                    url: 'recommendMember',
                    data: { offset: _this.offset, max: _this.max },
                    success: function (result) {
                        if (result.isSuccess) {

                        } else if (_this.assFlag) {
                            if (_this.initTime < 10) {
                                window.setTimeout(function () {
                                    _this.getDate()
                                }, 300)
                                _this.initTime++;
                            }
                        }
                        if (result.data.list && result.data.list.length > 0) {
                            _this.jionlist = result.data.list;
                            // _this.$parent.setTitle("客户列表(" + result.data.recommendSize + "位)")
                        } else {

                            _this.jionlist = [];
                        }
                        if (!result.data.list || result.data.list.length < 10) {
                            _this.ajaxLock = false
                            _this.loading = false;
                        } else {
                            _this.loading = true;
                        }
                        _this.offset = 10;
                    }
                });
            },
            getMore: function (currentTab) {
                var _this = this
                var sendData = {
                    offset: _this.offset, max: _this.max
                }
                if (currentTab != "all") {
                    sendData.type = _this.currentTab
                }
                if(_this.tableLock){
                    return
                }
                 _this.tableLock = true;
                Public.API_GET({
                    url: 'recommendMember',
                    data: sendData,
                    success: function (result) {
                        _this.tableLock = false;
                        if (result.data.list && result.data.list.length > 0) {
                            _this.jionlist = _this.jionlist.concat(result.data.list)
                        }
                        if (!result.data.list||result.data.list.length < 10) {
                            _this.ajaxLock = false
                            _this.loading = false;
                        } else {
                            _this.loading = true;
                            _this.ajaxLock = true
                        }
                        _this.offset += 10;
                    }
                });
            }
        },

        created: function () {

            this.$parent.setTitle("客户列表")
            var _this = this;
            var wh = $(window).height();
            $(window).on("scroll", function () {
                var top = $(this).scrollTop();
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
            var _this = this;
            Public.setPageInit(_this.getDate)
            Public.pageInit()

            var slide = function (obj, offset, callback) {
                var start,
                    end,
                    isLock = false,//是否锁定整个操作
                    isCanDo = false,//是否移动滑块
                    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
                    hasTouch = 'ontouchstart' in window && !isTouchPad;
                //将对象转换为jquery的对象
                obj = $(obj);
                var objparent = obj.parent();
                /*操作方法*/
                var fn =
                    {
                        //移动容器
                        translate: function (diff) {
                            obj.css({
                                "-webkit-transform": "translate(0," + diff + "px)",
                                "transform": "translate(0," + diff + "px)"
                            });
                        },
                        //设置效果时间
                        setTranslition: function (time) {
                            obj.css({
                                "-webkit-transition": "all " + time + "s",
                                "transition": "all " + time + "s"
                            });
                        },
                        //返回到初始位置
                        back: function () {
                            fn.translate(0 - offset);
                            //标识操作完成
                            isLock = false;
                        }
                    };
                //滑动开始
                obj.bind("touchstart", function (e) {
                    if (objparent.scrollTop() <= 0 && !isLock) {
                        var even = typeof event == "undefined" ? e : event;
                        //标识操作进行中
                        isLock = true;
                        isCanDo = true;
                        //保存当前鼠标Y坐标
                        start = hasTouch ? even.touches[0].pageY : even.pageY;
                        //消除滑块动画时间
                        fn.setTranslition(0);
                       
                    }
                });
                //滑动中
                obj.bind("touchmove", function (e) {
                    if (objparent.scrollTop() <= 0 && isCanDo) {
                        var even = typeof event == "undefined" ? e : event;
                        //保存当前鼠标Y坐标
                        end = hasTouch ? even.touches[0].pageY : even.pageY;
                        if (start < end) {
                            even.preventDefault();
                            //消除滑块动画时间
                            fn.setTranslition(0);
                            //移动滑块
                            fn.translate(end - start - offset);
                        }
                    }
                });
                //滑动结束
                obj.bind("touchend", function (e) {
                    if (isCanDo) {
                        isCanDo = false;
                        //判断滑动距离是否大于等于指定值
                        if (end - start >= offset) {
                            //设置滑块回弹时间
                            fn.setTranslition(1);
                            //保留提示部分
                            fn.translate(0);
                            //执行回调函数
                            if (typeof callback == "function") {
                                callback.call(fn, e);
                            }
                        } else {
                            //返回初始状态
                            // fn.back();
                            isLock = false;
                        }
                    }
                });
            }

            var obj = new slide(".view", 50, function () {
                _this.flg = true;
            });

        }
    }
</script>