<template>
	<view class="boxa">
		<view class="top_kbox">
			<block v-for="(item,i) in newlist" :key="i">
				<view class="ibox" @tap="alertnum(i)">
					<text class="uni_14">{{item}}</text>
					<image v-if="i != i1" class="ii" src="/static/choose-Cadex.png" mode=""></image>
					<image v-else class="ii" src="/static/choose-Cades.png" mode=""></image>
				</view>
			</block>	
		</view>
		<view  :class="[show?'list_boxs2':'list_boxs']">
			<view class="lione">
				<block v-for="(item,i) in listchild" :key="i">
					<view class="mli" @tap="chooseOne(i)">
						<text :class="[i== i2?'actives':'']" class="uni_14">{{item}}</text>
						<image v-if="i == i2" class="ii i2" src="/static/choose-Cadecc.png" mode=""></image>
					</view>
				</block>
			</view>
			<view class="hideA" @tap="hide">
			</view>
		</view>
		<view  :class="[show2 ?'list_boxs3':'list_boxs4']" @click="hide2">
			<view class="lione2">
				<slot></slot>
			</view>
			<view class="hideA2" @hideA="hide2">
			</view>
				
		</view>
	</view>
</template>

<script>
	export default {
		props: ['list', 'arr'], //数组  arr
		data() {
			return {
				i1: null,
				i2: null,
				show: false,
				listchild: [],
				newlist: this.list,
				show2:false
			}
		},
		methods: {
	
			alertnum(i) {
				document.body.addEventListener('touchmove',bodyScroll,false);
				if(i<4){
					console.log(i)
					this.show2 =false;
					this.show =true;
					if (this.i1 != i) {
					this.listchild = [];
					this.i1 = i;
					this.listchild = this.arr[i];
					this.i2 = null;
					this.show =true;
					let ins = this.listchild.indexOf(this.newlist[i]);
					if (ins > -1) {
							this.i2 = ins
							console.log(ins)
						}
					}
				}else if(i===4){
					this.show2 =true;
					this.show =false;
				}

			},
			chooseOne(i) {
				this.i2 = i;
				// this.newlist[this.i1] = this.listchild[i];
				this.$emit('chooseLike', [this.i1, this.i2])
				this.show =false;
			},
			hide() {
				this.show = !this.show;
				this.show2 = false;
				document.body.removeEventListener('touchmove',bodyScroll,false);
			},
			hide2() {
				this.show = false;
				this.show2 = !this.show2;
				document.body.removeEventListener('touchmove',bodyScroll,false);
			},
		bodyScroll(event){
				event.preventDefault();
			}
			
			
			}
	
	}
</script>

<style scoped>

	.hideA {
		height: calc(100%);
	}
	.lione2{
		width:65%;
		padding: 0upx 0upx;
		box-sizing: border-box;;
		font-size: 28upx;
		color: #333333;
		min-height: 100%;
		background-color: #fff;
		/* height: 262upx; */
		border-radius:0 0 10upx 10upx;
		overflow: auto;
	}
	.mli {
		/* border: 1upx solid red; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 0;
		font-size: 28upx;
		color: #333333;
		box-sizing: border-box;
		border-bottom: 2upx solid #eeeeee;
		padding-top: 10upx;
	}

	.lione {
		background-color: #fff;
		/* height: 262upx; */
		padding: 0upx 30upx;
		box-sizing: border-box;;
		font-size: 28upx;
		color: #333333;
		max-height: 600upx;
		overflow-x: auto;
		border-radius:0 0 10upx 10upx;
	}

	.list_boxs {
		background-color: rgba(84, 80, 80, 0.48);
		position: fixed;
		height: calc(100%);
		width: 100%;
		z-index: 88;
		transition: all .2s;
		transform: translateY(-120%);
		font-size: 28upx;
		color: #333333;
	}
	.list_boxs2{
		background-color: rgba(84, 80, 80, 0.48);
		position: fixed;
		height: calc(100%);
		width: 100%;
		z-index: 88;
		transform: translateY(0);
		transition: all .2s;
		font-size: 28upx;
		color: #333333;
	}
.list_boxs4{
		background-color: rgba(84, 80, 80, 0.48);
		position: fixed;
		height: calc(100%);
		width: 100%;
		z-index: 88;
		transition: all .2s;
		transform: translateX(120%);
		font-size: 28upx;
		color: #333333;
		display: flex;
		justify-content: flex-end;
		
	}
	.list_boxs3{
		background-color: rgba(84, 80, 80, 0.48);
		position: fixed;
		height: calc(100%);
		width: 100%;
		z-index: 88;
		transform: translateX(0);
		transition: all .2s;
		font-size: 28upx;
		color: #333333;
		display: flex;
		justify-content: flex-end;
	}
	.ii {
		width: 20upx;
		height: 20upx;
		display: block;
		margin-left: 12upx;
		font-size: 28upx;
		color: #333333;
		font-weight:0;
	}
	.i2{
		width: 50upx;
		height: 50upx;
	}
	.actives {
		color: #ffc146;
		font-weight: 0;
		font-size: 28upx;
	}

	.ibox {
		display: flex;
		align-items: center;
	}
	.top_kbox {
		display: flex;
		justify-content: space-between;
		
		background-color: #FFFFFF;
		padding: 0upx 30upx;
		box-sizing: border-box;
		width: 100%;
		z-index: 99;
		/* #ifdef APP-PLUS */
		top: 0;
		/* #endif */
		padding-bottom: 20upx;
		
	}
	.boxa{
		
		position: relative;
		font-size: 28upx;
		color: #333333;
		font-weight: 0;
	}
</style>
