<template>
    <div style="backgroundColor:#efefef"  >
	<mt-loadmore :top-method="refresh" ref="my_track">
 			<div class="track-box track">
                <h3>客户质量分析  <i class="iconfontTeam icon-tuandui track-team" @click="toTeam" v-show="personFlag"></i></h3>
				<div class="cycle" ref="abc">
					<pie-chart  :cycle="cycle" :width="pie_width" :height="pie_height"></pie-chart>
				</div>
				<div class="track-top-info">
					<div>
						<p>{{memberList.inInvestSum}}</p>
						<p>在投客户数</p>
					</div>
					<div>
						<p>{{memberData.investCustomersNum}}</p>
						<p>今日投资客户</p>
					</div>
					<div>
						<p>{{memberList.customerSum}}</p>
						<p>总客户数</p>
					</div>
					<div>
						<p>{{memberData.newCustomersNum}}</p>
						<p>今日新增客户</p>
					</div>			
				</div>
				<div class="c"></div>
				<div class="investing">
					在投客户占比
				</div>
			</div>
			<div class="track-chart track">
			<my-chart :chartData="chartData"></my-chart>
			
				<div class="offer">
					<div>
						<p>{{memberData.todayInvestMoney | formatMoney}}</p>
						<p>今日客户投资额</p>
					</div>
					<div class="track-bl">
						<p>{{memberData.todayInvestMoneyYear | formatMoney}}</p>
						<p>今日年化业绩</p>
					</div>
				</div>
				<div class="c"></div>
			</div>
			<div class="track-all track ">
				<div class="track-all-info track-bb">
					<p>{{memberData.yesterdayInvestMoneyYear | formatMoney}}</p>
					<p>昨日年化业绩</p>
				</div>
				<div class="track-all-info track-bb track-bl">
					<p>{{memberData.weekMoneyYear | formatMoney}}</p>
					<p>本周年化业绩</p>
				</div>
				<div class="track-all-info">
					<p>{{memberData.montyInvestMoneyYear | formatMoney}}</p>
					<p>本月年化业绩</p>
				</div>
				<div class="track-all-info track-bl">
					<p>{{memberData.lastMontyInvestMoneyYear | formatMoney}}</p>
					<p>上月年化业绩</p>
				</div>
				<div class="c"></div>
			</div>
			</mt-loadmore>	
	</div>
</template>

<script>
import PieChart from './pieChart.vue'
import MyChart from './myChart3.vue'
import Scroller from './Scroller.vue'
    export default{
		components:{
            Scroller:Scroller,
			myChart:MyChart,
			pieChart:PieChart
        },
        data:function() {
            return {
				pie_width:window.innerWidth*0.4,
				pie_height:window.innerWidth*0.4,
                personFlag:false,
                memberData:{
					teamAuth:"",//【noTeam:没有权限，bigTeam:大团队管理，team:所属团队列表】
                    todayInvestMoneyYear:0,//个人今日年化业绩
                    todayInvestMoney :0,//个人今日客户投资额
                    yesterdayInvestMoneyYear:0,//个人昨日年化业绩
                    weekMoneyYear:0,//个人本周年化业绩
                    lastMontyInvestMoneyYear:0,//个人上月年化业绩
                    montyInvestMoneyYear:0,//个人本月年化业绩
                    investCustomersNum:0,//今日投资客户数
                    newCustomersNum:0,//今日新增客户数
                  
                    recentPersonSevenGraph:[
                       
                    ]
                },
				memberList:{
					inInvestSum:0,//在投客户
                    customerSum :0,//总客户数
                    personInvestPercent:0,//在投客户占比
				},
				cycle:0,
				chartData:[]
            }
        },
        methods:{
			refresh() {
				this.initData()  
            },
            toTeam() {
				if(this.memberData.teamAuth=="bigTeam"){
 					Public.PushNextPage(this.$router,"/team")
				}else{
					Public.PushNextPage(this.$router,"/memberGrade")
				}
               
            },
			initData:function(){
				$(document.body).css("backgroundColor","#efefef")
				$(".cycle").width(this.pie_width).height(this.pie_height)
				$(".track-top-info>div").height(this.pie_height/2)
				$(".track-top-info>div").css("paddingTop",this.pie_height/16)
				$(".track-top-info>div").css("paddingBottom",this.pie_height/16)
				var sendData;
				if(this.$route.params.id){
					sendData={investMemberId:this.$route.params.id}
				}else{		
					sendData={}
				}
				this.initNext()
				Public.API_GET({
                    url : 'getPersonSales',
                    data :sendData,
                    success : (result)=>{		
                        if(result.isSuccess){
                          this.memberData=result.data;
						  if(result.data.recentPersonSevenGraph){
  								this.chartData=result.data.recentPersonSevenGraph;
						  }
						  if(result.data.teamAuth=="noTeam"){
							  this.personFlag=false
						  }else{
							  if(this.$route.params.id){
									this.personFlag=false
								}else{
									this.personFlag=true
								}
						  }
						  	this.$parent.setTitle(result.data.name+"个人业绩");
						  	this.$refs.my_track.onTopLoaded();
                        }
						
                    }
                });
			},
			initNext:function(){
				var sendData;
				if(this.$route.params.id){
					sendData={investMemberId:this.$route.params.id}
			
				}else{
				
					sendData={}
				}
				Public.API_GET({
                    url : 'getPersonSalesQuality',
                    data :sendData,
                    success : (result)=>{
                        if(result.isSuccess){
							this.memberList=result.data
							this.cycle=result.data.personInvestPercent
                          	// this.memberData.inInvestSum=result.data.inInvestSum;
							// this.memberData.customerSum=result.data.customerSum;
						    // this.memberData.personInvestPercent=result.data.personInvestPercent;
                        }
                    }
                });
			}
        },
        mounted:function(){
			
			this.$parent.setTitle("");
			Public.setPageInit(this.initData)
            Public.pageInit()
			
		},
		beforeMount:function(){

        }
    }
</script>