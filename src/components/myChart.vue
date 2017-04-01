<template>
    <div >
	<div id="myChart"></div>
	</div>
</template>

<script>
 	
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
		
			if(this.myChart){
				this.myChart.destroy();	
				console.log("destroy")
			}else{
				console.log("redraw")
				this.ctx = document.createElement('canvas'); 
				document.getElementById("myChart"). appendChild(this.ctx);
			}		
			var _this=this;
			this.myChart = new Chart(this.ctx, {
				type: 'line',
				data: {
					 labels: this.label,
					datasets: [
						{
							label: false,
							// fill: true,
							lineTension: 0.1,
							backgroundColor: "rgba(54, 162, 235, 0.2)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderWidth: 1,
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointRadius: 1,
							data: this.data,
							spanGaps: false,
						}
					]
				},
				
				options: {

					responsive: true,
					
					title: {
						display: false,
						text: '理财师业绩'
					},
					 tooltips: {
						enabled: true,
						mode: 'nearest',
						intersect: false,
						callbacks: {
							// Use the footer callback to display the sum of the items showing in the tooltip
							footer: function(tooltipItems, data) {
								var sum = 0;
								tooltipItems.forEach(function(tooltipItem) {
									sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
								});
								return '年化业绩: ' + sum;
							},
							label:function(){
								return ""
							},
							title:function(tooltipItems, data){
								var day = new Date(_this.label[tooltipItems[0].index])
								var weekStart;
								if(tooltipItems[0].index==0){
									weekStart=new Date(day-5*24*60*60*1000)
								}else{
									var weekday=new Date(_this.label[tooltipItems[0].index-1])
									weekday.setDate(weekday.getDate()+1)
									weekStart=new Date(weekday)
								}
								if(_this.type=="thisWeek"){
									return  _this.dealDate(weekStart.getMonth()+1)+"/"+_this.dealDate(weekStart.getDate())+"~"+_this.label[tooltipItems[0].index]
								}else{
									return _this.label[tooltipItems[0].index]
								}
								
							}
						},
						footerFontStyle: 'normal'
					},
					legend: {
						display:false
					},
					gridLines:{
						display:false
					},
						
					 scales: {
						
					   yAxes: [{
							ticks: {
								beginAtZero:true
							}
                        }
						],
						responsive: false,
						xAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					}
				}
			});
			
			}
        },
        mounted:function(){
			this.fomartData()
        },
        beforeMount:function(){

        },
		destroyed:function(){
			this.myChart.destroy();	
			alert(1)
		}
    }
</script>
