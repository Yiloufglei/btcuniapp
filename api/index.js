
/**
 * api接口的统一出口
 */
import request from '@/utils/request'; // 导入http中创建的request实例

const httpList = {
    //新闻数据
    getNewsList (query){
        return request('GET', `/core/api/news/list`, query)
    },
	// 获取tv历史数据
	getTvHistoryList (query){
		return request('GET', `/trade/quotations/kline/BTCUSDT/H1/1603519498/1608703498`, query)
	},
	// 账号注册
	userRegister (query){
		return request('post', '/admin/member/signUp', query)
	},
	// 预登录
	preLogin (query){
		return request('post', `/auth/token/preLogin`, query)
	},
	// 个人信息
	userDetails (query){
		return request('get', '/admin/user/info', query)
	},
	// 账号注销
	loginOut (query){
		return request('delete', '/auth/token/logout', query)
	},
	// 修改密码 用于判断有哪些安全验证
	changePasswordaAuthenticationSafe (query){
		return request('GET', `/admin/member/secret/bindAuthentication/${query.username}`, query)
	},
	// 找回密码提交
	changePasswordaRetrievePassword (query){
		return request('post', `/admin/member/retrievePassword`, query)
	},
	// 发送不同类型的验证码  type取值: SMS, EMAIL, GOOGLE_AUTH
	sendVerifyCode (query){
		return request('post', `/admin/member/secret/sendVerifyCode/${query.username}/${query.type}/${query.value}`, query)
	},
	// 校验验证码 (单个)
	checkVerifyOnlyCode (query){
		return request('get', `/admin/member/secret/checkVerifyCode/${query.username}/${query.type}/${query.code}/${query.value}`, query)
	},
	// 实际的绑定或修改
	authenticationSafe (query){
		return request('post', `/admin/member/secret/bindAuthentication/${query.type}/${query.value}`, query)
	},
	//获取密钥
	createGoogleSecret (query){
		return request('post', `/admin/member/secret/create/googleSecret`, query)
	},
	// 设置重置支付密码
	newSetPaymentPassword (query){
		return request('post', `/admin/member/setPaymentPassword`, query)
	},
	// 支付密码校验
	paymentPasswordVerification (query){
		return request('get', `/admin/member/paymentPasswordVerification/${query}`, {})
	},
	// 修改支付密码状态
	switchPaymentPasswordSwitchModification (query){
		return request('get', `/admin/member/paymentPasswordSwitchModification/${query}`, {})
	},
	// 新版重置密码
	newChangePassword (query){
		return request('post', '/admin/member/changePassword', query)
	},
	// 开启安全认证
	openAuthentication (query){
		return request('post', `/admin/member/secret/openAuthentication/${query.type}`, query)
	},
	// 关闭安全认证
	closeAuthentication (query){
		return request('post', `/admin/member/secret/closeAuthentication/${query.type}`, query)
	},
	// 修改用户头像
	userEdit (query){
		return request('put', '/admin/user/edit', query)
	},
}
export default httpList;