import Vue from 'vue'
import Vuex from 'vuex'
import actions from './action'
import mutations from './mutation'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		language:'zh',//中英文
		typeView:'contract',
		tabIndex:'personal',
		themeColor:'white',//主题颜色
		userInfo:{},
		judgeSignIn:false,//是否登录
		security:0,//绑定大于1
	},
	mutations,
	actions
})

export default store
