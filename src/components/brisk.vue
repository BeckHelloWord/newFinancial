<template>
    <div class="brisk-wrap">
        <section class="brisk-tab">
            <div class="brisk-tab-list">
                <ul class="clearfix">
                   <li class="brisk-item" :class="[href=='/brisk/doc'?'active':'']"><router-link to="/brisk/doc">产品说明</router-link></li>
                    <li class="brisk-item" :class="[href=='/brisk/sec'?'active':'']"><router-link to="/brisk/sec">安全保障</router-link></li>
                    <li class="brisk-item" :class="[href=='/brisk/list'?'active':'']"><router-link to="/brisk/list">项目清单</router-link></li>
                </ul>
            </div>
            
        </section>
        <section class="brisk-container">
             <router-view></router-view>
        </section>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                href:this.$router.app._route.path
            }
        },
        mounted(){
            $('.brisk-item').click(function(){
                $('.brisk-item').removeClass('active');
                $(this).addClass('active');
            })
        }
    }
</script>
<style>

</style>