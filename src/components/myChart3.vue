<template>
    <div >
	<div id="myChart" style="width:100%;height:200px"></div>
	</div>
</template>

<script>
import HighCharts from "highcharts"
    export default{
    	props: ['chartData','type'],
        data:function() {
            return {
				label:[],
				data:[],
				ctx:"",
				myChart:null
            }
        },
		 watch: {
			// 如果 question 发生改变，这个函数就会运行
			chartData: function () {
				this.fomartData()
			}
		},
        methods:{
			fomartData:function() {
				this.label=[];
				this.data=[];
				for(var i=0;i<this.chartData.length;i++){
					this.label.push(this.$root.$options.filters['formatMonth'](this.chartData[i].countDay))
					this.data.push(Number(this.chartData[i].investYear) )
					
				}
				this.label.reverse()
				this.data.reverse()
				this.darw()
			},
			dealDate:function(day){
				day=day.toString()
				if(day.length==1){
					return "0"+day
				}else{
					return day
				}
			},
			darw:function(){
			var _this=this;
				HighCharts.chart('myChart', {
					title: {
						text: '',
						x: -20 //center
					},
						xAxis: {
						
							tickmarkPlacement:"on",
							allowDecimals:true,
						categories: this.label
					},
					stickyTracking:false,
					yAxis: {
						
						title: {
							text: ''
						},
						plotLines: [{
							value: 0,
							width: 1,
							 from: 0,               // 标示带开始值
       						 to: 100,   
							color: '#808080'
						}]
					},
					tooltip: {
						valuePrefix: '年化业绩',
						animation:false,
						stickyTracking:false,
						style:{ "color": "#000", "cursor": "default", "fontSize": "12px", "pointerEvents": "none", "whiteSpace": "nowrap" ,"font-weight":"100"},
						pointFormatter: function() {
							var key=this.x

							var day = new Date(_this.chartData[key].countDay.substr(0,4)+"/"+_this.label[key]);
							var weekStart;
							var title="";
							if(key==0){
								weekStart=new Date(day-6*24*60*60*1000);
							}else{
								weekStart=new Date(_this.chartData[key].countDay.substr(0,4)+"/"+_this.label[key-1]);
								weekStart.setDate(weekStart.getDate()+1);
							}
							if(_this.type=="thisWeek"){
								title= _this.dealDate(weekStart.getMonth()+1)+"/"+_this.dealDate(weekStart.getDate())+"~"+_this.label[key]
							}else{
								title= _this.label[key]
							}

							return title+'<br/>年化业绩:'+this.y.toFixed(2)
						},
						useHTML: true,
						headerFormat: '',
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'middle',
						borderWidth: 0,
						enabled:false
					},
					series: [{
						data: this.data
					}]
				});
			
			}
        },
        mounted:function(){
			this.fomartData()
        },
        beforeMount:function(){

        }
    }
</script>
<style>
g.highcharts-label{
 display:none
}
div.highcharts-label>span{
	padding:5px 3px;
	border:1px solid rgb(124, 181, 236);
	box-shadow: 2px 2px 1px rgb(124, 181, 236);
	background:white;
}
</style>