<template>
<div>
    <article class="helpMain helpNews">
    <section class="helpNewsIn">
        <h2>{{list.title}}</h2>
        <p class="listP" v-html="list.content">
        </p>
    </section>
    </article>
    <footer>
        <p>END</p>
    </footer>
</div>
</template>

<script>
    export default {
        data(){
            return {
                list:[{
                        title:"",
                        content:"",
                        description:"",
                        redirectUrl:""
                }]
            }
        },
        methods:{
            getInfo:function(id){
                var that = this;
                Public.API_GET({
                    url:'getNoticeDetailOn',
                    data:{"articleId":id},
                    success:function(result){
                        if(result.isSuccess){
                            that.list = result.data;
                        }
                    }
                });
            }
        },
        created:function(){
            this.$root.$children[0].showgoback = true;
            this.$root.bodyColor='';
            this.getInfo(this.$route.params.id);	//获取id
            window.sessionStorage.setItem("newsSessionId",this.$route.params.id);
        }
    }
</script>

<style>
.helpNews{}
.helpNews .helpNewsIn{padding:0 1.25rem;}
.helpNews h2{padding:2.5rem 0;border-bottom:1px solid #e1e8f2;font-weight:normal;color:#2d449f;font-size:1.41rem;}
.helpNews .listP{color:#333;font-size:1.25rem;margin-top:1.72rem;line-height:1.8;}

footer{width:100%;height:.94rem;margin-top:1rem;position:relative;bottom:0;left:0;background:#fff;}
footer p{width:3.90625rem;height:100%;text-align:center;color:#dadada;font-size:1.17rem;position:absolute;left:50%;bottom:0;margin-left:-1.95rem;z-index:1;background:#fff;}
footer:before{content:"";width:90%;height:1px;position:absolute;top:.47rem;left:5%;display:block;background:#dedede;}
.expand-transition {transition: all .5s ease; -webkit-transition: all .5s ease;}
</style>