import Vue from 'vue'
import App from './App'
import store from './store'
import api from '@/api/index.js'
import common from '@/utils/common.js'
import VueI18n from 'vue-i18n'
import '@/js_sdk/ican-H5Api/ican-H5Api'
Vue.use(VueI18n);
const i18n = new VueI18n({ 
	locale: uni.getStorageSync('language') || 'zh', //初始化,保证刷新页面也保留
	messages: { 
		'zh': require('./common/lang/zh.js').lang,
		'en': require('./common/lang/en.js').lang
	}
})
Vue.prototype._i18n = i18n
Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.$common = common
Vue.config.productionTip = false
import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
App.mpType = 'app'

const app = new Vue({
	store,
	i18n,
    ...App
})
app.$mount()
