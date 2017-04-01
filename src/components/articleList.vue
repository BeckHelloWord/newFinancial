<template>
        <li>
            <router-link :to="{ name: 'briskNew', params: { id: item.articleId }}">
            <p>{{item.articleTitle}}</p>
            </router-link>
        </li>
    
</template>
<script>
    export default {
        props:['item']
    }
</script>

<style>
.gray{background:#edf0f3;}
/*主页*/
.outMain{background:#fff;}
.helpMain{width:100%;padding-bottom:1rem;overflow:hidden;position:relative;}
.helpBg{background:rgb(237, 240, 243);}
.helpMain .section01{background:#fff;position:relative;}
.helpMain .section01 ul{height:3.13rem;line-height:3.13rem;margin:0 auto;padding-left:1.3rem;}
.helpMain .section01 ul li{text-align:center;font-size:12px;color:#a9b3c2;-webkit-tap-highlight-color:rgba(255,255,255,0);float:left;}
.helpMain .section01 ul li.on{color:#2d449f;border-bottom:0.16rem solid #f6cd53;box-sizing:border-box;}



.helpMain .sectionTab{width:100%;}
.helpMain .sectionTab ul{}
.helpMain .sectionTab ul li{height:5rem;line-height:5rem;padding:0 1.25rem;margin-bottom:0.39rem;font-size:1.09rem;color:#333;background:url("../assets/gt.jpg") no-repeat #fff 94% center;background-size:2%;}
.helpMain .sectionTab ul li p{max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.helpMain .sectionTab ul li a{color: #333;}

</style>