<template>
  <view class="sdr">
    <radio-group @change="radioChange" :name="name">
      <label :class="item.checked ?  'checkbox selectBox' : 'checkbox '" @click.stop="labelBtn(item.name,index)" v-for="(item,index) in labelList" :key="item.value" >
        <radio :value="item.value" :checked="item.checked" v-show="false"/>{{item.name}}
      </label>
    </radio-group>
  </view>
</template>

<script>
  export default {
		props:{
			labelList: {
				type:[Object,Array]
				
			},
			name:{
				type:String,
				default:'name'
			}
		},
    data() {
      return {
        labelName:'',
        labelDataList:0,
      };
    },
    methods:{
      labelBtn(name,index){
        this.$emit('chengd',(name,index))
        this.labelName = name
				for (let i in this.labelList) {
					this.labelList[i].checked = false;
				}
				this.labelList[index].checked = true
      },
      radioChange: function (e) {
        this.labelDataList = e.detail.value
        console.log(e)
       
      },
    }
  }
</script>

<style>
  .selectBox{
	font-size: 24upx;
		 border: 1px solid #ffc146 !important;
    color: #333333!important;
  }
  .checkbox{
    padding: 5px 10px;
    border: 1px solid #eeeeee;
    margin: 10px;
    border-radius: 10upx;
    color: #333333;
		box-sizing: border-box;
		font-size: 24upx;
		font-weight: 600;
  }
  .sdr{
	
			margin-top: 140upx;
		z-index: 300;
	background-color: #fff;
	display: flex;
	justify-content: space-around;
  }
</style>
