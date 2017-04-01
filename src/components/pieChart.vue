<template>
    
	<div id="pie-box"></div>
	
</template>

<script>
	
    export default{
    	props: ['width','height','cycle'],
        data:function() {
            return {	
				perDeg:0.1,
				animation:500
            }
        },
		 watch: {
			// 如果 question 发生改变，这个函数就会运行
			cycle: function () {
			  this.darw()
			}
		},
        methods:{
			darw:function(){
				document.getElementById("pie-box").innerHTML=""
				var canvas = document.createElement('canvas'); 
				var hw=this.width/2;
				var hh=this.height/2;
				var r=this.height/2*0.9;
				var cxt=canvas.getContext("2d");
				//去除锯齿
				if (window.devicePixelRatio) {
					canvas.style.width = this.width + "px";
					canvas.style.height = this.height + "px";
					canvas.height = this.height * window.devicePixelRatio;
					canvas.width = this.width * window.devicePixelRatio;
					cxt.scale(window.devicePixelRatio, window.devicePixelRatio);
				}
				cxt.strokeStyle="#ededed";
				cxt.beginPath();
				cxt.lineWidth = 6; 
				cxt.arc(hw,hw,r,0,Math.PI*2);
				cxt.closePath();
				cxt.stroke();
				cxt.strokeStyle="#36A2EB";
				this.darwCycle(cxt,this.cycle);
				cxt.font = "20px 微软雅黑";
				cxt.fillStyle="#000";
				cxt.textBaseline = 'middle';//设置文本的垂直对齐方式
				cxt.textAlign = 'center'; //设置文本的水平对对齐方式
				cxt.fillText(this.cycle+"%", hw,hw);
				document.getElementById("pie-box"). appendChild(canvas);
			},
			darwCycle:function(cxt,deg){
				//画圈动画
				var nowDeg=0.1
				var hw=this.width/2;
				var hh=this.height/2;
				var r=this.height/2*0.9;
				var time=this.animation/(deg/this.perDeg)
				var interval=window.setInterval(()=>{
					if(nowDeg>deg){
						clearInterval(interval)
						return
					}		
					cxt.beginPath();
					cxt.arc(hw,hw,r,1.5*Math.PI,this.changeCycle(nowDeg));
					cxt.lineWidth = 10; 
					cxt.stroke();
					nowDeg+=this.perDeg;
				},time)	
			},
			changeCycle:function(num){
				if(num<100){
					return 1.5*Math.PI,(Math.PI*(2*num/100-0.5))
				}else if(num==100){
					return -0.5*Math.PI
				}
				
			}
        },
        mounted:function(){
			
			this.darw()
        },
        beforeMount:function(){

        }
    }
</script>
