<!--产品说明页面-->
<template>
    <div class="ttj">
        <div class="discribe">
            {{siteInfo.currentDeposit}}是{{siteInfo.siteName}}为您精心打造的活期产品，申购{{siteInfo.currentDeposit}}的资金投向真实优质债权项目，不仅能够得到超额收益，还能随时提取，方便灵活且不收取任何手续费。
        </div>
        <div class="intro-one">
            <table>
                <tr>
                    <td class="w26 gray">产品说明</td>
                    <td>平台优选真实优质债权项目</td>
                </tr>
                <tr>
                    <td class="w26 gray">收益率</td>
                    <td>平均年利率{{rate}}%(将根据市场行情不定期调整)</td>
                </tr>
                <tr>
                    <td class="w26 gray">项目期限</td>
                    <td>无期限，可以随时申请赎回</td>
                </tr>
            </table>
        </div>
        <div class="intro-one">
            <table>
                <tr>
                    <td class="w26 gray">申购门槛</td>
                    <td>可用余额申购，{{minMoney}}元起</td>
                </tr>
                <tr>
                    <td class="w26 gray">申购限制</td>
                    <td>单人单日累计申购上限{{dailyInMoney}}元<br> 单人累计申购总额上限为{{sumMax}}元
                    </td>
                </tr>
                <tr>
                    <td class="w26 gray">起息日</td>
                    <td>当日16:00前申购成功的金额当日起息<br> 16:00点后申购成功的金额次日起息
                    </td>
                </tr>
                <tr>
                    <td class="w26 gray">收益到账日</td>
                    <td>起息后收益次日到账</td>
                </tr>
            </table>
        </div>
        <div class="intro-one">
            <table>
                <tr>
                    <td class="w26 gray">赎回</td>
                    <td>债权转让退出，由新的投资人接手后赎回</td>
                </tr>
                <tr>
                    <td class="w26 gray">赎回限制</td>
                    <td>每位投资人单日赎回上限为{{redeemDayMax}}元</td>
                </tr>
                <tr>
                    <td class="w26 gray">赎回说明</td>
                    <td>申请赎回后，赎回金额回到您账户余额中,若遇到赎回人数较多情况，申请赎回后会按照每位用户申请赎回顺序至每位用户账户余额中,最晚T+1（工作日）到余额账户。</td>
                </tr>
            </table>
        </div>
        <div class="intro-one">
            <table>
                <tr>
                    <td class="w26 gray">费用</td>
                    <td>平台手续费用0.00元</td>
                </tr>
                <tr>
                    <td class="w26 gray red">说明</td>
                    <td>体验金、红包等不能申购{{siteInfo.currentDeposit}}<br> 持有期间利息按日计算，本金自动复投
                    </td>
                </tr>
            </table>
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
                siteInfo:Public.siteInfo
            }
        },
        methods: {
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
            }
        },
        mounted() {
            this.$parent.setTitle("产品说明");
            Public.setPageInit(this.getData)
            Public.pageInit()
        }
    }

</script>