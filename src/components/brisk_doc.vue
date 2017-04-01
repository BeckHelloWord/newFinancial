<template>
    <div class="doc-wrap">
        <div class="doc-title">添添金是宝象金融为您精心打造的活期产品，申购添添金的资金投向真实优质债权项目，不仅能够得到超额收益，还能随时提取，方便灵活且不收取任何手续费。</div>
        <div class="doc-table clearfix">
            <table>
                <tbody>
                    <tr>
                        <td>申购范围</td>
                        <td>平台优选真实优质债权项目。</td>
                    </tr>
                    <tr>
                        <td>适合人群</td>
                        <td>需要资金灵活存取且收益稳健的投资人。</td>
                    </tr>
                    <tr>
                        <td>收益率</td>
                        <td>历史年利率{{rate}}%(将根据市场行情不定期调整)。</td>
                    </tr>
                    <tr>
                        <td>期限</td>
                        <td>无期限，可以随时申请赎回。</td>
                    </tr>
                    <tr>
                        <td>申购门槛</td>
                        <td>使用可用余额申购，{{minMoney}}元起。</td>
                    </tr>
                    <tr>
                        <td>申购限制</td>
                        <td>单人单日累计申购上限为{{dailyInMoney}}元；<br>单人累计申购总额上限为{{sumMax}}元。
                        </td>
                    </tr>
                    <tr>
                        <td>起息日</td>
                        <td>当日16：00前申购成功的金额当日起息，16：00点后申购成功的金额次日起息。</td>
                    </tr>
                    <tr>
                        <td>收益到账日</td>
                        <td>起息后收益次日到账。</td>
                    </tr>
                    <tr>
                        <td>赎回</td>
                        <td>债权转让退出，由新的投资人接手后赎回。</td>
                    </tr>
                    <tr>
                        <td>赎回限制</td>
                        <td>每位投资人单日赎回上限为{{redeemDayMax}}元。</td>
                    </tr>
                    <tr>
                        <td>费用</td>
                        <td>0.00%</td>
                    </tr>
                    <tr>
                        <td class="red">说明</td>
                        <td>• 体验金、红包等不能申购添添金；<br> • 持有期间利息按日计算，本金自动复投。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="doc-question">
            <div class="universial">常见问题</div>
            <ul class="question-list">
                <li class="question-item" v-for="(question, index)  in questions" @click="tabShow(question)">{{question.name}}<i class="question-icon" :class="[question.active?'down':'right']"></i>
                    <transition name="fade">
                        <div :class="[question.active?'active':'']" v-show="question.active" v-html="question.content"></div>
                    </transition>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                //年化收益率
                rate: 5.5,
                //起投金额
                minMoney: 100,
                //单人单日最高累计转入金额
                dailyInMoney: 20000,
                //每人最大累计投资金额
                sumMax: 50000,
                //wealthRedeemDayMax
                redeemDayMax: 20000,
                questions: []
            }
        },
        methods: {
            tabShow(question) {
                question.active = !question.active;
            },
            getData() {
                Public.API_GET({
                    url: 'briskRecommand',
                    success: response => {
                        if (response.data) {
                            this.rate = response.data.wealthYearRate;
                            this.minMoney = response.data.wealthInvestMin;
                            this.dailyInMoney = response.data.wealthInvestDayMax;
                            this.sumMax = response.data.wealthTotalInvestMax;
                            this.redeemDayMax = response.data.wealthRedeemDayMax;
                        }
                    }
                });
                Public.API_GET({
                    url: 'briskQuestions',
                    data: { helpKey: "brisk" },
                    success: response => {
                        this.questions = response.data.map(r => {
                            return {
                                name: r.articleTitle,
                                active: false,
                                content: r.articleContent
                            }
                        })
                    }
                })
            }
        },
        mounted() {
            Public.setPageInit(this.getData)
            Public.pageInit()
        }
    }
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>