<template>
    <div >
	<div id="myChart" style="width:100%;height:200px"></div>
	</div>
</template>

<script>
 	import ECharts from 'ECharts';
	console.log(ECharts)
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
					this.data.push(this.chartData[i].investYear)
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
				
 			var myChart = ECharts.init(document.getElementById('myChart')); 
			var option = {
				color:["rgba(54, 162, 235, 1)"],
				tooltip : {
					trigger: 'axis'
				},
				grid:{
					x: "10%",
					y: "90%",
					x2: "10%",
					y2: "90%",
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : this.label
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'成交',
						type:'line',
						smooth:true,
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data:this.data
					}
				]
			};
   
 				myChart.setOption(option); 
			
			}
        },
        mounted:function(){
			this.fomartData()
        },
        beforeMount:function(){

        }
    }
</script>
