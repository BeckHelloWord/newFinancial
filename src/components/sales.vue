<template>
    <!--我的业绩 start-->
    <section>
        <section class="sales-wrap">
            <div class="sales-img mt_40 mb_30"></div>
            <p class="sales-txt">程序媛和攻城狮们正在加班加点<br/><strong>您想要什么功能，可以现在告诉我们。</strong></p>
            <a class="sales-tel mt_10" href="tel:400-885-1100">tel: 400-885-1100</a>
        </section>
    </section>
    <!--我的业绩 end-->
</template>

<script>
    export default{
        data: function () {
            return {}
        },

        methods: {},

        created: function () {
            this.$parent.setTitle("我的业绩");
        }
    }
</script>
