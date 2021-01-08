<template>
	<view class="contractChart">
		<view :option="option" :change:option="echarts.updateEcharts" id="echarts"></view>
	</view>
</template>
<!-- 页面层 -->
<script>
	export default {
		data() {
			return {
				option: {},
				datas: [],
				times: [],
				vols: [],
				historyList: [],
				upColor: '#4cb582',
				downColor: '#c53c59',
				stompClient: null,
				// 确保websocket是打开状态
				is_open_socket: false
			};
		},
		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		beforeDestroy() {
			this.closeSocket();
		},
		mounted() {
			this.init()
			// this.connectSocketInit()
		},
		methods: {
			disconnect() {
				if (this.stompClient) {
					this.stompClient.disconnect();
					this.stompClient = null
				}
			},
			connectSocket() {
				// websocket订阅
				this.currentSubscribeClient = this.stompClient.subscribe(
					`/pic/contract/kline/${this.symbol}/${this.intervalAjax}`,
					res => {
						if (res.body) {
							let ajaxData = JSON.parse(res.body)
							console.log(ajaxData,'ajaxData')
						}
					}
				);
				
			},
			// connectSocketInit() {
			// 	// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
			// 	this.socketTask = uni.connectSocket({
			// 		// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
			// 		url:"wss://stream.yshyqxx.com/stream",
			// 		success(data) {
			// 			console.log("websocket连接成功");
			// 		},
			// 	});
			// 	let obj = JSON.stringify({id: 255,method: "SUBSCRIBE",params: ["tctusdt@kline_1h"],0: "tctusdt@kline_1h"})
			// 	// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
			// 	this.socketTask.onOpen((res) => {
			// 		console.log("WebSocket连接正常打开中...！");
			// 		this.is_open_socket = true;
			// 		// 注：只有连接正常打开中 ，才能正常成功发送消息
			// 		this.socketTask.send({
			// 			data: obj,
			// 			async success() {
			// 				console.log("消息发送成功");
			// 			},
			// 		});
			// 		// 注：只有连接正常打开中 ，才能正常收到消息
			// 		this.socketTask.onMessage((evt) => {
			// 			console.log(JSON.parse(evt.data),'result')
						
			// 		});
			// 	})
			// 	// 这里仅是事件监听【如果socket关闭了会执行】
			// 	this.socketTask.onClose(() => {
			// 		console.log("已经被关闭了")
			// 	})
			// },
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				if(this.socketTask){
					this.socketTask.close({
						success(res) {
							this.is_open_socket = false;
							console.log("关闭成功", res)
						},
						fail(err) {
							console.log("关闭失败", err)
						}
					})
				}
			},
			getTvHistoryList() {
				return new Promise((resolve, reject) => {
					this.$api.getTvHistoryList().then(res => {
						let data = res && res.data.data || []
						data = data.sort(function(a, b) {
							return a.time - b.time
						})
						resolve(data)
					})
				})
			},
			async init() {
				let params = {
					from: 1603518870,
					market: "Huobi Global",
					period: "60min",
					symbol: "btcusdt",
					to: 1608702870
				}
				this.historyList = await this.getTvHistoryList()
				this.historyList.forEach((item, index) => {
					this.datas.push([item.close, item.open, item.high, item.low])
					this.times.push(this.formatDateTime(item.time * 1000))
					this.vols.push(item.volume)
				})
				this.option = this.optionPlate()
			},
			optionPlate() {
				return {
					backgroundColor: 'transparent',
					title: {
						show: false
					},
					legend: {
						show: false
					},
					visualMap: {
						show: false,
						seriesIndex: 4,
						dimension: 2,
						pieces: [{
							value: 1,
							color: this.downColor
						}, {
							value: -1,
							color: this.upColor
						}]
					},
					tooltip: {
						show: true, //是否显示提示框组件，包括提示框浮层和 axisPointer。
						trigger: 'axis', //触发类型。item,axis,none
						triggerOn: 'mousemove|click', //提示框触发的条件 'mousemove','click','mousemove|click','none'
						textStyle: {
							fontSize: 10
						}, //提示框浮层的文本样式
						backgroundColor: 'rgba(30,42,66,0.8);', //提示框浮层的背景颜色。
						borderColor: '#2f3a56', //提示框浮层的边框颜色。
						borderWidth: 2,
						position: function(pos, params, el, elRect, size) { //提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。
							var obj = {
								top: 20
							};
							obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 10;
							return obj;
						},
						axisPointer: { //坐标轴指示器配置项。
							label: {
								color: 'rgba(255,255,255,.87)',
								fontSize: 9,
								backgroundColor: '#020204',
								borderColor: "#9c9fa4",
								shadowBlur: 0,
								borderWidth: 0.5,
								padding: [4, 2, 3, 2],
							},
							animation: false,
							type: 'cross',
							lineStyle: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: 'rgba(30, 42, 66, 0.1)' // 0% 处的颜色
									}, {
										offset: 0.7,
										color: 'rgba(30, 42, 66,0.9)' // 100% 处的颜色
									}, {
										offset: 1,
										color: 'rgba(30, 42, 66,0.2)' // 100% 处的颜色
									}]
								},
								width: 10,
								shadowColor: 'rgba(30, 42, 66,0.7)',
								shadowBlur: 0,
								shadowOffsetY: 68,
							}
						}
					},
					xAxis: [{
						type: 'category', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
						data: this.times, //类目数据，在类目轴（type: 'category'）中有效。
						scale: true,
						// boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
						axisLine: {
							show: false
						}, //坐标轴轴线相关设置
						axisTick: {
							show: false
						}, //坐标轴刻度相关设置。
						axisLabel: {
							show: false,
						}, //坐标轴刻度标签的相关设置。
						splitLine: {
							show: false,
							lineStyle: {
								color: 'rgba(255,255,255, 0.1)'
							}
						}, //坐标轴在 grid 区域中的分隔线。
						min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
						max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
						axisPointer: {
							label: {
								margin: 200
							}
						},
					}, {
						type: 'category',
						gridIndex: 1, //x 轴所在的 grid 的索引，默认位于第一个 grid。
						data: this.times, //类目数据，在类目轴（type: 'category'）中有效。
						scale: true,
						// boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
						axisLine: {
							show: false,
							lineStyle: {
								color: 'rgba(255,255,255,1)',
								width: 1
							}
						}, //坐标轴轴线相关设置
						axisTick: {
							show: false
						}, //坐标轴刻度相关设置。
						axisLabel: { //坐标轴刻度标签的相关设置。
							show: true,
							margin: 6,
							fontSize: 10,
							color: 'rgba(99, 117, 139, 1.0)',
							// formatter: function(value) {
							// 	return this.formatDateTime(value);
							// }
						},
						splitNumber: 20,
						splitLine: {
							show: false,
							lineStyle: {
								color: 'rgba(255,255,255, 0.1)'
							}
						}, //坐标轴在 grid 区域中的分隔线。
						min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
						max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
						// axisPointer: { show: true, type: 'none', label: { show: false }},
					}],
					yAxis: [{
						type: 'value', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
						position: 'right', //y 轴的位置。'left','right'
						scale: true, //是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。在双数值轴的散点图中比较有用。(在设置 min 和 max 之后该配置项无效。)
						axisLine: {
							show: true,
							lineStyle: {
								color: "#E7EBEE"
							}
						}, //坐标轴轴线相关设置。
						axisTick: {
							show: false,
							inside: true
						}, //坐标轴刻度相关设置。
						axisLabel: { //坐标轴刻度标签的相关设置。
							show: true,
							color: 'rgba(99, 117, 139, 1.0)',
							fontSize: 10,
							formatter: function(value) {
								return Number(value).toFixed(2)
							}
						},
						splitLine: {
							show: false,
						}, //坐标轴在 grid 区域中的分隔线。
					}, {
						type: 'value',
						position: 'right',
						scale: true,
						gridIndex: 1,
						axisLine: {
							show: true,
							lineStyle: {
								color: "#E7EBEE"
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: false
						},
						splitLine: {
							show: false
						}
					}],
					animation: false, //是否开启动画。
					dataZoom: [{ //用于区域缩放
						type: 'inside',
						xAxisIndex: [0, 1],
						realtime: true,
						moveOnMouseWheel: true,
						preventDefaultMouseMove: true,
						start: 98,
						end: 100,
					}],
					axisPointer: { //坐标轴指示器配置项
						link: {
							xAxisIndex: 'all'
						},
						label: {
							backgroundColor: '#0d1723',
							color: '#fff',
							borderColor: 'rgb(99, 117, 139)',
							borderWidth: 1,
							borderRadius: 2,
							fontSize: 10
						}
					},
					series: [{
							type: 'candlestick',
							data: this.datas,
							itemStyle: {
								color: this.upColor,
								color0: this.downColor,
								borderColor: this.upColor,
								borderColor0: this.downColor
							},
							markPoint: {
								symbol: 'rect',
								symbolSize: [-10, 0.5],
								symbolOffset: [5, 0],
								itemStyle: {
									color: 'rgba(255,255,255,.87)'
								},
								label: {
									color: 'rgba(255,255,255,.87)',
									offset: [10, 0],
									fontSize: 10,
									align: 'left',
									formatter: function(params) {
										return Number(params.value).toFixed(2)
									}
								},
								data: [{
										name: 'max',
										type: 'max',
										valueDim: 'highest'
									},
									{
										name: 'min',
										type: 'min',
										valueDim: 'lowest'
									}
								]
							},
						},

						{
							name: 'Volume',
							type: 'bar',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: this.vols,
							"itemStyle": {
								"normal": {
									// #ifdef APP-PLUS
									"color": "#0066ED"
									// #endif
									// #ifdef H5
									"color": (params) => {
										var colorList;
										if (this.datas[params.dataIndex][1] > this.datas[params.dataIndex][0]) {
											colorList = this.upColor;
										} else {
											colorList = this.downColor;
										}
										return colorList;
									},
									// #endif
								}
							}
						},
					],
					grid: [{
							top: '1%',
							left: 0,
							right: '70',
							height: '85%'
						},
						{
							top: '85%',
							left: 0,
							right: '70',
							height: '10%'
						},
					],
				}
			},
			formatDateTime(inputTime, symbol = '-') {
				let date = new Date(inputTime);
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let minute = date.getMinutes();
				let second = date.getSeconds();
				minute = minute < 10 ? ('0' + minute) : minute;
				second = second < 10 ? ('0' + second) : second;
				return y + symbol + m + symbol + d
				// return y + symbol + m + symbol + d + ' ' + h + ':' + minute + ':' + second;
			},
			// 触发逻辑层出入renderjs数据改变
			testClick() {
				alert(1)
			},
			// 接收renderjs发回的数据
			receiveRenderData(val) {
				console.log('receiveRenderData-->', val);
			}
		}
	};
