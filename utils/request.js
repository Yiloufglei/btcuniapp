import common from '@/utils/common'
let baseUrl = 'http://okbix-gateway:9999'
const request = (type = 'GET', url = '', date = {},  header = {}) => {
	if(process.env.NODE_ENV === 'development'){
		//测试环境 
	     baseUrl = 'http://120.79.168.4:9080'
	}else{
	     baseUrl = 'https://bitcasset.com'
	}
	return new Promise((resolve, reject) => {
		let headerObj =  header 
		const prefixToken = 'Bearer '
		const token = common.getCache('token')
		if(token){
			token && (headerObj['Authorization'] = `${prefixToken}${token}`)
			token && (headerObj['access_token'] = `${prefixToken}${token}`);
		}
		if(type.toLowerCase() != 'get'){
			headerObj['Content-Type'] = 'application/json'
		}
		uni.request({
			method: type,
			url: baseUrl + url,
			data: date,
			sslVerify:false,
			firstIpv4:true,
			header: headerObj,
			dataType: 'json',
			success: (res) => {
				resolve(res)
			},
			fail:(err) => {
				reject(err)
			},
			complete: (complete) => {  
				if(complete.statusCode == '401'){
					common.nextlogin()
				}
			}
		})
	});
}
export default request
