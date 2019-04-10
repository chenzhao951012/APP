<template>
	<view>
		<view class="picker-mask" @click="closePicker" catchtouchmove="true" v-show="pickerShow"></view>
		<view class="picker-content" :class="{'pickerShow':pickerShow}">
			<view class="picker-button">
				<text @click="closePicker">取消</text>
				<text @click="confirm">确定</text>
			</view>
			<!-- 单列选择 -->
			<picker-view class="picker-view" indicator-class="picker-view-selected-one" :value="oneIndex" @change="pickerViewChangeOne"
			 v-if="mode=='one'">
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>
			<!-- 双列选择-联动 -->
			<picker-view class="picker-view" indicator-class="picker-view-selected-two" :value="twoIndex" @change="pickerViewChangeTwo"
			 v-if="mode=='two_linkage'">
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList[twoIndex[0]].children" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>
			<!-- 双列选择-不联动 -->
			<picker-view class="picker-view" indicator-class="picker-view-selected-two" :value="twoIndex" @change="pickerViewChangeTwo"
			 v-if="mode=='two_nolinkage'">
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList.firstArray" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList.secondArray" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>
			<!-- 三列选择-联动 -->
			<picker-view class="picker-view" indicator-class="picker-view-selected-three" :value="threeIndex" @change="pickerViewChangeThree"
			 v-if="mode=='three'">
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList[threeIndex[0]].children" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-item" v-for="(item, index) in pickerList[threeIndex[0]].children[threeIndex[1]].children" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "wzp-picker",
		props: {
			// piker组件模式，默认单列
			mode: {
				type: String,
				default: "one"
			},
			// picker组件数组-适用于单列和双列
			pickerList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				oneIndex: [0], // 单列索引
				twoIndex: [0, 0], // 双列索引
				threeIndex: [0, 0, 0], // 三列索引
				pickerShow: false
			};
		},
		methods: {
			// 单列选项变化
			pickerViewChangeOne(e) {
				this.oneIndex = e.detail.value;
			},
			// 双列选项变化-包含联动和不联动
			pickerViewChangeTwo(e) {
				let changeValue = e.detail.value;
				if (this.mode == "two_linkage") {
					// 超规处理
					if (this.pickerList[changeValue[0]].children.length - 1 < changeValue[1]) {
						changeValue[1] = this.pickerList[changeValue[0]].children.length - 1;
					}
				}
				this.twoIndex = changeValue;
			},
			// 三列联动选项变化
			pickerViewChangeThree(e) {
				let changeValue = e.detail.value;
				// 超规处理
				if (this.pickerList[changeValue[0]].children.length - 1 < changeValue[1]) {
					changeValue[1] = this.pickerList[changeValue[0]].children.length - 1;
					if (this.pickerList[changeValue[0]].children[changeValue[1]].children.length - 1 < changeValue[2]) {
						changeValue[2] = this.pickerList[changeValue[0]].children[changeValue[1]].children.length - 1;
					}
				} else if (this.pickerList[changeValue[0]].children[changeValue[1]].children.length - 1 < changeValue[2]) {
					changeValue[2] = this.pickerList[changeValue[0]].children[changeValue[1]].children.length - 1;
				}
				this.threeIndex = changeValue;
			},
			// 显示组件
			showPicker() {
				this.pickerShow = true;
			},
			// 确定事件-返回选中项的数组索引
			confirm() {
				this.pickerShow = false;
				let value = [];
				if (this.mode == "one") {
					value = this.oneIndex;
				} else if (this.mode == "two_linkage" || this.mode == "two_nolinkage") {
					value = this.twoIndex;
				} else if (this.mode == "three") {
					value = this.threeIndex;
				}
				this.$emit("onConfirm", value);
			},
			// 隐藏组件
			closePicker() {
				this.pickerShow = false;
				this.$emit("onCancle");
			}
		}
	}
</script>

<style>
	.picker-mask {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.picker-content {
		flex-direction: column;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		height: 600upx;
		background-color: #FFFFFF;
		transform: translateY(100%);
		transition: all 200ms ease;
	}

	.pickerShow {
		transform: translateY(0) !important;
	}

	.picker-content .picker-button {
		justify-content: space-between;
		height: 80upx;
		line-height: 80upx;
		padding: 0 30upx;
	}

	.picker-button text {
		font-size: 28upx;
		font-weight: 500;
	}

	.picker-button text:first-child {
		color: #A1A1A1;
	}

	.picker-button text:last-child {
		color: #1AAD19;
	}

	.picker-content .picker-view {
		width: 100%;
		height: 500upx;
	}

	.picker-content .picker-view-selected-one,
	.picker-content .picker-view-selected-two,
	.picker-content .picker-view-selected-three {
		height: 100upx;
		line-height: 100upx;
		border-top: #1AAD19 1upx solid;
		border-bottom: #1AAD19 1upx solid;
	}

	.picker-content .picker-view-selected-one {
		position: relative;
		left: 25%;
		width: 50%;
	}

	.picker-content .picker-view-selected-two {
		position: relative;
		left: 15%;
		width: 70%;
	}

	.picker-content .picker-view-selected-three {
		position: relative;
		left: 5%;
		width: 90%;
	}

	.picker-view .picker-item {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		font-size: 28upx;
		font-weight: 600;
		display: block;
		text-align: center;
	}
</style>
