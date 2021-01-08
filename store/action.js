import api from '../api'
import common from "../utils/common.js"
export default {
	//获取个人信息
	getUserDetail({commit, state}, refreshStatus){
		return new Promise((resolve, reject) => {
			api.userDetails().then((res) => {
				if(!res.data.code){
					resolve(data)
					let data = res.data.data.sysUser || {}
					commit("setuserInfo", data);
					commit("setjudgeSignIn", true);
					let arr = [data.emailAuthStatus, data.phoneAuthStatus, data.googleAuthStatus]
					let resultList = arr.filter(v => v === 1)
					let type =  resultList.length >= 2
					commit("setSecurity", type);
				}
			})
		})
	},
	//推出登录
	loginOut ({commit}, vue){
		return new Promise((resolve, reject) => {
			api.loginOut().then(() => {
				common.nextlogin()
				resolve()
			})
		})
	}
}
