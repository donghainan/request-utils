import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from 'axios'
import {
	handleConfigureAuth,
	handleRequestHeader,
	handleAuthError,
	handleGeneralError,
	handleNetworkError,
} from './tools'
import { APIResponse } from './types'
// 加载loading
import { showLoading, hideLoading } from './globalLoading'

// 缓存请求
let requestPadding: any[] = []
// 取消重复请求
const CancelToken = axios.CancelToken
const removePending = (config: AxiosRequestConfig) => {
	for (const p in requestPadding) {
		if (
			requestPadding[p].u ===
			config.url + JSON.stringify(config.data) + '&' + config.method
		) {
			requestPadding[p].f()
			requestPadding.splice(Number(p), 1)
		}
	}
}

//创建axios实例
export const instance: AxiosInstance = axios.create({
	baseURL: '/',
	timeout: 15000,
})

/**
 * 请求拦截器：处理鉴权和配置请求相关参数
 */
instance.interceptors.request.use(
	(
		config: InternalAxiosRequestConfig<any>
	): InternalAxiosRequestConfig<any> => {
		showLoading()
		removePending(config)
		config.cancelToken = new CancelToken((c) => {
			requestPadding.push({
				u: config.url + JSON.stringify(config.data) + '&' + config.method,
				f: c,
			})
		})
		// 处理公共头部携带信息
		config = handleRequestHeader(config)
		// 处理鉴权相关
		config = handleConfigureAuth(config)
		return config
	}
)

/**
 * 响应拦截器：处理请求响应数据和错误处理
 */
instance.interceptors.response.use(
	(
		response: APIResponse.Response<any>
	): APIResponse.Response<any> | Promise<APIResponse.Response<any>> => {
		hideLoading()
		removePending(response.config)
		// 网络型错误
		if (response.status !== 200) {
			return Promise.reject(response.data)
		}
		// 鉴权型错误处理
		handleAuthError(response.data.code)
		handleGeneralError(response.data.code, response.data.msg)
		return response
	},
	(err) => {
		hideLoading()
		// 处理请求网络错误
		handleNetworkError(err.response?.status)
		Promise.reject(err.response)
	}
)

/**
 * Get请求封装
 * @param url: 请求地址
 * @param params: 请求参数query上
 * @param data: 请求参数body里
 * @param clearFn: 请求数据处理函数
 * @returns
 */
//  AxiosRequestConfig
interface InstanceAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
	clearFn?: Function
}
export const Get = <R, S>({
	url = '',
	params,
	data,
	clearFn,
}: InstanceAxiosRequestConfig<R>): Promise<
	[any, APIResponse.Response<S> | undefined]
> => {
	return new Promise((resolve) => {
		instance
			.get(url, { params, data })
			.then((result) => {
				let res: APIResponse.Response<any>
				if (clearFn) {
					res = clearFn(result?.data) as unknown as APIResponse.Response<S>
				} else {
					res = result?.data as APIResponse.Response<S>
				}
				if (result?.data?.code !== 200) {
					// 抛出业务错误页面中处理
					resolve([res as APIResponse.Response<S>, undefined])
					return
				}
				resolve([null, res as APIResponse.Response<S>])
			})
			.catch((err) => {
				resolve([err, undefined])
			})
	})
}

/**
 * Post请求封装
 * @param url: 请求地址
 * @param data: 请求参数body里
 * @param params: 请求参数query上
 * @param clearFn: 请求数据处理函数
 * @returns
 */
export const Post = <R, S>({
	url = '',
	data,
	params,
	clearFn,
}: InstanceAxiosRequestConfig<R>): Promise<
	[any, APIResponse.Response<S> | undefined]
> => {
	return new Promise((resolve) => {
		instance
			.post(url, data, { params })
			.then((result) => {
				let res: APIResponse.Response<any>
				if (clearFn) {
					res = clearFn(result.data) as unknown as APIResponse.Response<S>
				} else {
					res = result.data as APIResponse.Response<S>
				}
				resolve([null, res as APIResponse.Response<S>])
			})
			.catch((err) => {
				resolve([err, undefined])
			})
	})
}
