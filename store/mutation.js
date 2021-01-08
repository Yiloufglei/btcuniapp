export default {
	//期权合约状态
	switchTypeView(state, data) {
	    state.typeView = data
	},
	switchTabIndex(state, data) {
	    state.tabIndex = data
	},
	//当前主题
	setthemeColor(state, data) {
	    state.themeColor = data
	},
	setLanguage(state, data) {
	    state.language = data
	},
	setuserInfo(state, data) {
	    state.userInfo = data
	},
	setjudgeSignIn(state, data) {
	    state.judgeSignIn = data
	},
	setSecurity(state, data) {
	    state.security = data
	},
}
