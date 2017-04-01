<template>
<article class="helpMain helpBg">
    <section class="sectionTab">
            <ul class="listCon">
                <template v-for="item in list">
                    <list :item='item'></list>        
                </template>
            </ul>
    </section>
    <table class="tableA">
        <tbody v-show="show">
        <tr class="noData">
            <td colspan="3">暂无数据</td>
        </tr>
        </tbody>
    </table>
</article>
</template>
<script>
    import list from './articleList.vue'
    export default {
        data(){
            return {
                show:false,
                list:[
                    {
                        articleId:'',
                        articleTitle:''
                    }
                ]
            }
        },
        methods:{
            getInfo:function(){//获取添添金列表 
                var that=this;
                Public.API_GET({
                    url:'briskQuestions',
                    data: {"helpKey":"brisk",max:99},
                    success: function (result) {
                        if(result.isSuccess){
                            that.show=false;
                            setTimeout(function(){
                                that.list = result.data;
                            },0)
                        }else{
                            that.list=[];
                            that.show=true;
                        }
                    }
                });
            },
        },
        components: {list},
        mounted(){
            $('body').css({background:'#edf0f3'});
        },
        destroyed(){
            $('body').css({background:'#fff'});
        },
        created(){
            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.bodyColor='gray';
            this.getInfo();
        }
    }
</script>