<template>
    <div><div id="wrapper">
        <div id="scroller">
            <div id="pullDown">
                <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
            </div>
            <div class="news-lists" id="news-lists">
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
                <div class="item">根据市场奖惩制度，结合市场各部门提供的数据</div>
            </div>
            <div id="pullUp">
                <span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>
            </div>
        </div>
    </div>
        </div>
</template>

<script>
    import IScroll from '../js/iscroll-probe'
    export default{
        data:function() {
            return {
                "persion":sessionStorage.getItem("persion")||"未取到 sessionStorage persion"
            }
        },
        methods:{
        },

        created:function(){
        },
        ready:function(){
            var data,
                    myScroll,
                    pullDownEl, pullDownOffset,
                    pullUpEl, pullUpOffset,
                    generatedCount = 0;

            function pullDownAction () {
              console.log("pullDownAction")
            }

            function pullUpAction () {
                console.log("pullUpAction")
            }

            //初始化绑定iScroll控件
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            function loaded() {
                pullDownEl = document.getElementById('pullDown');
                pullDownOffset = pullDownEl.offsetHeight;
                pullUpEl = document.getElementById('pullUp');
                pullUpOffset = pullUpEl.offsetHeight;

                /**
                 * 初始化iScroll控件
                 */
                myScroll = new IScroll('wrapper', {
                    vScrollbar : false,
                    topOffset : pullDownOffset,
                    onRefresh : function () {
                        if (pullDownEl.className.match('loading')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                        } else if (pullUpEl.className.match('loading')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'flip';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                            this.minScrollY = 0;
                        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'flip';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                        }
                    },
                    onScrollEnd: function () {
                        if (pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'loading';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                            pullDownAction();
                        } else if (pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'loading';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                            pullUpAction();
                        }
                    }
                });
            }
            loaded()
        }
    }
</script>
