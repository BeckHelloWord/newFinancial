<template>
    <router-view ></router-view>
</template>

<script>
    import Interface from './js/interface.js'
    export default {
        data () {
            return {
                'IOS': false,
                'APP':false
            }
        },
        methods: {
            setTitle: function (Name) {
                document.title = Name;
                var titletxt = Name;

                //解决ios无法获取title问题123
                setTimeout(function () {
                    var body = document.getElementsByTagName('body')[0];
                    document.title = titletxt;
                    var iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    var d = function () {
                        setTimeout(function () {
                            iframe.removeEventListener('load', d);
                            document.body.removeChild(iframe);
                        }, 0);
                    };
                    iframe.addEventListener('load', d);
                    document.body.appendChild(iframe);
                }, 0);
            },
            isIOS: function () {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('baoxiangios') > -1) {
                    this.IOS = true;
                }
            },
            isApp: function () {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('baoxiang') > -1) {
                    this.APP = true;
                }
            }
        },
        components: {},
        beforeCreate:function(){
            this.APP = true;
            //获取站点信息
            var infoList=['siteName','currentDeposit','company','agreementAddress','agreementAddressShort']
           $.ajax({
            type: 'GET',
            cache:true,
            url: Interface.Model['getSiteInfo'],
            data: {
                arguments:infoList.join(",")
            },
            dataType: 'json',
            success: function(response){
                window.Public.siteInfo=response
            }
        });
        }
    }

</script>
<style lang="sass-loader">
    @import "./assets/pubilc";
    @import "../node_modules/vue-layer-mobile/need/layer.css";
    @import "./assets/font/iconfont.css";
</style>