</script>
<!-- 视图层 -->
<script module="echarts" lang="renderjs">
	let myChart
	export default {
		data() {
			return {};
		},
		components: {},
		mounted() {
			if (typeof window.echarts === 'function') {
				this.initEcharts()
			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/echarts.min.js'
				script.onload = this.initEcharts.bind(this)
				document.head.appendChild(script)
			}

		},
		methods: {
			formatterNum(inputTime, symbol = '-') {
				let date = new Date(inputTime);
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				return y + symbol + m + symbol + d
			},
			initEcharts() {
				myChart = echarts.init(document.getElementById('echarts'))
				// 观测更新的数据在 view 层可以直接访问到
			},
			onClick(event, ownerInstance) {
				// 调用 service 层的方法

			},
			// // 发送数据到逻辑层
			// emitData(e, ownerVm) {
			// 	ownerVm.callMethod('receiveRenderData', this.name)
			// },
			updateEcharts(newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
				newValue.tooltip.formatter = (params) => {
						let tooltip = '';
						let time = '',
							open = 0,
							high = 0,
							low = 0,
							close = 0,
							amount = 0;
						for (var i = 0; i < params.length; i++) {
							if (params[i].seriesName == 'Volume') {
								amount = params[i].data
							} else {
								time = this.formatterNum(params[i].name);
								open = params[i].data.length > 1 ? Number(params[i].data[1]) : 0;
								close = params[i].data.length > 1 ? Number(params[i].data[0]) : 0;
								low = params[i].data.length > 1 ? Number(params[i].data[3]) : 0;
								high = params[i].data.length > 1 ? Number(params[i].data[2]) : 0;
							}
							tooltip = '<div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'时间' + '</div><div class="ctr-value">' + time + '</div></div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'开' + '</div><div class="ctr-value">' + open + '</div></div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'高' + '</div><div class="ctr-value">' + high + '</div></div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'低' + '</div><div class="ctr-value">' + low + '</div></div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'收' + '</div><div class="ctr-value">' + close + '</div></div>' +
								'<div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 5px 0;"><div style="color: #0066ED;width:30px;">' +
								'数量' + '</div><div class="ctr-value">' + amount + '</div></div></div>';
						}
						return tooltip;
					},
					myChart.setOption(newValue)
				myChart.on('datazoom', function(params) {
					let num = params.batch[0]['start'];
					if (num == 0) {
						console.log('到最左边了')
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	.contractChart {
		#echarts {
			width: 100%;
			height: 100%;
		}
	}
</style>
