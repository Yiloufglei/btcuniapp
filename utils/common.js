/* 
    公用方法
*/
const prefix = 'BTCpro-'
const isProduction = process.env.NODE_ENV === 'production'
import store from '@/store/index'
import http from '@/api/index'
const current = {
	setthemeColor(themeColor) {
	    //更改主题
	    store.commit('setthemeColor', themeColor)
	    uni.setStorageSync('colorTheme', themeColor)
	},
	setLanguage(language) {
	    //更改主题
	    store.commit('setLanguage', language)
	    uni.setStorageSync('language', language)
	},
	setNaviBarColor(){
		let themeColor = uni.getStorageSync('colorTheme') || "black";
		if(themeColor == 'black'){
			uni.setNavigationBarColor({
				frontColor: "#ffffff",	//文字颜色
				backgroundColor: "#007AFF"	//底部背景色
			})
		}else{
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#007AFF"	//底部背景色
			})
		}
	},
    nextlogin() {
		uni.removeStorageSync("token");
		uni.removeStorageSync("username");
		store.commit('setjudgeSignIn', false)
		store.commit("setuserInfo", {});
    },
	//存储在本地缓存指定的name中
	setCache(name, data) {
		let username = this.getCache('username')
		let nameIndex = name
		if(username){
			nameIndex = `${username}-${name}`
		}
		try {
			uni.setStorageSync(name, data);
		} catch (e) {
			console.log(e)
		}
	},
	//从本地缓存中读取置顶name对应的内容
	getCache(name) {
		let data;
		let username = uni.getStorageSync('username')
		let nameIndex = name
		if(username){
			nameIndex = `${username}-${name}`
		}
		try {
			data = uni.getStorageSync(name);
		} catch (e) {
			console.log(e);
		}
		return data;
	},
	//从本地缓存中移出指定key
	removeCache(name) {
		let username = this.getCache('username')
		let nameIndex = name
		if(username){
			nameIndex = `${username}-${name}`
		}
		try {
			uni.removeStorageSync(name);
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}
	},
	//返回一个布尔值,表示name是否在本地缓存之中
	checkCache(name) {
		let username = this.getCache('username')
		let nameIndex = name
		if(username){
			nameIndex = `${username}-${name}`
		}
		let value;
		try {
			const res = uni.getStorageInfoSync()
			value = res.keys.includes(name)
		} catch (e) {
			console.log(e)
		}
		return value
	},
	//清除本地数据缓存
	clearCache(){
		try{
			uni.clearStorageSync();
		}catch(e){
			console.log(e)
		}
	},
	substrHandle(data) {
		return data.substr(0, 3) + '****' + data.substr(-4)
	},
}
export default current