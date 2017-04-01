<template>
	<div class="cc f_0 dp_b prl_10 pr c_999" :data-del="item.isBeDelete" v-bind:class="{'personal':item.teamNum==0&&!item.isBeDelete,'grayscale':item.isBeDelete}"
		ref="alone">
		<div @click="goToUrl(item.teamNum,item.memberId,item.isBeDelete)">
			<div class="dp_ib w_20 c_999 f_12 t_c">
				<span class="dp_ib noun" v-if="index < 3" v-bind:class="'noun'+index"></span>
				<span v-else>{{index+1}}</span>
			</div>
			<div class="personal w_55">
				<i v-if="item.avatar" class="team-img dp_ib" v-bind:style="'background-image:url(https://bxwd-img.oss-cn-hangzhou.aliyuncs.com/'+item.avatar+');'"></i>
				<i v-else class="team-img defaultHead dp_ib "></i>
				<div class="personal-name ml_8">
					<p class="pr c_666 lh_18" v-bind:class="{'c_999':item.isBeDelete}"><span ref='name' :data-name="item.realName" class="realname ellipsis" v-bind:class="{'w_100':item.teamNum==0}">{{item.realName | realName}}</span>
						<i class="tips-team" v-if="item.teamNum>0">团队</i>
					</p>
					<p class="f_10 lh15">
						<template  v-if="item.teamNum>0">
							<span>{{item.teamNum}}人</span><span v-if="item.isBeDelete" class="fz_12 ml_10">已移除</span>
						</template>
						<template v-else>
							<span v-if="item.isBeDelete" class="fz_12">已移除</span>
							<span v-else>{{item.mobile}}</span>
					</template>
					</p>
				</div>
			</div>
			<div class="dp_ib w_25 t_r f_10"><span>{{item.investMoneyYear | formatMoney}}</span>元</div>
		</div>
		<button class="btn-del" ref="del" :data-index="index" :data-userid="item.memberId">移除</button>
	</div>
</template>

<script>
	export default {
		props: ['item', 'index', 'last'],
		data: function () {
			return {
				han: ""
			}
		},
		watch: {
			// 如果 question 发生改变，这个函数就会运行
			item: function () {
				var _this = this;
				setTimeout(function () {
					_this.delList();
				}, 1000)
			}
		},
		methods: {
			getDom: function (dom) {
				//寻找父级dom，备用
				var el = dom;
				if (el.className.indexOf('personal') == -1) {
					do {
						el = el.parentNode;
						if (el.className.indexOf('personal') != -1) {
							break;
						}
					} while (true);
					return el
				}
				return el
			},
			goToUrl: function (isTeam, userId,isDel) {
					
				var lastId = this.last ? this.last : userId;
				//切换路由
				if (isTeam > 0) {
					/*团队*/
					if(!isDel){
						//是团队，已删除不能跳转
	 					this.$router.push("/team/"+userId+"?last="+lastId)
					}
					// Public.PushNextPage(this.$router, "/team/" + userId + "?last=" + lastId)
				} else {
					/*个人*/
					if((!this.$route.params.id)&&userId==this.$parent.teamList.investMemberId){
						//本人跳转
						this.$router.push("/sales/");
					}else{
						this.$router.push("/sales/" + userId);
					}
					
					// Public.PushNextPage(this.$router,"/sales/"+userId)
				}
			},
			delList: function () {
				/*滑动*/
				var _this = this;
				var container;
				container = _this.$refs.alone;
				_this.han = Hammer(container, {
					preventDefault: true,
					gesture: true
				})
				if (_this.$refs.alone.className.indexOf('personal') != -1) {
					_this.han.on("swipeleft", function (event) {
						$('.personal').each(function () {
							$(this).removeClass('on')
						})

						//左滑
						if (container.classList) {
							if(!_this.$refs.alone.getAttribute('data-del')){
								container.classList.add('on');
							}
							
						} else {
							container.className += ' ' + 'on';
						}
					});
					_this.han.on("swiperight", function (event) {
						//右滑
						if (container.classList) {
							container.classList.remove('on');
						}
						else {
							container.className = container.className.replace('on', '');
						}
					});
				} else {

				}
				/*删除*/
				_this.$refs.del.addEventListener("click", function () {

					var index = _this.$refs.del.getAttribute('data-index');
					var userid = _this.$refs.del.getAttribute('data-userid');
					var name = _this.$refs.name.getAttribute('data-name');
					name = name == null ? '未实名' : name;
					_this.$layer.dialog({
						content: '要移除成员:' + name + ' ?',
						btn: ['取消', '确认']
					}).then(function (res) {
						if (res) {
							//确认
							Public.API_GET({
								url: 'removeTeamMember',
								data: { investMemberId: _this.$parent.userID, beDeleteMemberId: userid },
								success: function (result) {
									if (result.isSuccess) {
										_this.$layer.toast('成员移除成功！');
										_this.$parent.list.annualRanks[index].isBeDelete = true;
										_this.han.off('swipeleft', function () { });
									} else {
										_this.$refs.alone.classList.remove('on');
										_this.$layer.toast(result.message);

									}
								}
							});
						} else {
							//取消
							$('.personal').each(function () {
								$(this).removeClass('on')
							})
						}
					})

				})

			}
		},
		mounted: function () {
			var _this = this;
			this.delList();

		},
		beforeMount: function () {
		}
	}
</script>