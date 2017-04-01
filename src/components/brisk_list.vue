<template>
    <div class="list-wrap">
        <scroller delegate-id="myScroller" :on-refresh="refresh" :on-infinite="infinite" ref="my_scroller">
            <ul>
                <li v-for="item in items">
					<!--<a v-herf="item.href">-->
                    <a>
                        <p class="upline clearfix">
                        <span class="title-left">{{item.name}}-{{item.id}}</span>
                        <span class="title-right">{{item.statusTitle}}</span>
                        </p>
                        <p class="downline clearfix">
                            <span class="title-left">{{item.rate}}%</span>
                            <span class="title-right">{{item.day}}{{item.dayName}}</span>
                        </p>
                    </a>
                </li>
            </ul>
        </scroller>
    </div>
</template>
<script>
    import Scroller from './Scroller.vue'
    export default{
        components:{
            Scroller
        },
        data(){
            return {
                start:0,
                uniLength:10,
                items:[
                ],
                hasMore:true,
                load:""
            }
        },
        methods: {
           refresh() {
                this.items = [];
                this.initData();
                $('.loading-layer').html(this.load);
            },
            infinite() {
                if(this.hasMore){
                    if(this.bottom){
                        Public.API_GET({
                            url : 'briskProductList',
                            data:{offset:this.bottom,max:this.uniLength},
                            success : response =>{
                                response.data.map(r=>{return {
                                        name:r.productTitle,
                                        id:r.productId,
                                        rate:r.productYearRate,
                                        day:r.productCycle,
                                        statusTitle:r.productStatusDescription,
                                        dayName:r.productCycleTypeDescription
                                    }
                                }).forEach(d=>this.items.push(d));
                                this.bottom += response.data.length;
                                this.hasMore = response.data.length<this.uniLength?false:true;
                                if(!this.hasMore){
                                    $('.loading-layer').html('没有更多了');
                                }
                                setTimeout(() => {
                                    if (this.$refs.my_scroller)
                                    this.$refs.my_scroller.resize();
                                })
                            },
                            error: response=>{
                                this.hasMore = false;
                                $('.loading-layer').html('没有更多了');
                            }
                        });
                        $('.loading-layer').show();
                    }
                }
                else{//加载完毕
                    $('.loading-layer').html('没有更多了');
                }
            },
            initData(){
                Public.API_GET({
                    url : 'briskProductList',
                    data:{offset:0,max:this.uniLength},
                    success : response =>{
                        this.top = 1;
                        this.items = response.data.map(r=>{return {
                                name:r.productTitle,
                                id:r.productId,
                                rate:r.productYearRate,
                                day:r.productCycle,
                                statusTitle:r.productStatusDescription,
                                dayName:r.productCycleTypeDescription
                            }
                        });
                        this.bottom = response.data.length;
                        this.hasMore = response.data.length<this.uniLength?false:true;
                        if(this.hasMore) {
                            $('.loading-layer').show();
                        }
                        if (this.$refs.my_scroller)
                            this.$refs.my_scroller.finishPullToRefresh();
                    }
                });
            }
        },
        mounted(){
            Public.setPageInit(this.initData)
            Public.pageInit() 
            setTimeout(() => {
                this.$refs.my_scroller.resize();
            })
            this.load =  $('.loading-layer').html();
            $('.loading-layer').hide();
        }
    }
</script>