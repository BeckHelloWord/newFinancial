<template>
    <div>
    <div class="customer-bar compd clearfix" >
        <div class="customer-col" v-on:click="goToClient">
            <div class="customer-logo-cover">
                <i class="iconfont icon-bussinessman"></i>
            </div>
            <div>
                客户列表
            </div>
        </div>
        <div class="customer-col">
            <div class="customer-logo-cover"  v-on:click="goToContacts">
                <i class="iconfont icon-comments"></i>
            </div>
            <div>
                消息群发
            </div>
        </div>
        <div class="customer-col">
            <div class="customer-logo-cover"  v-on:click="goToPayment">
                <i class="iconfont icon-trade"></i>
            </div>
            <div>
                即将回款
            </div>
        </div>
        <div class="customer-col">
            <div class="customer-logo-cover"  v-on:click="goToBirthday">
                <i class="iconfont icon-renwuguanli"></i>
            </div>
            <i  v-if="birthday > 0" class="customer-logo-alert">{{birthday}}</i>
            <div>
                生日提醒
            </div>
        </div>
    </div>
    <!--div class="invest-list compd customer-title">客户动态</div-->
    <div class="customer-tab  clearfix">
        <ul>
            <li class="on" v-on:click="changeTab" data-tab="all">全部</li>
            <li v-on:click="changeTab" data-tab="receipt">回款</li>
            <li v-on:click="changeTab" data-tab="register">注册</li>
            <li v-on:click="changeTab" data-tab="recharge">充值</li>
            <li v-on:click="changeTab" data-tab="invest">投资</li>
            <li v-on:click="changeTab" data-tab="withdraw">提现</li>
        </ul>
    </div>
    <div>
        <template v-if="jionlist.length > 0">
            <div class="record-list compd">
                <table>
                    <tbody>
                    <template v-for="item in jionlist">
                        <tr v-on:click="toCustomerDetail" :data-member="item.memberId">
                            <td width="20%">
                                <i v-if="item.avatar"  class="headimg"
                                   v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
                                <i v-else class="defaultHead"></i>
                            </td>
                                <td width="35%" class="list-center">
                                    <span class="g333">{{item.realName}}<em v-bind:class="'tap tap-'+item.type">{{item.typeName}}</em></span>
                                    <p class="g999">{{item.time}}</p>
                                </td>

                            <td class="list-right" width="45%">
                                <template v-if="item.type!='register'">
                                    <span class="g333">{{item.balanceaffect|formatMoney}}元</span>
                                </template>
                                <template v-if="item.type=='recharge'||item.type=='withdraw'">
                                    <p class="g999"  v-if="item.type=='recharge'">{{"共"+item.number+"笔充值"}}</p>
                                    <p class="g999"  v-if="item.type=='withdraw'">{{"共"+item.number+"笔提现"}}</p>
                                </template>
                                <template v-if="item.type=='invest'||item.type=='receipt'">
                                    <p class="g999"  v-if="item.type=='receipt'&&item.number>1">{{"共"+item.number+"笔回款"}}</p>
                                    <p class="g999"  v-if="item.type=='invest'&&item.number>1">{{"共"+item.number+"笔投资"}}</p>
                                    <p class="g999"  v-if="item.number==1">{{item.remark|formatRemark}}</p>
                                </template>
                                <template v-if="item.type=='register'">
                                    <p class="g999"  v-if="item.number==1">{{item.mobile}}</p>
                                </template>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>

        </template>
    </div>
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
</template>

<script>
    export default{
        data:function() {
            return {
                birthday:0,
                jionlist:[],
                offset :0,
                max:10,
                currentTab:"all",
                ajaxLock:true,
                tableLock:false,
                loading:true,
                initTime:0,
                assFlag:true

            }
        },
        methods:{
            goToClient:function(){
                Public.PushNextPage(this.$router,"/client")
//                this.$router.push("/client")
            },
            goToBirthday:function(){
                Public.PushNextPage(this.$router,"/birthday")
            },
            goToContacts:function(){
                Public.PushNextPage(this.$router,"/contacts")
            },
            goToPayment:function(){
                Public.PushNextPage(this.$router,"/payment")
            },
            toCustomerDetail:function(e){
//                console.log(e.currentTarget.dataset.member)
                Public.AppJump("https://"+window.location.host+"/m/index.html#!/financialPlanner/view/"+e.currentTarget.dataset.member)

            },
            changeTab:function(e){
                var _this=this;
                if(_this.tableLock){
                   return
                }else{
                    $(".on").removeClass("on");
                    $(e.currentTarget).addClass("on");
                    _this.currentTab=e.currentTarget.dataset.tab;
                    _this.jionlist=[];
                    _this.ajaxLock=true;
                    _this.offset=0;
                    _this.getMore(this.currentTab)
                    _this.tableLock=true;
                }
            },
            getDate:function(){
                localStorage.setItem("ajaxStart",new Date().getTime())
                var _this=this;
                if(Public.Auth.get()==0){
                    _this.assFlag=true
                }else{
                    _this.assFlag=false
                }
                Public.API_GET({
                    url : 'recommendMoneyRecord',
                    data : {  offset : _this.offset ,max : _this.max  },
                    success : function(result){
                        if(result.isSuccess){
                            _this.jionlist=result.data;
                            if(result.data.length<10){
                                _this.ajaxLock=false
                                _this.loading=false;
                            }else{
                                _this.ajaxLock=true
                                _this.loading=true;
                            }
                            _this.offset=10;
                        }else if(_this.assFlag){
                            if(_this.initTime<10){
                                window.setTimeout( function(){
                                    _this.getDate()
                                },200)
                                _this.initTime++;
                            }
                        }
                    }
                });
            },
            getMore:function(currentTab){
                var _this=this
                var sendData={
                    offset : _this.offset ,max : _this.max
                }
                if(currentTab!="all"){
                    sendData.type=currentTab
                }
                Public.API_GET({
                    url : 'recommendMoneyRecord',
                    data : sendData,
                    success : function(result){
                        _this.jionlist=_this.jionlist.concat(result.data)
                        _this.tableLock=false;
                        if(result.data.length<10){
                            _this.ajaxLock=false
                            _this.loading=false
                        }else{
                            _this.loading=true
                            _this.ajaxLock=true
                        }
                        _this.offset+=10;
                    }
                });
            },
            initBirthday:function(){
                var _this=this
                Public.API_GET({
                    url : 'getClientBirthdayList',
                    data : { day : 7, offset : 0 ,max : 99  },
                    success : function(result){
                        _this.birthday=result.data.length;
                    }
                });
            }
        },

        mounted:function(){
            this.$parent.setTitle("客户动态")
            var _this=this;
            Public.setPageInit(_this.getDate)
            Public.pageInit()
//            _this.initBirthday()
            /*滚动加载*/
           var wh=$(window).height();
            $(window).on("scroll",function () {
                var top = $(this).scrollTop();
                var dh = $(document).height();
                if(top + wh >= dh){
                    if(_this.ajaxLock){
                        _this.loading=true
                        _this.ajaxLock=false
                        _this.getMore(_this.currentTab);
                    }
                }
            });
        },
        beforeMount:function(){

        }
    }
</script>
