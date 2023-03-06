import { encrypt } from './sign'
import { InternalAxiosRequestConfig } from 'axios'

//  公共头部携带信息处理
export const handleRequestHeader = (
	config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig<any> => {
	// GE请求增加时间戳，去除请求缓存
	if (config.method?.toLocaleUpperCase() === 'GET') {
		const _t = new Date().toString()
		config.url += `?_t=${Date.parse(_t) / 1000}&`
	}
	// 设置加密
	if (config.headers?.jwt) {
		config.data = config?.data ? encrypt(config.data) : config.data
		config.params = config?.params ? encrypt(config.params) : config.params
	}
	return config
}

//  鉴权相关处理
export const handleConfigureAuth = (
	config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig<any> => {
  // 设置请求token
	config.headers.Authorization = 'x12333333'
	config.headers.projectNo = 'SHQX002'
	return config
}

// 响应鉴权错误
export const handleAuthError = (errorNo: number) => {
	const errorMapAuth: Record<string, string> = {
		1001: '登录失效，需要重新登录',
	}
	if (errorMapAuth.hasOwnProperty(errorNo)) {
		// 提示错误
		showToast(errorMapAuth[errorNo])
		// 退出登录
		// logout()
		// 清空缓存
		// 跳转登录页
		return false
	}
	return true
}

// 自定义业务错误处理
export const handleGeneralError = (errorNo: number, errorMsg?: string) => {
	if (errorNo !== 200) {
		// 提示错误信息
		errorMsg && showToast(errorMsg)
		return false
	}
	return true
}

// 处理网络请求错误
export const handleNetworkError = (errorNo: number) => {
	let errorMsg = '未知错误'
	if (errorNo) {
		switch (errorNo) {
			case 400:
				errorMsg = '错误的请求'
				break
			case 401:
				errorMsg = '未授权，请重新登录'
				break
			case 403:
				errorMsg = '拒绝访问'
				break
			case 404:
				errorMsg = '请求错误,未找到该资源'
				break
			case 405:
				errorMsg = '请求方法未允许'
				break
			case 408:
				errorMsg = '请求超时'
				break
			case 500:
				errorMsg = '服务器端出错'
				break
			case 501:
				errorMsg = '网络未实现'
				break
			case 502:
				errorMsg = '网络错误'
				break
			case 503:
				errorMsg = '服务不可用'
				break
			case 504:
				errorMsg = '网络超时'
				break
			case 505:
				errorMsg = 'http版本不支持该请求'
				break
			default:
				errorMsg = `其他连接错误 --${errorNo}`
		}
	} else {
		errorMsg = '无法连接服务器'
	}
	// 提示错误
	showToast(errorMsg)
}

// 错误提示
const showToast = (errorMsg: string) => {
	console.log(`%c${errorMsg}`, 'color: red;font-size:20px')
}
