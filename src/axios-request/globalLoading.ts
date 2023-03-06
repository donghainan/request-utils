/**
 * 全局loading配置 （如使用加载进度条放开注释）
 */

import * as NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//记录加载请求数量
let loadingRequestCount = 0
// 显示加载
export const showLoading = () => {
	if (loadingRequestCount === 0) {
		// 加载请求loading
		NProgress.start()
	}
	loadingRequestCount++
}
// 隐藏加载
export const hideLoading = () => {
	loadingRequestCount--
	if (loadingRequestCount <= 0) {
		// 停止加载
		NProgress.done()
		return
	}
}
